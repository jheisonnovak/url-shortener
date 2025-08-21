import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class PaginationDto {
	@ApiPropertyOptional({
		description: "Page number for pagination",
		example: 1,
		minimum: 1,
		default: 1,
	})
	@IsOptional()
	@Type(() => Number)
	@IsInt({ message: "Page must be an integer" })
	@Min(1, { message: "Page must be greater than 0" })
	page?: number = 1;

	@ApiPropertyOptional({
		description: "Number of items per page",
		example: 10,
		minimum: 1,
		default: 10,
	})
	@IsOptional()
	@Type(() => Number)
	@IsInt({ message: "Limit must be an integer" })
	@Min(1, { message: "Limit must be greater than 0" })
	limit?: number = 10;

	@ApiPropertyOptional({
		description: "Search term for filtering results",
	})
	@IsOptional()
	@IsString({ message: "Search term must be a string" })
	search?: string;
}
