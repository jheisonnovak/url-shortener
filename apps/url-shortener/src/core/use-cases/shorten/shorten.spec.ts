import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { ListUrlDto } from "../../../../../../libs/common/src";
import { CreateUrlDto } from "../../models/dtos/create-url.dto";
import { UrlEntity } from "../../models/entities/url.entity";
import { IUrlRepository } from "../../models/interfaces/url-repository.interface";
import { ShortenUseCase } from "./shorten.use-case";

describe("ShortenUseCase", () => {
	let shortenUseCase: ShortenUseCase;
	let urlRepository: jest.Mocked<IUrlRepository>;

	const mockCreateUrlDto: CreateUrlDto = {
		originalUrl: "https://example.com",
	};

	const mockCreateUrlDtoWithCustomCode: CreateUrlDto = {
		originalUrl: "https://example.com",
		customCode: "custom",
	};

	const mockSavedUrl: UrlEntity = {
		id: "123e4567-e89b-12d3-a456-426614174000",
		userId: "user-123",
		originalUrl: "https://example.com",
		shortCode: "abc123",
		clickCount: 0,
		createdAt: new Date(),
		updatedAt: new Date(),
	} as UrlEntity;

	beforeEach(async () => {
		const mockUrlRepository = {
			findAll: jest.fn(),
			findByShortCode: jest.fn(),
			findByShortCodeAndUserId: jest.fn(),
			existsByShortCode: jest.fn(),
			save: jest.fn(),
			delete: jest.fn(),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ShortenUseCase,
				{
					provide: "IUrlRepository",
					useValue: mockUrlRepository,
				},
			],
		}).compile();

		shortenUseCase = module.get<ShortenUseCase>(ShortenUseCase);
		urlRepository = module.get("IUrlRepository");

		jest.clearAllMocks();
	});

	describe("execute", () => {
		it("should successfully create a shortened URL with auto-generated code", async () => {
			urlRepository.existsByShortCode.mockResolvedValue(false);
			urlRepository.save.mockResolvedValue(mockSavedUrl);

			const result = await shortenUseCase.execute(mockCreateUrlDto, "user-123", "http", "localhost:3000");

			expect(urlRepository.existsByShortCode).toHaveBeenCalled();
			expect(urlRepository.save).toHaveBeenCalledWith(
				expect.objectContaining({
					originalUrl: "https://example.com",
					userId: "user-123",
					shortCode: expect.any(String),
				})
			);
			expect(result).toBeInstanceOf(ListUrlDto);
			expect(result.originalUrl).toBe("https://example.com");
			expect(result.shortUrl).toBe("http://localhost:3000/abc123");
			expect(result.userId).toBe("user-123");
		});

		it("should successfully create a shortened URL with custom code", async () => {
			urlRepository.existsByShortCode.mockResolvedValue(false);
			urlRepository.save.mockResolvedValue({ ...mockSavedUrl, shortCode: "custom" } as UrlEntity);

			const result = await shortenUseCase.execute(mockCreateUrlDtoWithCustomCode, "user-123", "https", "example.com");

			expect(urlRepository.existsByShortCode).toHaveBeenCalledWith("custom");
			expect(urlRepository.save).toHaveBeenCalledWith(
				expect.objectContaining({
					originalUrl: "https://example.com",
					userId: "user-123",
					shortCode: "custom",
				})
			);
			expect(result.shortUrl).toBe("https://example.com/custom");
		});

		it("should throw NotFoundException when custom code already exists", async () => {
			urlRepository.existsByShortCode.mockResolvedValue(true);

			await expect(shortenUseCase.execute(mockCreateUrlDtoWithCustomCode, "user-123", "http", "localhost:3000")).rejects.toThrow(
				NotFoundException
			);
			await expect(shortenUseCase.execute(mockCreateUrlDtoWithCustomCode, "user-123", "http", "localhost:3000")).rejects.toThrow(
				"Código encurtado não disponível"
			);

			expect(urlRepository.existsByShortCode).toHaveBeenCalledWith("custom");
			expect(urlRepository.save).not.toHaveBeenCalled();
		});
	});
});
