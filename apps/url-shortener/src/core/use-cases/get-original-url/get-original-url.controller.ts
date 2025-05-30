import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { GetOriginalUrlUseCase } from "./get-original-url.use-case";

@Controller()
export class GetOriginalUrlController {
	constructor(private readonly shortenUseCase: GetOriginalUrlUseCase) {}

	@MessagePattern({ cmd: "getUrlShortener" })
	async execute(url: string): Promise<string> {
		return this.shortenUseCase.execute(url);
	}
}
