import { UrlEntity } from "../entities/url.entity";

export interface IUrlRepository {
	findAll(userId: string, page: number, limit: number, search?: string): Promise<[UrlEntity[], number]>;
	findByShortCode(shortCode: string): Promise<UrlEntity | null>;
	findByShortCodeAndUserId(shortCode: string, userId: string): Promise<UrlEntity | null>;
	existsByShortCode(code: string): Promise<boolean>;
	save(url: UrlEntity): Promise<UrlEntity>;
	updateClickCount(id: string): Promise<void>;
	delete(id: string): Promise<void>;
}
