import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { firstValueFrom } from "rxjs";
import { ListUserDto, TokenDto } from "../../../../../libs/common/src";
import { LoginDto } from "../dtos/login.dto";
import { RegisterDto } from "../dtos/register.dto";

@ApiTags("Autenticação")
@Controller("auth")
export class AuthLoginController {
	constructor(@Inject("AUTH_SERVICE") private authClient: ClientProxy) {}

	@Post("login")
	@ApiOperation({ summary: "Autenticar usuário" })
	@ApiResponse({ status: 200, description: "Login realizado com sucesso", type: TokenDto })
	@ApiResponse({ status: 401, description: "Usuário ou senha inválidos" })
	async login(@Body() loginDto: LoginDto): Promise<TokenDto> {
		return firstValueFrom(this.authClient.send<TokenDto>({ cmd: "login" }, loginDto));
	}

	@Post("register")
	@ApiOperation({ summary: "Registrar novo usuário" })
	@ApiResponse({ status: 201, description: "Usuário registrado com sucesso", type: ListUserDto })
	async register(@Body() registerDto: RegisterDto): Promise<ListUserDto> {
		return firstValueFrom(this.authClient.send<ListUserDto>({ cmd: "register" }, registerDto));
	}
}
