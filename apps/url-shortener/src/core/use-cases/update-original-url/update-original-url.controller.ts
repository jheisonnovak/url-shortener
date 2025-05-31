import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { UpdateOriginalUrlUseCase } from "./update-original-url.use-case";

@Controller()
export class UpdateOriginalUrlController {
	constructor(private readonly updateOriginalUrlUseCase: UpdateOriginalUrlUseCase) {}

	@MessagePattern({ cmd: "updateShortenedUrl" })
	async updateShortenedUrl(data: { shortCode: string; userId: string; updateUrl: string; protocol: string; host: string }): Promise<any> {
		return await this.updateOriginalUrlUseCase.execute(data.shortCode, data.userId, data.updateUrl, data.protocol, data.host);
	}
}
