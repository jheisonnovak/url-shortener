import { Controller, Get, Inject, Param } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@Controller()
export class UrlShortnerController {
	constructor(@Inject("URL_SHORTENER_SERVICE") private urlShortenerService: ClientProxy) {}

	@Get(":url")
	async getUrlShortner(@Param("url") url: string) {
		return this.urlShortenerService.send({ cmd: "getUrlShortener" }, url);
	}
}
