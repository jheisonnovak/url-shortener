import { Test, TestingModule } from "@nestjs/testing";
import { ListDetailedUrlDto, PaginatedResponseDto } from "../../../../../../libs/common/src";
import { PaginationDto } from "../../models/dtos/pagination.dto";
import { UrlEntity } from "../../models/entities/url.entity";
import { IUrlRepository } from "../../models/interfaces/url-repository.interface";
import { FindAllUrlsUseCase } from "./find-all-urls.use-case";

describe("FindAllUrlsUseCase", () => {
	let findAllUrlsUseCase: FindAllUrlsUseCase;
	let urlRepository: jest.Mocked<IUrlRepository>;

	const mockUrls: UrlEntity[] = [
		{
			id: "123e4567-e89b-12d3-a456-426614174000",
			userId: "user-123",
			originalUrl: "https://example.com",
			shortCode: "abc123",
			clickCount: 5,
			createdAt: new Date("2024-01-01"),
			updatedAt: new Date("2024-01-02"),
		} as UrlEntity,
		{
			id: "123e4567-e89b-12d3-a456-426614174001",
			userId: "user-123",
			originalUrl: "https://google.com",
			shortCode: "def456",
			clickCount: 10,
			createdAt: new Date("2024-01-03"),
			updatedAt: new Date("2024-01-04"),
		} as UrlEntity,
	];

	const mockPaginationDto: PaginationDto = {
		page: 1,
		limit: 10,
		search: undefined,
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
				FindAllUrlsUseCase,
				{
					provide: "IUrlRepository",
					useValue: mockUrlRepository,
				},
			],
		}).compile();

		findAllUrlsUseCase = module.get<FindAllUrlsUseCase>(FindAllUrlsUseCase);
		urlRepository = module.get("IUrlRepository");

		jest.clearAllMocks();
	});

	describe("execute", () => {
		it("should successfully return paginated URLs", async () => {
			const totalItems = 2;
			urlRepository.findAll.mockResolvedValue([mockUrls, totalItems]);

			const result = await findAllUrlsUseCase.execute("user-123", mockPaginationDto, "http", "localhost:3000");

			expect(urlRepository.findAll).toHaveBeenCalledWith("user-123", 1, 10, undefined);
			expect(result).toBeInstanceOf(PaginatedResponseDto);
			expect(result.data).toHaveLength(2);
			expect(result.totalItems).toBe(2);
			expect(result.itemCount).toBe(2);
			expect(result.itemsPerPage).toBe(10);
			expect(result.totalPages).toBe(1);
			expect(result.currentPage).toBe(1);
			expect(result.data[0]).toBeInstanceOf(ListDetailedUrlDto);
			expect(result.data[0].shortUrl).toBe("http://localhost:3000/abc123");
		});

		it("should handle search parameter", async () => {
			const paginationWithSearch = { ...mockPaginationDto, search: "example" };
			urlRepository.findAll.mockResolvedValue([mockUrls.slice(0, 1), 1]);

			const result = await findAllUrlsUseCase.execute("user-123", paginationWithSearch, "https", "example.com");

			expect(urlRepository.findAll).toHaveBeenCalledWith("user-123", 1, 10, "example");
			expect(result.data).toHaveLength(1);
			expect(result.totalItems).toBe(1);
			expect(result.data[0].shortUrl).toBe("https://example.com/abc123");
		});

		it("should return empty results when no URLs found", async () => {
			urlRepository.findAll.mockResolvedValue([[], 0]);

			const result = await findAllUrlsUseCase.execute("user-123", mockPaginationDto, "http", "localhost:3000");

			expect(urlRepository.findAll).toHaveBeenCalledWith("user-123", 1, 10, undefined);
			expect(result.data).toHaveLength(0);
			expect(result.totalItems).toBe(0);
			expect(result.totalPages).toBe(0);
		});
	});
});
