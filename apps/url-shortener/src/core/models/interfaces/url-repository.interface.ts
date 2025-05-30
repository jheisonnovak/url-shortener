import { UrlEntity } from "../entities/url.entity";

export interface IUrlRepository {
	findByShortUrl(originalUrl: string): Promise<UrlEntity | null>;
}
