import * as dotenv from "dotenv";

dotenv.config();

export interface ConfigHttp {
  host: string | undefined;
  port: number;
  ENFORCE_SSL: boolean;
}

export interface config {
  http: ConfigHttp;
}

export function get_config(): config {
  return {
    http: {
      host: process.env.IP_ADDRESS,
      port: (function() {
        if (process.env.PORT === undefined || isNaN(+process.env.PORT)) {
          throw new Error("PORT environment variable not set!");
        } else {
          return +process.env.PORT;
        }
      })(),
      ENFORCE_SSL: !!process.env.ENFORCE_SSL,
    }
  };
}
