import { MetricsService, TokenDto } from "@app/common";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compareSync } from "bcrypt";
import { LoginDto } from "../../models/dtos/login.dto";
import { UserEntity } from "../../models/entities/user.entity";
import { IUserRepository } from "../../models/interfaces/user-repository.interface";

@Injectable()
export class LoginUseCase {
	constructor(
		@Inject("IUserRepository")
		private readonly userRepository: IUserRepository,
		private readonly jwtService: JwtService,
		private readonly metricsService: MetricsService
	) {}

	async execute(loginDto: LoginDto): Promise<TokenDto> {
		try {
			const user = await this.userRepository.findByEmail(loginDto.email);
			if (!user) {
				this.metricsService.recordAuthentication("login", "failure");
				throw new UnauthorizedException();
			}
			const isMatch = compareSync(loginDto.password, user.password);
			if (!isMatch) {
				this.metricsService.recordAuthentication("login", "failure");
				throw new UnauthorizedException();
			}

			this.metricsService.recordAuthentication("login", "success");
			return this.login(user);
		} catch (error) {
			if (!(error instanceof UnauthorizedException)) {
				this.metricsService.recordAuthentication("login", "failure");
			}
			throw error;
		}
	}

	async login(user: UserEntity): Promise<TokenDto> {
		const payload = { sub: user.id, email: user.email };
		const access_token = await this.jwtService.signAsync(payload, {
			expiresIn: process.env.JWT_EXPIRES_IN || "15m",
		});
		return new TokenDto(access_token);
	}
}
