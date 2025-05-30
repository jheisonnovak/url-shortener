import { Controller, Get, Inject, Param, Res } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Response } from "express";
import { firstValueFrom } from "rxjs";

@Controller()
export class UrlShortnerController {
	constructor(@Inject("URL_SHORTENER_SERVICE") private urlShortenerService: ClientProxy) {}

	@Get(":url")
	async getUrlShortner(@Param("url") url: string, @Res() res: Response) {
		const redirectUrl = await firstValueFrom(this.urlShortenerService.send({ cmd: "getUrlShortener" }, url));
		return res.redirect(redirectUrl);
	}
}
