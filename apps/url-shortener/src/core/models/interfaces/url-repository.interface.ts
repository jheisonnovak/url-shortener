import { UrlEntity } from "../entities/url.entity";

export interface IUrlRepository {
	findByShortCode(shortCode: string): Promise<UrlEntity | null>;
	existsByShortCode(code: string): Promise<boolean>;
	save(url: UrlEntity): Promise<UrlEntity>;
}
