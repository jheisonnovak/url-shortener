import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { TokenDto } from "../../../../../../libs/common/src";
import { LoginDto } from "../../models/dtos/login.dto";
import { LoginUseCase } from "./login.use-case";

@Controller("auth")
export class LoginController {
	constructor(private readonly loginUseCase: LoginUseCase) {}

	@MessagePattern({ cmd: "login" })
	async execute(loginDto: LoginDto): Promise<TokenDto> {
		return this.loginUseCase.execute(loginDto);
	}
}
