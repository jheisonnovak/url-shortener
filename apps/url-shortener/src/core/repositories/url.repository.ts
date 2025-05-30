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

	async findByShortCode(shortCode: string): Promise<UrlEntity | null> {
		return this.urlRepository.findOne({ where: { shortCode, deletedAt: IsNull() } });
	}

	async existsByShortCode(shortCode: string): Promise<boolean> {
		return await this.urlRepository.exists({ where: { shortCode, deletedAt: IsNull() } });
	}

	async save(url: UrlEntity): Promise<UrlEntity> {
		return this.urlRepository.save(url);
	}
}
