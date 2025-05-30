import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { UrlEntity } from "../models/entities/url.entity";
import { IUrlRepository } from "../models/interfaces/url-repository.interface";

@Injectable()
export class UrlTypeOrmRepository implements IUrlRepository {
	constructor(
		@InjectRepository(UrlEntity)
		private readonly urlRepository: Repository<UrlEntity>
	) {}

	async findByShortUrl(shortUrl: string): Promise<UrlEntity | null> {
		return this.urlRepository.findOne({ where: { shortUrl, deletedAt: IsNull() } });
	}
}
