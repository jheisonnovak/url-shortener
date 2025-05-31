import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "../models/entities/user.entity";
import { IUserRepository } from "../models/interfaces/user-repository.interface";

export class UserTypeOrmRepository implements IUserRepository {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>
	) {}

	async findByEmail(email: string): Promise<UserEntity | null> {
		return this.userRepository.findOne({
			where: { email, isActive: true },
		});
	}

	async save(user: UserEntity): Promise<UserEntity> {
		return this.userRepository.save(user);
	}
}
