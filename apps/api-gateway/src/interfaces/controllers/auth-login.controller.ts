import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Autenticação")
@Controller("auth")
export class AuthLoginController {
	constructor(@Inject("AUTH_SERVICE") private authClient: ClientProxy) {}

	@Post("login")
	@ApiOperation({ summary: "Autenticar usuário" })
	@ApiResponse({ status: 200, description: "Login realizado com sucesso" })
	@ApiResponse({ status: 401, description: "Usuário ou senha inválidos" })
	async login(@Body() loginDto: string) {
		return this.authClient.send({ cmd: "login" }, loginDto);
	}
}
