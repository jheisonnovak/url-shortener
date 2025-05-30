import { Body, Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { AuthServiceService } from "./auth-service.service";

@Controller("auth")
export class AuthServiceController {
	constructor(private readonly authServiceService: AuthServiceService) {}

	@MessagePattern({ cmd: "login" })
	async login(@Body() loginDto: string) {
		return this.authServiceService.login(loginDto);
	}
}
