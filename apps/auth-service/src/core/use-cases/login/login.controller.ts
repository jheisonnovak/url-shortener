import { Body, Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { LoginUseCase } from "./login.use-case";

@Controller("auth")
export class AuthServiceController {
	constructor(private readonly loginUseCase: LoginUseCase) {}

	@MessagePattern({ cmd: "login" })
	async login(@Body() loginDto: string) {
		return this.loginUseCase.login(loginDto);
	}
}
