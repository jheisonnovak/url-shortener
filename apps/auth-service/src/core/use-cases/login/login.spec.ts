import { UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { compareSync } from "bcrypt";
import { TokenDto } from "../../../../../../libs/common/src";
import { LoginDto } from "../../models/dtos/login.dto";
import { UserEntity } from "../../models/entities/user.entity";
import { IUserRepository } from "../../models/interfaces/user-repository.interface";
import { LoginUseCase } from "./login.use-case";

jest.mock("bcrypt", () => ({
	compareSync: jest.fn(),
}));

describe("LoginUseCase", () => {
	let loginUseCase: LoginUseCase;
	let userRepository: jest.Mocked<IUserRepository>;
	let jwtService: jest.Mocked<JwtService>;
	let compareSyncMock: jest.MockedFunction<typeof compareSync>;

	const mockUser: UserEntity = {
		id: "123e4567-e89b-12d3-a456-426614174000",
		username: "testuser",
		email: "test@example.com",
		password: "$2b$10$hashedpassword",
		createdAt: new Date(),
		isActive: true,
	};

	const mockLoginDto: LoginDto = {
		email: "test@example.com",
		password: "password123",
	};

	beforeEach(async () => {
		const mockUserRepository = {
			findByEmail: jest.fn(),
			save: jest.fn(),
		};

		const mockJwtService = {
			signAsync: jest.fn(),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				LoginUseCase,
				{
					provide: "IUserRepository",
					useValue: mockUserRepository,
				},
				{
					provide: JwtService,
					useValue: mockJwtService,
				},
			],
		}).compile();

		loginUseCase = module.get<LoginUseCase>(LoginUseCase);
		userRepository = module.get("IUserRepository");
		jwtService = module.get(JwtService);
		compareSyncMock = compareSync as jest.MockedFunction<typeof compareSync>;

		jest.clearAllMocks();
	});

	describe("execute", () => {
		it("should successfully login with valid credentials", async () => {
			const expectedToken = "jwt-token-123";
			userRepository.findByEmail.mockResolvedValue(mockUser);
			compareSyncMock.mockReturnValue(true);
			jwtService.signAsync.mockResolvedValue(expectedToken);

			const result = await loginUseCase.execute(mockLoginDto);

			expect(userRepository.findByEmail).toHaveBeenCalledWith(mockLoginDto.email);
			expect(compareSyncMock).toHaveBeenCalledWith(mockLoginDto.password, mockUser.password);
			expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: mockUser.id, email: mockUser.email }, { expiresIn: "15m" });
			expect(result).toBeInstanceOf(TokenDto);
			expect(result.access_token).toBe(expectedToken);
		});

		it("should throw UnauthorizedException when user is not found", async () => {
			userRepository.findByEmail.mockResolvedValue(null);

			await expect(loginUseCase.execute(mockLoginDto)).rejects.toThrow(UnauthorizedException);
			expect(userRepository.findByEmail).toHaveBeenCalledWith(mockLoginDto.email);
			expect(compareSyncMock).not.toHaveBeenCalled();
			expect(jwtService.signAsync).not.toHaveBeenCalled();
		});

		it("should throw UnauthorizedException when password does not match", async () => {
			userRepository.findByEmail.mockResolvedValue(mockUser);
			compareSyncMock.mockReturnValue(false);

			await expect(loginUseCase.execute(mockLoginDto)).rejects.toThrow(UnauthorizedException);
			expect(userRepository.findByEmail).toHaveBeenCalledWith(mockLoginDto.email);
			expect(compareSyncMock).toHaveBeenCalledWith(mockLoginDto.password, mockUser.password);
			expect(jwtService.signAsync).not.toHaveBeenCalled();
		});
	});

	describe("login", () => {
		it("should generate access token for user", async () => {
			const expectedToken = "jwt-token-789";
			jwtService.signAsync.mockResolvedValue(expectedToken);

			const result = await loginUseCase.login(mockUser);

			expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: mockUser.id, email: mockUser.email }, { expiresIn: "15m" });
			expect(result).toBeInstanceOf(TokenDto);
			expect(result.access_token).toBe(expectedToken);
		});
	});
});
