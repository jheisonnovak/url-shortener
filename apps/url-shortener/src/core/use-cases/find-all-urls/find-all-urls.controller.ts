import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { PaginationDto } from "../../models/dtos/pagination.dto";
import { FindAllUrlsUseCase } from "./find-all-urls.use-case";

@Controller()
export class FindAllUrlsController {
	constructor(private readonly findAllUrlsUseCase: FindAllUrlsUseCase) {}

	@MessagePattern({ cmd: "listShortenedUrls" })
	async listShortenedUrls(data: { userId: string; pagination: PaginationDto; protocol: string; host: string }) {
		return this.findAllUrlsUseCase.execute(data.userId, data.pagination, data.protocol, data.host);
	}
}
