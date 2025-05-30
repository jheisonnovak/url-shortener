import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { UrlShortenerService } from "./url-shortener.service";

@Controller()
export class UrlShortenerController {
	constructor(private readonly urlShortenerService: UrlShortenerService) {}

	@MessagePattern({ cmd: "getUrlShortener" })
	async getUrlShortner(url: string): Promise<string> {
		return this.urlShortenerService.getUrlShortner(url);
	}
}
