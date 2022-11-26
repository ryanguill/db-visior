/* istanbul ignore file */
import { get_config } from "./services/ConfigService";
import App from "./app";
import Http from "./services/Http";

const config = get_config();

const app = new App();
const _ = new Http(config.http, app);

async function shutdown(EXIT_CODE = 0) {
	setTimeout(
		() => {
			process.exit(EXIT_CODE);
		},
		process.env.NODE_ENV === "development" ? 0 : 10000
	);
}

process.on("SIGINT", async () => {
	console.log("Shutting down (SIGINT)");
	await shutdown();
});

process.on("SIGTERM", async () => {
	console.log("Shutting down (SIGTERM)");
	await shutdown();
});

process.on("uncaughtException", async (err) => {
	console.error(err);
	await shutdown(1);
});

process.on("unhandledRejection", async (reason, promise) => {
	console.error("unhandledRejection", reason);
	await shutdown(1);
});
