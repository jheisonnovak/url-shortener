import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { RedisService } from "../../../../../../libs/common/src";
import { UrlEntity } from "../../models/entities/url.entity";
import { IUrlRepository } from "../../models/interfaces/url-repository.interface";

@Injectable()
export class GetOriginalUrlUseCase {
	constructor(
		@Inject("IUrlRepository")
		private readonly urlRepository: IUrlRepository,
		private readonly cacheService: RedisService
	) {}

	async execute(url: string): Promise<string> {
		const existingShortUrl = await this.getLink(url);
		this.addClickCount(existingShortUrl);
		return existingShortUrl.originalUrl;
	}

	async addClickCount(url: UrlEntity): Promise<void> {
		await this.urlRepository.updateClickCount(url.id);
	}

	async getLink(url: string): Promise<UrlEntity> {
		const cacheKey = `link:${url}`;
		const cached = await this.cacheService.get<UrlEntity>(cacheKey);
		if (cached) return cached;

		const existingShortUrl = await this.urlRepository.findByShortCode(url);
		if (!existingShortUrl) throw new NotFoundException("URL não encontrada");

		await this.cacheService.set(cacheKey, existingShortUrl, 300);
		return existingShortUrl;
	}
}
