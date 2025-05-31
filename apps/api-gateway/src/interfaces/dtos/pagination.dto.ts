import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class PaginationDto {
	@ApiPropertyOptional({
		description: "Número da página para paginação",
		example: 1,
		minimum: 1,
		default: 1,
	})
	@IsOptional()
	@Type(() => Number)
	@IsInt({ message: "A página deve ser um número inteiro" })
	@Min(1, { message: "A página deve ser maior que 0" })
	page?: number = 1;

	@ApiPropertyOptional({
		description: "Número de itens por página",
		example: 10,
		minimum: 1,
		default: 10,
	})
	@IsOptional()
	@Type(() => Number)
	@IsInt({ message: "O limite deve ser um número inteiro" })
	@Min(1, { message: "O limite deve ser maior que 0" })
	limit?: number = 10;

	@ApiPropertyOptional({
		description: "Termo para busca nos resultados",
		example: "termo de busca",
	})
	@IsOptional()
	@IsString({ message: "O termo de busca deve ser uma string" })
	search?: string;
}
