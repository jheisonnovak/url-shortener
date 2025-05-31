import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ListUrlDto {
	@ApiProperty()
	id: string;

	@ApiProperty()
	originalUrl: string;

	@ApiProperty()
	shortUrl: string;

	@ApiPropertyOptional()
	userId?: string;

	constructor(id: string, originalUrl: string, shortUrl: string, userId?: string) {
		this.id = id;
		this.originalUrl = originalUrl;
		this.shortUrl = shortUrl;
		this.userId = userId;
	}
}
