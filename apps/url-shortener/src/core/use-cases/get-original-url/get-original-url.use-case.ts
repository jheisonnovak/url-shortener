import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IUrlRepository } from "../../models/interfaces/url-repository.interface";

@Injectable()
export class GetOriginalUrlUseCase {
	constructor(
		@Inject("IUrlRepository")
		private readonly urlRepository: IUrlRepository
	) {}

	async execute(url: string): Promise<string> {
		const existingShortUrl = await this.urlRepository.findByShortUrl(url);
		if (!existingShortUrl) throw new NotFoundException("URL não encontrada");
		return existingShortUrl.originalUrl;
	}
}
