import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "urls" })
export class UrlEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ name: "user_id", type: "varchar", length: 36, nullable: true })
	userId: string;

	@Column({ name: "original_url", type: "varchar", nullable: false })
	originalUrl: string;

	@Column({ name: "short_code", type: "varchar", unique: true, nullable: false })
	shortCode: string;

	@Column({ name: "click_count", type: "int", default: 0, nullable: false })
	clickCount: number;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@DeleteDateColumn({ nullable: true })
	deletedAt: Date;

	constructor(url?: Partial<UrlEntity>) {
		Object.assign(this, url);
	}
}
