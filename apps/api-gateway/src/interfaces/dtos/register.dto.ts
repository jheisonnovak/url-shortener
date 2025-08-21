import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class RegisterDto {
	@ApiProperty()
	@IsNotEmpty({ message: "Username is required." })
	@IsString({ message: "Username must be a string." })
	username: string;

	@ApiProperty()
	@IsNotEmpty({ message: "Email is required." })
	@IsEmail({}, { message: "Email must be a valid email." })
	email: string;

	@ApiProperty()
	@IsNotEmpty({ message: "Password is required." })
	@IsStrongPassword(
		{ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 },
		{ message: "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one symbol." }
	)
	password: string;
}
