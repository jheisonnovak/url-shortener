import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { ResponseDto } from "../../../../../../libs/common/src";
import { UrlEntity } from "../../models/entities/url.entity";
import { IUrlRepository } from "../../models/interfaces/url-repository.interface";
import { DeleteUseCase } from "./delete.use-case";

describe("DeleteUseCase", () => {
	let deleteUseCase: DeleteUseCase;
	let urlRepository: jest.Mocked<IUrlRepository>;
	const mockUrl: UrlEntity = {
		id: "123e4567-e89b-12d3-a456-426614174000",
		userId: "user-123",
		originalUrl: "https://example.com",
		shortCode: "abc123",
		clickCount: 5,
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
				DeleteUseCase,
				{
					provide: "IUrlRepository",
					useValue: mockUrlRepository,
				},
			],
		}).compile();

		deleteUseCase = module.get<DeleteUseCase>(DeleteUseCase);
		urlRepository = module.get("IUrlRepository");

		jest.clearAllMocks();
	});

	describe("execute", () => {
		it("should successfully delete a URL", async () => {
			urlRepository.findByShortCodeAndUserId.mockResolvedValue(mockUrl);
			urlRepository.delete.mockResolvedValue(undefined);

			const result = await deleteUseCase.execute("abc123", "user-123");

			expect(urlRepository.findByShortCodeAndUserId).toHaveBeenCalledWith("abc123", "user-123");
			expect(urlRepository.delete).toHaveBeenCalledWith(mockUrl.id);
			expect(result).toBeInstanceOf(ResponseDto);
			expect(result.message).toBe("Shortened link deleted successfully.");
		});

		it("should throw NotFoundException when URL is not found", async () => {
			urlRepository.findByShortCodeAndUserId.mockResolvedValue(null);

			await expect(deleteUseCase.execute("abc123", "user-123")).rejects.toThrow(NotFoundException);
			await expect(deleteUseCase.execute("abc123", "user-123")).rejects.toThrow("Shortened link not found.");

			expect(urlRepository.findByShortCodeAndUserId).toHaveBeenCalledWith("abc123", "user-123");
			expect(urlRepository.delete).not.toHaveBeenCalled();
		});
	});
});
