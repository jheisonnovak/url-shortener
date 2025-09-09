import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto {
	@ApiProperty()
	@IsEmail({}, { message: "Invalid email" })
	@IsNotEmpty({ message: "Email cannot be empty" })
	email: string;

	@ApiProperty()
	@IsNotEmpty({ message: "Password cannot be empty" })
	password: string;
}
