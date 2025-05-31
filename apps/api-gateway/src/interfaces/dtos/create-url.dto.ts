import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUrl, Length } from "class-validator";

export class CreateUrlDto {
	@ApiProperty({
		description: "URL original para ser encurtada",
		example: "https://www.exemplo.com/pagina-muito-longa",
	})
	@IsUrl()
	@IsNotEmpty()
	originalUrl: string;

	@ApiPropertyOptional({
		description: "Código personalizado (opcional)",
		example: "meulnk",
	})
	@Length(6, 6, { message: "O código personalizado deve ter exatamente 6 caracteres." })
	@IsOptional()
	@IsString()
	customCode?: string;
}
