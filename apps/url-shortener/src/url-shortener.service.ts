import { Injectable } from "@nestjs/common";

@Injectable()
export class UrlShortenerService {
	async getUrlShortner(url: string): Promise<string> {
		return `Shortened URL for '${url}'`;
	}
}
