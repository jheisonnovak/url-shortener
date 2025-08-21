import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUrl, Length } from "class-validator";

export class CreateUrlDto {
	@ApiProperty({
		description: "Original URL to be shortened",
		example: "https://www.example.com/very-long-page",
	})
	@IsUrl()
	@IsNotEmpty()
	originalUrl: string;

	@ApiPropertyOptional({
		description: "Custom code (optional)",
		example: "mylink",
	})
	@Length(6, 6, { message: "Custom code must be exactly 6 characters." })
	@IsOptional()
	@IsString()
	customCode?: string;
}
