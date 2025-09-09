import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { ListUrlDto } from "../../../../../../libs/common/src";
import { UrlEntity } from "../../models/entities/url.entity";
import { IUrlRepository } from "../../models/interfaces/url-repository.interface";
import { UpdateOriginalUrlUseCase } from "./update-original-url.use-case";

describe("UpdateOriginalUrlUseCase", () => {
	let updateOriginalUrlUseCase: UpdateOriginalUrlUseCase;
	let urlRepository: jest.Mocked<IUrlRepository>;

	const mockUrl: UrlEntity = {
		id: "123e4567-e89b-12d3-a456-426614174000",
		userId: "user-123",
		originalUrl: "https://old-example.com",
		shortCode: "abc123",
		clickCount: 5,
		createdAt: new Date(),
		updatedAt: new Date(),
	} as UrlEntity;

	const mockUpdatedUrl: UrlEntity = {
		...mockUrl,
		originalUrl: "https://new-example.com",
	};

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
				UpdateOriginalUrlUseCase,
				{
					provide: "IUrlRepository",
					useValue: mockUrlRepository,
				},
			],
		}).compile();

		updateOriginalUrlUseCase = module.get<UpdateOriginalUrlUseCase>(UpdateOriginalUrlUseCase);
		urlRepository = module.get("IUrlRepository");

		jest.clearAllMocks();
	});

	describe("execute", () => {
		it("should successfully update original URL", async () => {
			urlRepository.findByShortCodeAndUserId.mockResolvedValue(mockUrl);
			urlRepository.save.mockResolvedValue(mockUpdatedUrl);

			const result = await updateOriginalUrlUseCase.execute("abc123", "user-123", "https://new-example.com", "https", "example.com");

			expect(urlRepository.findByShortCodeAndUserId).toHaveBeenCalledWith("abc123", "user-123");
			expect(urlRepository.save).toHaveBeenCalledWith(
				expect.objectContaining({
					originalUrl: "https://new-example.com",
				})
			);
			expect(result).toBeInstanceOf(ListUrlDto);
			expect(result.originalUrl).toBe("https://new-example.com");
			expect(result.shortUrl).toBe("https://example.com/abc123");
		});

		it("should throw NotFoundException when URL is not found", async () => {
			urlRepository.findByShortCodeAndUserId.mockResolvedValue(null);

			await expect(updateOriginalUrlUseCase.execute("abc123", "user-123", "https://new-example.com", "https", "example.com")).rejects.toThrow(
				NotFoundException
			);
			await expect(updateOriginalUrlUseCase.execute("abc123", "user-123", "https://new-example.com", "https", "example.com")).rejects.toThrow(
				"Shortened link not found."
			);

			expect(urlRepository.findByShortCodeAndUserId).toHaveBeenCalledWith("abc123", "user-123");
			expect(urlRepository.save).not.toHaveBeenCalled();
		});
	});
});
