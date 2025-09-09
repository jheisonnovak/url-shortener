import * as http from "http";

const totalRequests = 10000;
const concurrency = 200;
const delay = 50;

let completed = 0;
let failed = 0;

const agent = new http.Agent({
	keepAlive: true,
	maxSockets: concurrency,
	maxFreeSockets: 10,
	timeout: 5000,
	scheduling: "fifo",
});

function makeRequest(): Promise<void> {
	return new Promise(resolve => {
		const req = http.get("http://localhost:2000/github", res => {
			let data = "";
			res.on("data", chunk => {
				data += chunk;
			});
			res.on("end", () => {
				completed++;
				if (completed % 100 === 0) {
					console.log(`✅ ${completed} requests completed, ${failed} failed`);
				}
				resolve();
			});
		});

		req.on("error", err => {
			failed++;
			console.error(`❌ Request failed: ${err}`);
			resolve();
		});

		req.on("timeout", () => {
			req.destroy();
			failed++;
			console.error("❌ Request timeout");
			resolve();
		});
	});
}

async function runLoadTest(): Promise<void> {
	console.log(`🚀 Starting load test: ${totalRequests} requests with concurrency ${concurrency}`);
	const startTime = Date.now();

	const batches = Math.ceil(totalRequests / concurrency);

	for (let batch = 0; batch < batches; batch++) {
		const batchSize = Math.min(concurrency, totalRequests - batch * concurrency);
		const promises: Promise<void>[] = [];

		for (let i = 0; i < batchSize; i++) {
			promises.push(makeRequest());
		}

		await Promise.all(promises);

		if (batch < batches - 1) {
			await new Promise(resolve => setTimeout(resolve, delay));
		}
	}

	const endTime = Date.now();
	const duration = endTime - startTime;
	const rps = totalRequests / (duration / 1000);

	console.log(`\n📊 Load test completed:`);
	console.log(`   Total requests: ${totalRequests}`);
	console.log(`   Successful: ${completed}`);
	console.log(`   Failed: ${failed}`);
	console.log(`   Duration: ${duration}ms`);
	console.log(`   Requests/second: ${rps.toFixed(2)}`);

	agent.destroy();
}

runLoadTest().catch(console.error);
