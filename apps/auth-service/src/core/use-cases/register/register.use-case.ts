import { ListUserDto, MetricsService } from "@app/common";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { hashSync } from "bcrypt";
import { RegisterDto } from "../../models/dtos/register.dto";
import { UserEntity } from "../../models/entities/user.entity";
import { IUserRepository } from "../../models/interfaces/user-repository.interface";

@Injectable()
export class RegisterUseCase {
	constructor(
		@Inject("IUserRepository")
		private readonly userRepository: IUserRepository,
		private readonly metricsService: MetricsService
	) {}

	async execute(userDto: RegisterDto): Promise<ListUserDto> {
		const user = new UserEntity();
		user.username = userDto.username;
		user.email = userDto.email;
		user.password = hashSync(userDto.password, 10);

		try {
			const userEntity = await this.userRepository.save(user);
			this.metricsService.recordAuthentication("register", "success");
			return new ListUserDto(userEntity.id, userEntity.username, userEntity.email);
		} catch {
			this.metricsService.recordAuthentication("register", "failure");
			throw new BadRequestException("Username or email already in use");
		}
	}
}
