import { Body, Controller, Delete, Get, Inject, Param, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { firstValueFrom } from "rxjs";
import { CurrentUser, JwtAuthGuard, JwtPayload, ListDetailedUrlDto, OptionalAuthGuard, ResponseDto } from "../../../../../libs/common/src";
import { ListUrlDto } from "../../../../../libs/common/src/dtos/list-url.dto";
import { PaginatedResponse } from "../../decorators/paginated-response.decorator";
import { CreateUrlDto } from "../dtos/create-url.dto";
import { PaginationDto } from "../dtos/pagination.dto";

@ApiTags("Encurtador de URLs")
@Controller()
export class UrlShortenerController {
	constructor(@Inject("URL_SHORTENER_SERVICE") private urlShortenerService: ClientProxy) {}

	@Post("shorten")
	@ApiOperation({ summary: "Encurtar URL" })
	@UseGuards(OptionalAuthGuard)
	@ApiBearerAuth()
	@ApiResponse({ status: 201, type: ListUrlDto })
	async shortenUrl(@Body() createUrlDto: CreateUrlDto, @Req() req: Request, @CurrentUser() user: JwtPayload) {
		return await firstValueFrom(
			this.urlShortenerService.send<CreateUrlDto>(
				{ cmd: "createUrlShortener" },
				{ createUrlDto, userId: user?.sub, protocol: req.protocol, host: req.get("host") }
			)
		);
	}

	@Get(":shortCode")
	@ApiOperation({ summary: "Redirecionar para URL original" })
	async getUrlShortener(@Param("shortCode") shortCode: string, @Res() res: Response) {
		const redirectUrl = await firstValueFrom(this.urlShortenerService.send({ cmd: "getUrlShortener" }, shortCode));
		return res.redirect(redirectUrl);
	}

	@Get("shortener/list")
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: "Listar URLs encurtadas pelo usuário" })
	@PaginatedResponse(ListDetailedUrlDto)
	async listShortenedUrls(@CurrentUser() user: JwtPayload, @Req() req: Request, @Query() pagination?: PaginationDto) {
		return await firstValueFrom(
			this.urlShortenerService.send<ListDetailedUrlDto[]>(
				{ cmd: "listShortenedUrls" },
				{ userId: user.sub, pagination, protocol: req.protocol, host: req.get("host") }
			)
		);
	}

	@Delete("shortener/:shortCode")
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: "Excluir URL encurtada" })
	@ApiResponse({ type: ResponseDto })
	async deleteShortenedUrl(@Param("shortCode") shortCode: string, @CurrentUser() user: JwtPayload) {
		return await firstValueFrom(this.urlShortenerService.send<ResponseDto>({ cmd: "deleteShortenedUrl" }, { shortCode, userId: user.sub }));
	}
}
