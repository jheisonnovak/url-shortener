import { UrlEntity } from "../entities/url.entity";

export interface IUrlRepository {
	findAll(userId: string, page: number, limit: number, search?: string): Promise<[UrlEntity[], number]>;
	findByShortCode(shortCode: string): Promise<UrlEntity | null>;
	existsByShortCode(code: string): Promise<boolean>;
	save(url: UrlEntity): Promise<UrlEntity>;
	delete(id: string): Promise<void>;
}
