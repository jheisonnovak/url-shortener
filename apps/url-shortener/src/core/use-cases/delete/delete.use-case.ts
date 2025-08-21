import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ResponseDto } from "../../../../../../libs/common/src";
import { IUrlRepository } from "../../models/interfaces/url-repository.interface";

@Injectable()
export class DeleteUseCase {
	constructor(
		@Inject("IUrlRepository")
		private readonly urlRepository: IUrlRepository
	) {}

	async execute(shortCode: string, userId: string): Promise<ResponseDto> {
		const url = await this.urlRepository.findByShortCodeAndUserId(shortCode, userId);
		if (!url) throw new NotFoundException("Shortened link not found.");

		await this.urlRepository.delete(url.id);
		return new ResponseDto("Shortened link deleted successfully.");
	}
}
