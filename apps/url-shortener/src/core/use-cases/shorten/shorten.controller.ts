import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { ShortenUseCase } from "./shorten.use-case";

@Controller()
export class ShortenController {
	constructor(private readonly shortenUseCase: ShortenUseCase) {}

	@MessagePattern({ cmd: "getUrlShortener" })
	async execute(url: string): Promise<string> {
		return this.shortenUseCase.execute(url);
	}
}
