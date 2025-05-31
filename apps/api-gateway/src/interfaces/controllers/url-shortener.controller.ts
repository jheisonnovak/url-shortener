import { Body, Controller, Get, Inject, Param, Post, Res } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { firstValueFrom } from "rxjs";
import { ListUrlDto } from "../../../../../libs/common/src/dtos/list-url.dto";
import { CreateUrlDto } from "../dtos/create-url.dto";

@ApiTags("Encurtador de URLs")
@Controller()
export class UrlShortenerController {
	constructor(@Inject("URL_SHORTENER_SERVICE") private urlShortenerService: ClientProxy) {}

	@Post("shorten")
	@ApiOperation({ summary: "Encurtar URL" })
	@ApiResponse({ status: 201, type: ListUrlDto })
	async shortenUrl(@Body() createUrlDto: CreateUrlDto) {
		return await firstValueFrom(this.urlShortenerService.send<CreateUrlDto>({ cmd: "createUrlShortener" }, createUrlDto));
	}

	@Get(":shortCode")
	@ApiOperation({ summary: "Redirecionar para URL original" })
	async getUrlShortener(@Param("shortCode") shortCode: string, @Res() res: Response) {
		const redirectUrl = await firstValueFrom(this.urlShortenerService.send({ cmd: "getUrlShortener" }, shortCode));
		return res.redirect(redirectUrl);
	}
}
