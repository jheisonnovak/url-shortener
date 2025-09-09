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

	async findAll(userId: string, page: number, limit: number, search?: string): Promise<[UrlEntity[], number]> {
		const query = this.urlRepository
			.createQueryBuilder("url")
			.select(["url.id", "url.shortCode", "url.originalUrl", "url.clickCount", "url.createdAt", "url.updatedAt"])
			.where("url.userId = :userId", { userId })
			.andWhere("url.deletedAt IS NULL")
			.take(limit)
			.skip((page - 1) * limit)
			.orderBy("url.createdAt", "DESC");
		if (search) query.andWhere("url.originalUrl ILIKE :search", { search: `%${search}%` });

		return query.getManyAndCount();
	}

	async findByShortCode(shortCode: string): Promise<UrlEntity | null> {
		return this.urlRepository.findOne({ where: { shortCode, deletedAt: IsNull() } });
	}

	async findByShortCodeAndUserId(shortCode: string, userId: string): Promise<UrlEntity | null> {
		return this.urlRepository.findOne({ where: { shortCode, userId, deletedAt: IsNull() } });
	}

	async existsByShortCode(shortCode: string): Promise<boolean> {
		return await this.urlRepository.exists({ where: { shortCode, deletedAt: IsNull() } });
	}

	async save(url: UrlEntity): Promise<UrlEntity> {
		return this.urlRepository.save(url);
	}

	async updateClickCount(id: string): Promise<void> {
		await this.urlRepository.increment({ id }, "clickCount", 1);
	}

	async delete(id: string): Promise<void> {
		await this.urlRepository.delete(id);
	}
}
