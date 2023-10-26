import { samp } from "sampjs";

function MakeSampProfile(name: string = "jhvrequest") {
  return {
    "samp.name": name,
    "samp.description":
      "JavaScript library for sending requests to JHelioviewer",
  };
}

class JhvRequest {
  /**
   * JSON made from the JHV Request Builder
   */
  private json: Object;
  private connector;
  private message: any;

  constructor(json: Object, appName: string = "jhvrequest") {
    this.json = json;
    let profile = MakeSampProfile(appName);
    this.connector = new samp.Connector(appName, profile, null, null);
  }

  async Send() {
    this.message = new samp.Message("jhv.load.request", {
      value: JSON.stringify(this.json),
    });

    let onRegister = (conn: any) => {
      this.connector.setConnection(conn);
      conn.notifyAll([this.message]);
    };

    let registerAndSend = async () => {
      let connection = await new Promise((resolve, reject) => {
        samp.register(this.connector.name, resolve, reject);
      });
      onRegister(connection);
    };

    if (this.connector.connection) {
      this.connector.connection.notifyAll(
        [this.message],
        null,
        registerAndSend,
      );
    } else {
      await registerAndSend();
    }
  }
}

export { JhvRequest };
