import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ListUrlDto, RedisService } from "../../../../../../libs/common/src";
import { IUrlRepository } from "../../models/interfaces/url-repository.interface";

@Injectable()
export class UpdateOriginalUrlUseCase {
	constructor(
		@Inject("IUrlRepository")
		private readonly urlRepository: IUrlRepository,
		private readonly cacheService: RedisService
	) {}

	async execute(shortCode: string, userId: string, updateUrl: string, protocol: string, host: string): Promise<ListUrlDto> {
		const url = await this.urlRepository.findByShortCodeAndUserId(shortCode, userId);
		if (!url) throw new NotFoundException("Link encurtado não encontrado.");

		url.originalUrl = updateUrl;
		const newUrl = await this.urlRepository.save(url);
		await this.cacheService.del(`link:${shortCode}`);
		const shortUrl = `${protocol}://${host}/${newUrl.shortCode}`;
		return new ListUrlDto(newUrl.id, newUrl.originalUrl, shortUrl);
	}
}
