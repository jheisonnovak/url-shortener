import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags, OmitType } from "@nestjs/swagger";
import { Request, Response } from "express";
import { join } from "path";
import { firstValueFrom } from "rxjs";
import { CurrentUser, JwtAuthGuard, JwtPayload, ListDetailedUrlDto, OptionalAuthGuard, ResponseDto } from "../../../../../libs/common/src";
import { ListUrlDto } from "../../../../../libs/common/src/dtos/list-url.dto";
import { PaginatedResponse } from "../../decorators/paginated-response.decorator";
import { CreateUrlDto } from "../dtos/create-url.dto";
import { PaginationDto } from "../dtos/pagination.dto";
import { UpdateUrlDto } from "../dtos/update-url.dto";

@ApiTags("Encurtador de URLs")
@Controller()
export class UrlShortenerController {
	constructor(@Inject("URL_SHORTENER_SERVICE") private urlShortenerService: ClientProxy) {}

	@Post("shortener")
	@ApiOperation({
		summary: "Encurtar URL (sem e com autenticação)",
		description: "Cria um código encurtado para a URL fornecida. Caso seja criado como usuário autenticado, o código será associado à sua conta.",
	})
	@UseGuards(OptionalAuthGuard)
	@ApiBearerAuth()
	@ApiResponse({ status: 201, type: ListUrlDto })
	@ApiResponse({ status: 404, description: "Código encurtado não disponível" })
	async shortenUrl(@Body() createUrlDto: CreateUrlDto, @Req() req: Request, @CurrentUser() user: JwtPayload) {
		return await firstValueFrom(
			this.urlShortenerService.send<CreateUrlDto>(
				{ cmd: "createUrlShortener" },
				{ createUrlDto, userId: user?.sub, protocol: req.protocol, host: req.get("host") }
			)
		);
	}

	@Get("shortener")
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: "Listar URLs encurtadas pelo usuário" })
	@PaginatedResponse(ListDetailedUrlDto)
	@ApiResponse({ status: 401, description: "Unauthorized" })
	async listShortenedUrls(@CurrentUser() user: JwtPayload, @Req() req: Request, @Query() pagination?: PaginationDto) {
		return await firstValueFrom(
			this.urlShortenerService.send<ListDetailedUrlDto[]>(
				{ cmd: "listShortenedUrls" },
				{ userId: user.sub, pagination, protocol: req.protocol, host: req.get("host") }
			)
		);
	}

	@Get(":shortCode")
	@ApiParam({ name: "shortCode", description: "Código da URL encurtada", example: "abc123" })
	@ApiOperation({
		summary: "Redirecionar para URL original",
		description: "Utilize em um navegador para acessar a URL original. Ex: http://<host>/abc123",
	})
	@ApiResponse({ status: 302 })
	async getUrlShortener(@Param("shortCode") shortCode: string, @Res() res: Response) {
		try {
			const redirectUrl = await firstValueFrom(this.urlShortenerService.send({ cmd: "getUrlShortener" }, shortCode));
			return res.redirect(redirectUrl);
		} catch {
			return res.status(404).sendFile("not-found-page.html", { root: join(process.cwd(), "public") });
		}
	}

	@Patch("shortener/:shortCode")
	@ApiParam({ name: "shortCode", description: "Código da URL encurtada", example: "abc123" })
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: "Atualizar URL de origem" })
	@ApiResponse({ type: OmitType(ListUrlDto, ["userId"]) })
	@ApiResponse({ status: 401, description: "Unauthorized" })
	@ApiResponse({ status: 404, description: "Link encurtado não encontrado." })
	async updateShortenedUrl(
		@Param("shortCode") shortCode: string,
		@Body() updateUrlDto: UpdateUrlDto,
		@CurrentUser() user: JwtPayload,
		@Req() req: Request
	) {
		return await firstValueFrom(
			this.urlShortenerService.send<ResponseDto>(
				{ cmd: "updateShortenedUrl" },
				{ shortCode, userId: user.sub, updateUrl: updateUrlDto.originalUrl, protocol: req.protocol, host: req.get("host") }
			)
		);
	}

	@Delete("shortener/:shortCode")
	@ApiParam({ name: "shortCode", description: "Código da URL encurtada", example: "abc123" })
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: "Excluir URL encurtada" })
	@ApiResponse({ type: ResponseDto })
	@ApiResponse({ status: 401, description: "Unauthorized" })
	@ApiResponse({ status: 404, description: "Link encurtado não encontrado." })
	async deleteShortenedUrl(@Param("shortCode") shortCode: string, @CurrentUser() user: JwtPayload) {
		return await firstValueFrom(this.urlShortenerService.send<ListUrlDto>({ cmd: "deleteShortenedUrl" }, { shortCode, userId: user.sub }));
	}
}
