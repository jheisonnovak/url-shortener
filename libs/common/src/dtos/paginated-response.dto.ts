import { ApiProperty } from "@nestjs/swagger";

export class PaginatedResponseDto<T> {
	@ApiProperty({ isArray: true })
	data: T;

	@ApiProperty()
	totalItems: number;

	@ApiProperty()
	itemCount: number;

	@ApiProperty()
	itemsPerPage: number;

	@ApiProperty()
	totalPages: number;

	@ApiProperty()
	currentPage: number;

	constructor(data: T, totalItems: number, itemCount: number, itemsPerPage: number, totalPages: number, currentPage: number) {
		this.data = data;
		this.totalItems = totalItems;
		this.itemCount = itemCount;
		this.itemsPerPage = itemsPerPage;
		this.totalPages = totalPages;
		this.currentPage = currentPage;
	}
}
