import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@Controller("auth")
export class AuthLoginController {
	constructor(@Inject("AUTH_SERVICE") private authClient: ClientProxy) {}

	@Post("login")
	async login(@Body() loginDto: string) {
		return this.authClient.send({ cmd: "login" }, loginDto);
	}
}
