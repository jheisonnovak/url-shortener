import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class RegisterDto {
	@ApiProperty()
	@IsNotEmpty({ message: "O username é obrigatório." })
	@IsString({ message: "O username deve ser uma string." })
	username: string;

	@ApiProperty()
	@IsNotEmpty({ message: "O email é obrigatório." })
	@IsEmail({}, { message: "O email deve ser um email válido." })
	email: string;

	@ApiProperty()
	@IsNotEmpty({ message: "A senha é obrigatória." })
	@IsStrongPassword(
		{ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 },
		{ message: "A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um símbolo." }
	)
	password: string;
}
