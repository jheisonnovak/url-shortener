import http from "http";

const totalRequests = 1000;
const concurrency = 100;

let completed = 0;

function makeRequest() {
	http.get("http://localhost:2000/jheiso", res => {
		res.on("data", () => {});
		res.on("end", () => {
			completed++;
			if (completed % 100 === 0) {
				console.log(`${completed} requests completed`);
			}
		});
	});
}

for (let i = 0; i < totalRequests; i++) {
	setTimeout(makeRequest, Math.floor(i / concurrency) * 10);
}
