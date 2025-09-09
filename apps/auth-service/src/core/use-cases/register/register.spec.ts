import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { hashSync } from "bcrypt";
import { ListUserDto } from "../../../../../../libs/common/src/dtos/list-user.dto";
import { RegisterDto } from "../../models/dtos/register.dto";
import { UserEntity } from "../../models/entities/user.entity";
import { IUserRepository } from "../../models/interfaces/user-repository.interface";
import { RegisterUseCase } from "./register.use-case";

jest.mock("bcrypt", () => ({
	hashSync: jest.fn(),
}));

describe("RegisterUseCase", () => {
	let registerUseCase: RegisterUseCase;
	let userRepository: jest.Mocked<IUserRepository>;
	let hashSyncMock: jest.MockedFunction<typeof hashSync>;

	const mockRegisterDto: RegisterDto = {
		username: "testuser",
		email: "test@example.com",
		password: "password123",
	};

	const mockHashedPassword = "$2b$10$hashedpassword";

	const mockSavedUser: UserEntity = {
		id: "123e4567-e89b-12d3-a456-426614174000",
		username: "testuser",
		email: "test@example.com",
		password: mockHashedPassword,
		createdAt: new Date(),
		isActive: true,
	};

	beforeEach(async () => {
		const mockUserRepository = {
			findByEmail: jest.fn(),
			save: jest.fn(),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				RegisterUseCase,
				{
					provide: "IUserRepository",
					useValue: mockUserRepository,
				},
			],
		}).compile();

		registerUseCase = module.get<RegisterUseCase>(RegisterUseCase);
		userRepository = module.get("IUserRepository");
		hashSyncMock = hashSync as jest.MockedFunction<typeof hashSync>;

		jest.clearAllMocks();
	});

	describe("execute", () => {
		it("should successfully register a new user", async () => {
			hashSyncMock.mockReturnValue(mockHashedPassword);
			userRepository.save.mockResolvedValue(mockSavedUser);

			const result = await registerUseCase.execute(mockRegisterDto);

			expect(hashSyncMock).toHaveBeenCalledWith(mockRegisterDto.password, 10);
			expect(userRepository.save).toHaveBeenCalledWith(
				expect.objectContaining({
					username: mockRegisterDto.username,
					email: mockRegisterDto.email,
					password: mockHashedPassword,
				})
			);
			expect(result).toBeInstanceOf(ListUserDto);
			expect(result.id).toBe(mockSavedUser.id);
			expect(result.username).toBe(mockSavedUser.username);
			expect(result.email).toBe(mockSavedUser.email);
		});

		it("should throw BadRequestException when username or email already exists", async () => {
			hashSyncMock.mockReturnValue(mockHashedPassword);
			userRepository.save.mockRejectedValue(new Error());

			await expect(registerUseCase.execute(mockRegisterDto)).rejects.toThrow(BadRequestException);
			await expect(registerUseCase.execute(mockRegisterDto)).rejects.toThrow("Username or email already in use");

			expect(hashSyncMock).toHaveBeenCalledWith(mockRegisterDto.password, 10);
			expect(userRepository.save).toHaveBeenCalled();
		});
	});
});
