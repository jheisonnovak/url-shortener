import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { UrlEntity } from "../../models/entities/url.entity";
import { IUrlRepository } from "../../models/interfaces/url-repository.interface";
import { GetOriginalUrlUseCase } from "./get-original-url.use-case";

describe("GetOriginalUrlUseCase", () => {
	let getOriginalUrlUseCase: GetOriginalUrlUseCase;
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
				GetOriginalUrlUseCase,
				{
					provide: "IUrlRepository",
					useValue: mockUrlRepository,
				},
			],
		}).compile();

		getOriginalUrlUseCase = module.get<GetOriginalUrlUseCase>(GetOriginalUrlUseCase);
		urlRepository = module.get("IUrlRepository");

		jest.clearAllMocks();
	});

	describe("execute", () => {
		it("should successfully return original URL and increment click count", async () => {
			urlRepository.findByShortCode.mockResolvedValue(mockUrl);
			urlRepository.save.mockResolvedValue({ ...mockUrl, clickCount: 6 } as UrlEntity);

			const result = await getOriginalUrlUseCase.execute("abc123");

			expect(urlRepository.findByShortCode).toHaveBeenCalledWith("abc123");
			expect(urlRepository.save).toHaveBeenCalledWith(expect.objectContaining({ clickCount: 6 }));
			expect(result).toBe("https://example.com");
		});

		it("should throw NotFoundException when URL is not found", async () => {
			urlRepository.findByShortCode.mockResolvedValue(null);

			await expect(getOriginalUrlUseCase.execute("abc123")).rejects.toThrow(NotFoundException);
			await expect(getOriginalUrlUseCase.execute("abc123")).rejects.toThrow("URL não encontrada");

			expect(urlRepository.findByShortCode).toHaveBeenCalledWith("abc123");
			expect(urlRepository.save).not.toHaveBeenCalled();
		});
	});

	describe("addClickCount", () => {
		it("should increment click count by 1", async () => {
			const urlToUpdate = { ...mockUrl };
			urlRepository.save.mockResolvedValue({ ...urlToUpdate, clickCount: 6 } as UrlEntity);

			await getOriginalUrlUseCase.addClickCount(urlToUpdate);

			expect(urlToUpdate.clickCount).toBe(7);
			expect(urlRepository.save).toHaveBeenCalledWith(urlToUpdate);
		});
	});
});
