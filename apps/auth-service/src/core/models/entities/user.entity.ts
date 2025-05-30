import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "users" })
export class UserEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ name: "email", unique: true, nullable: false })
	email: string;

	@Column({ name: "password", nullable: false })
	password: string;

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@DeleteDateColumn({ name: "deleted_at" })
	deletedAt: Date;

	constructor(user: Partial<UserEntity>) {
		Object.assign(this, user);
	}
}
