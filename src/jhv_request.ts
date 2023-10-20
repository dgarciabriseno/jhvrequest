import { samp } from "sampjs";

const SampProfile = {
  "samp.name": "jhvrequest",
  "samp.description": "JavaScript library for sending requests to JHelioviewer",
};

class JhvRequest {
  /**
   * JSON made from the JHV Request Builder
   */
  private json: Object;
  private connector;
  private message: any;

  constructor(json: Object) {
    this.json = json;
    this.connector = new samp.Connector(
      SampProfile["samp.name"],
      SampProfile,
      null,
      null,
    );
  }

  async Send() {
    console.log(this.json);
    this.message = new samp.Message("jhv.load.request", { value: JSON.stringify(this.json) });

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
      this.connector.notifyAll([this.message], null, registerAndSend);
    } else {
      await registerAndSend();
    }
  }
}

export { JhvRequest };
