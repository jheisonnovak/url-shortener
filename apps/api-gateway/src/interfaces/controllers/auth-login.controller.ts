import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { firstValueFrom } from "rxjs";
import { ListUserDto, TokenDto } from "../../../../../libs/common/src";
import { LoginDto } from "../dtos/login.dto";
import { RegisterDto } from "../dtos/register.dto";

@ApiTags("Authentication")
@Controller("auth")
export class AuthLoginController {
	constructor(@Inject("AUTH_SERVICE") private authClient: ClientProxy) {}

	@Post("login")
	@ApiOperation({ summary: "Authenticate user" })
	@ApiResponse({ status: 200, description: "Login successful", type: TokenDto })
	@ApiResponse({ status: 401, description: "Invalid user or password" })
	async login(@Body() loginDto: LoginDto): Promise<TokenDto> {
		return firstValueFrom(this.authClient.send<TokenDto>({ cmd: "login" }, loginDto));
	}

	@Post("register")
	@ApiOperation({ summary: "Register new user" })
	@ApiResponse({ status: 201, description: "User registered successfully", type: ListUserDto })
	@ApiResponse({ status: 400, description: "Username or email already in use" })
	async register(@Body() registerDto: RegisterDto): Promise<ListUserDto> {
		return firstValueFrom(this.authClient.send<ListUserDto>({ cmd: "register" }, registerDto));
	}
}
