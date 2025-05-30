import { ApiProperty } from "@nestjs/swagger";

export class ListUrlDto {
	@ApiProperty()
	id: string;

	@ApiProperty()
	originalUrl: string;

	@ApiProperty()
	shortUrl: string;

	constructor(id: string, originalUrl: string, shortUrl: string) {
		this.id = id;
		this.originalUrl = originalUrl;
		this.shortUrl = shortUrl;
	}
}
