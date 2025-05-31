import { ApiProperty } from "@nestjs/swagger";

export class ListDetailedUrlDto {
	@ApiProperty()
	id: string;

	@ApiProperty()
	originalUrl: string;

	@ApiProperty()
	shortUrl: string;

	@ApiProperty()
	clickCount: number;

	@ApiProperty()
	createdAt: string;

	@ApiProperty()
	updatedAt: string;

	constructor(id: string, originalUrl: string, shortUrl: string, clickCount: number, createdAt: Date, updatedAt: Date) {
		this.id = id;
		this.originalUrl = originalUrl;
		this.shortUrl = shortUrl;
		this.clickCount = clickCount;
		this.createdAt = createdAt.toLocaleString("pt-BR");
		this.updatedAt = updatedAt.toLocaleString("pt-BR");
	}
}
