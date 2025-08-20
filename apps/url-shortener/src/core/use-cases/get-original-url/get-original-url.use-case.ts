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
		const cached = await this.getFromCache(url);
		if (cached) return cached.originalUrl;

		const existingShortUrl = await this.urlRepository.findByShortCode(url);
		if (!existingShortUrl) {
			await this.cacheService.set(`link:${url}`, null, 60);
			throw new NotFoundException("URL not found");
		}
		this.incrementClickCountAsync(existingShortUrl.id);

		const ttl = this.calculateTTL(existingShortUrl.clickCount);
		await this.cacheService.set(`link:${url}`, JSON.stringify(existingShortUrl), ttl);

		return existingShortUrl.originalUrl;
	}

	private async getFromCache(url: string): Promise<UrlEntity | null> {
		return this.cacheService.get<UrlEntity>(`link:${url}`);
	}

	private calculateTTL(clickCount: number): number {
		if (clickCount > 1000) return 3600;
		if (clickCount > 100) return 1800;
		return 300;
	}

	private async incrementClickCountAsync(id: string): Promise<void> {
		setImmediate(async () => {
			try {
				await this.urlRepository.updateClickCount(id);
			} catch (error) {
				console.error("Failed to increment click count:", error);
			}
		});
	}
}
