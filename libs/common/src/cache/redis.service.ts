import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
	private client: Redis;

	onModuleInit() {
		const port = Number(process.env.REDIS_PORT ?? "6379");
		const host = process.env.REDIS_HOST ?? "localhost";
		this.client = new Redis(port, host);
	}

	onModuleDestroy() {
		return this.client.quit();
	}

	async get<T>(key: string): Promise<T | null> {
		const data = await this.client.get(key);
		return data ? JSON.parse(data) : null;
	}

	async set<T>(key: string, value: T, ttlSeconds = 60): Promise<void> {
		await this.client.set(key, JSON.stringify(value), "EX", ttlSeconds);
	}

	async del(key: string): Promise<void> {
		await this.client.del(key);
	}
}
