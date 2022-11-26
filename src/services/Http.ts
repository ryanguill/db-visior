/* istanbul ignore file */
import * as http from "http";
import { ConfigHttp } from "./ConfigService";

export default class Http {
  server: http.Server;
  constructor({ host, port }: ConfigHttp, app: any) {
    console.log("http constructor!");
    this.server = http.createServer(app.app);
    this.server.listen({ host, port }, function() {
      console.log(`Listening on http://${host}:${port}`);
    });
  }
}
