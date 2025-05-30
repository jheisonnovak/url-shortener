import { UrlEntity } from "../entities/url.entity";

export interface IUrlRepository {
	findByShortUrl(originalUrl: string): Promise<UrlEntity | null>;
	existsByCode(code: string): Promise<boolean>;
	save(url: UrlEntity): Promise<UrlEntity>;
}
