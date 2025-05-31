import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto {
	@ApiProperty()
	@IsEmail({}, { message: "Email inválido" })
	@IsNotEmpty({ message: "O email não pode estar vazio" })
	email: string;

	@ApiProperty()
	@IsNotEmpty({ message: "A senha não pode estar vazia" })
	password: string;
}
