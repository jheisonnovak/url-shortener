import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { ResponseDto } from "../../../../../../libs/common/src";
import { DeleteUseCase } from "./delete.use-case";

@Controller()
export class DeleteController {
	constructor(private readonly deleteUseCase: DeleteUseCase) {}

	@MessagePattern({ cmd: "deleteShortenedUrl" })
	async deleteShortenedUrl(data: { shortCode: string; userId: string }): Promise<ResponseDto> {
		return await this.deleteUseCase.execute(data.shortCode, data.userId);
	}
}
