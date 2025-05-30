import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { ListUrlDto } from "../../../../../../libs/common/src/dtos/list-url.dto";
import { CreateUrlDto } from "../../models/dtos/create-url.dto";
import { ShortenUseCase } from "./shorten.use-case";

@Controller()
export class ShortenController {
	constructor(private readonly shortenUseCase: ShortenUseCase) {}

	@MessagePattern({ cmd: "createUrlShortener" })
	async execute(createUrlDto: CreateUrlDto): Promise<ListUrlDto> {
		return this.shortenUseCase.execute(createUrlDto);
	}
}
