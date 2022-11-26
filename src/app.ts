/* istanbul ignore file */
import * as express from "express";
import * as methodOverride from "method-override";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import { uuidv4, StandardError, toBoolean } from "./services/utils";
import * as path from "path";
import * as expressEJSLayouts from "express-ejs-layouts";

import { Request, Response, NextFunction, Application } from "express";

const wrap =
	(fn: Function) =>
	(...args: any[]) =>
		fn(...args).catch(args[2]);

export default class App {
	app: Application;
	constructor() {
		this.app = express();

		this.app.use(
			methodOverride("X-HTTP-Method-Override", { methods: ["POST"] })
		);
		this.app.disable("x-powered-by");

		this.app.set("view engine", "ejs");
		this.app.use(expressEJSLayouts);
		this.app.set("views", path.join(__dirname, "/views"));

		//todo enforce ssl

		this.app.use(function (req: Request, res: Response, next: NextFunction) {
			req._context = {
				// This will hold tenant id, permissions also.
				gidRequest: req.get("x-request-id") || uuidv4(),
				ip: req.ip,
			};
			next();
		});

		this.app.use(cookieParser());

		const corsOptions = {
			//allow all origins, origin will be checked in client_event
			origin: true, //[/^(https?:\/\/.*\.?telemetry\.local(?::\d{1,5})?)$/],
			credentials: true,
		};

		/*
		if (process.env.CORS_ORIGINS) {
			try {
				const corsOptionsEnv = JSON.parse(process.env.CORS_ORIGINS);
				corsOptions.origin = [...corsOptions.origin, ...corsOptionsEnv];
			} catch (e) {
				console.error(e);
			}
		}
	 */

		this.app.use(cors(corsOptions));

		this.app.use(bodyParser.urlencoded({ extended: false }));
		this.app.use(
			bodyParser.json({
				limit: "500kb", // Raised for large bulk updates
			})
		);

		// endpoints below
		// ===============

		this.app.use("/assets", express.static(path.join(__dirname, "/assets")));

		// Simple "ping" endpoint for testing
		this.app.get("/ping", function (req: Request, res: Response) {
			const timestamp = new Date();
			const result = {
				pong: timestamp.toISOString(),
				version: process.env.npm_package_version,
			};
			return res.json(result);
		});

		this.app.get("/", function (req, res) {
			res.render("index", { title: "index page is working" });
		});

		// error handler must be last
		this.app.use(function (
			err: any,
			req: Request,
			res: Response,
			next: NextFunction
		) {
			if (
				process.env.NODE_ENV === "development" &&
				true
				//!toBoolean(process.env.DISABLE_APP_ERRORS_CONSOLE_LOGS_DURING_TESTING)
			) {
				console.error("\n\n-----------------");
				console.error(err);
				console.error("-----------------\n\n");
			}
			const body = {
				statusCode: err.statusCode || 500,
				code: err.code || "ERROR",
				type: err.type || "ERROR",
				message: err.message || err.toString(),
			};

			if (err.type) {
				res.statusMessage = err.type;
			}
			return res.status(body.statusCode).json(body);
		});
	}
}
