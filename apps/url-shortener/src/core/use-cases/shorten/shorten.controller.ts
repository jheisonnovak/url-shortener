import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { ListUrlDto } from "../../../../../../libs/common/src/dtos/list-url.dto";
import { CreateUrlDto } from "../../models/dtos/create-url.dto";
import { ShortenUseCase } from "./shorten.use-case";

@Controller()
export class ShortenController {
	constructor(private readonly shortenUseCase: ShortenUseCase) {}

	@MessagePattern({ cmd: "createUrlShortener" })
	async execute(data: { createUrlDto: CreateUrlDto; userId: string; protocol: string; host: string }): Promise<ListUrlDto> {
		console.log(data.userId);
		return this.shortenUseCase.execute(data.createUrlDto, data.userId, data.protocol, data.host);
	}
}
