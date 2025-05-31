import { Inject, Injectable } from "@nestjs/common";
import { ListDetailedUrlDto, PaginatedResponseDto } from "../../../../../../libs/common/src";
import { PaginationDto } from "../../models/dtos/pagination.dto";
import { IUrlRepository } from "../../models/interfaces/url-repository.interface";

@Injectable()
export class FindAllUrlsUseCase {
	constructor(
		@Inject("IUrlRepository")
		private readonly urlRepository: IUrlRepository
	) {}

	async execute(userId: string, paginationDto: PaginationDto, protocol: string, host: string) {
		const [urls, total] = await this.urlRepository.findAll(userId, paginationDto.page, paginationDto.limit, paginationDto.search);
		return new PaginatedResponseDto<ListDetailedUrlDto[]>(
			urls.map(
				url =>
					new ListDetailedUrlDto(
						url.id,
						url.originalUrl,
						`${protocol}://${host}/${url.shortCode}`,
						url.clickCount,
						url.createdAt,
						url.updatedAt
					)
			),
			total,
			urls.length,
			paginationDto.limit,
			Math.ceil(total / paginationDto.limit),
			paginationDto.page
		);
	}
}
