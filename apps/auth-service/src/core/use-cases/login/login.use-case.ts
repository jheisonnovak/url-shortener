import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compareSync } from "bcrypt";
import { TokenDto } from "../../../../../../libs/common/src";
import { LoginDto } from "../../models/dtos/login.dto";
import { UserEntity } from "../../models/entities/user.entity";
import { IUserRepository } from "../../models/interfaces/user-repository.interface";

@Injectable()
export class LoginUseCase {
	constructor(
		@Inject("IUserRepository")
		private readonly userRepository: IUserRepository,
		private readonly jwtService: JwtService
	) {}

	async execute(loginDto: LoginDto): Promise<TokenDto> {
		const user = await this.userRepository.findByEmail(loginDto.email);
		if (!user) throw new UnauthorizedException();
		const isMatch = compareSync(loginDto.password, user.password);
		if (!isMatch) throw new UnauthorizedException();
		return this.login(user);
	}

	async login(user: UserEntity) {
		const payload = { sub: user.id, email: user.email };
		const access_token = await this.jwtService.signAsync(payload, {
			expiresIn: process.env.JWT_EXPIRES_IN || "15m",
		});
		return new TokenDto(access_token);
	}
}
