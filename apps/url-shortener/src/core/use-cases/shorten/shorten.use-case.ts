import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ListUrlDto } from "../../../../../../libs/common/src/dtos/list-url.dto";
import { CreateUrlDto } from "../../models/dtos/create-url.dto";
import { UrlEntity } from "../../models/entities/url.entity";
import { IUrlRepository } from "../../models/interfaces/url-repository.interface";

@Injectable()
export class ShortenUseCase {
	constructor(
		@Inject("IUrlRepository")
		private readonly urlRepository: IUrlRepository
	) {}
	private readonly characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	private readonly codeLength = 6;

	async execute(createUrlDto: CreateUrlDto, userId: string): Promise<ListUrlDto> {
		const url = new UrlEntity();
		url.originalUrl = createUrlDto.originalUrl;
		url.shortCode = !createUrlDto.customCode ? await this.createShortCode() : await this.validateShortCodeExists(createUrlDto.customCode);
		url.userId = userId;

		const createdUrl = await this.urlRepository.save(url);
		return new ListUrlDto(createdUrl.id, createdUrl.originalUrl, createdUrl.shortCode, userId);
	}

	private async createShortCode(): Promise<string> {
		let code: string;
		do {
			code = this.generateShortCode();
		} while (await this.urlRepository.existsByShortCode(code));
		return code;
	}

	private generateShortCode(): string {
		let result = "";
		const charactersLength = this.characters.length;
		for (let i = 0; i < this.codeLength; i++) {
			result += this.characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}

	private async validateShortCodeExists(code: string): Promise<string> {
		if (await this.urlRepository.existsByShortCode(code)) throw new NotFoundException("Código encurtado não disponível");
		return code;
	}
}
