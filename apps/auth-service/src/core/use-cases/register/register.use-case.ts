import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { hashSync } from "bcrypt";
import { ListUserDto } from "../../../../../../libs/common/src/dtos/list-user.dto";
import { RegisterDto } from "../../models/dtos/register.dto";
import { UserEntity } from "../../models/entities/user.entity";
import { IUserRepository } from "../../models/interfaces/user-repository.interface";

@Injectable()
export class RegisterUseCase {
	constructor(
		@Inject("IUserRepository")
		private readonly userRepository: IUserRepository
	) {}

	async execute(userDto: RegisterDto): Promise<ListUserDto> {
		const user = new UserEntity();
		user.username = userDto.username;
		user.email = userDto.email;
		user.password = hashSync(userDto.password, 10);

		try {
			const userEntity = await this.userRepository.save(user);
			return new ListUserDto(userEntity.id, userEntity.username, userEntity.email);
		} catch {
			throw new BadRequestException("Username ou email já estão em uso");
		}
	}
}
