import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { UrlEntity } from "../../models/entities/url.entity";
import { IUrlRepository } from "../../models/interfaces/url-repository.interface";

@Injectable()
export class GetOriginalUrlUseCase {
	constructor(
		@Inject("IUrlRepository")
		private readonly urlRepository: IUrlRepository
	) {}

	async execute(url: string): Promise<string> {
		const existingShortUrl = await this.urlRepository.findByShortCode(url);
		if (!existingShortUrl) throw new NotFoundException("URL não encontrada");
		this.addClickCount(existingShortUrl);
		return existingShortUrl.originalUrl;
	}

	async addClickCount(url: UrlEntity): Promise<void> {
		url.clickCount += 1;
		await this.urlRepository.save(url);
	}
}
