import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { ListUserDto } from "../../../../../../libs/common/src/dtos/list-user.dto";
import { RegisterDto } from "../../models/dtos/register.dto";
import { RegisterUseCase } from "./register.use-case";

@Controller("auth")
export class RegisterController {
	constructor(private readonly registerUseCase: RegisterUseCase) {}

	@MessagePattern({ cmd: "register" })
	async execute(registerDto: RegisterDto): Promise<ListUserDto> {
		return await this.registerUseCase.execute(registerDto);
	}
}
