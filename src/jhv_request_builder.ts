import { JhvRequest } from "./jhv_request";

interface Datasource {
  observatory: string;
  dataset: string;
  server: string;
}

interface DateRange {
  start: string;
  end: string;
}

/**
 * Implements an interface for sending the current scene information to JHelioviewer.
 */
class JhvRequestBuilder {
  private range: DateRange | undefined = undefined;
  private sources: Datasource[];
  private cadence: number | undefined = undefined;
  private name: string | undefined = undefined;

  constructor() {
    this.sources = [];
  }

  /**
   * Optionally sets the application name.
   * This is the name of the sender that appears when the request is sent to JHelioviewer.
   * If not set, the sender will be "jhvrequest"
   * @param {string} name Application name
   */
  SetName(name: string): JhvRequestBuilder {
    this.name = name;
    return this;
  }

  /**
   * Set the cadence in seconds.
   * @param seconds Cadence - time step between start and end
   */
  SetCadence(seconds: number): JhvRequestBuilder {
    this.cadence = seconds;
    return this;
  }

  /**
   * Set the current time range in the request
   * @param start Start string representing the start time of the range
   * @param end End string representing the end time of the range
   */
  SetTimeRange(start: string, end: string): JhvRequestBuilder {
    this.range = {
      start: start,
      end: end,
    };
    return this;
  }

  /**
   * Adds a data source to the request
   * @param observatory Observatory to request (SDO, SOHO, etc)
   * @param dataset Dataset to request ("AIA 304", "LASCO C2", etc)
   * @param server Optional server to request data from (GSFC, IAS, ROB, etc)
   */
  AddSource(
    observatory: string,
    dataset: string,
    server: string = "",
  ): JhvRequestBuilder {
    this.sources.push({
      observatory: observatory,
      dataset: dataset,
      server: server,
    });
    return this;
  }

  /**
   * Builds the JSON file required for the Jhv request.
   * For information on the format see
   * https://github.com/Helioviewer-Project/JHelioviewer-SWHV/blob/master/docs/ddf.md#image-request-file
   *
   */
  protected _BuildJson(): Object {
    if (typeof this.cadence === "undefined") {
      throw "Missing cadence on JHV Request builder. use SetCadence to set it.";
    }
    if (typeof this.range === "undefined") {
      throw "Missing date range on JHV Request builder. use SetTimeRange to set it.";
    }
    if (this.sources.length === 0) {
      throw "No datasources were added to this JHV Request.";
    }
    let imageRequests = this.sources.map((source) => {
      return {
        observatory: source.observatory,
        dataset: source.dataset,
        server: source.server,
        startTime: this.range?.start,
        endTime: this.range?.end,
        cadence: this.cadence,
      };
    });
    return { "org.helioviewer.jhv.request.image": imageRequests };
  }

  Build(RequestClass: typeof JhvRequest = JhvRequest): JhvRequest {
    return new RequestClass(this._BuildJson(), this.name);
  }
}

export { JhvRequestBuilder };
