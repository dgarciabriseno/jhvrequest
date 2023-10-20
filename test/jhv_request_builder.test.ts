import { describe, it, expect } from "@jest/globals";
import { JhvRequestBuilder, JhvRequest } from "../src/index";

describe("JHV Request Builder", () => {
  it("should throw an error if cadence is not set", () => {
    let builder = new JhvRequestBuilder();
    builder.AddSource("SDO", "AIA 304");
    builder.SetTimeRange("2023-01-01", "2023-02-02");
    expect(() => {
      builder.Build();
    }).toThrow("Missing cadence");
  });

  it("should throw an error if time range is not set", () => {
    let builder = new JhvRequestBuilder();
    builder.AddSource("SDO", "AIA 304");
    builder.SetCadence(3600);
    expect(() => {
      builder.Build();
    }).toThrow("Missing date range");
  });

  it("Should throw an error if no sources have been added", () => {
    let builder = new JhvRequestBuilder();
    builder.SetCadence(3600);
    builder.SetTimeRange("2023-01-01", "2023-02-02");
    expect(() => {
      builder.Build();
    }).toThrow("No datasources");
  });

  it("should build a JHV Request", () => {
    let builder = new JhvRequestBuilder();
    builder.AddSource("SDO", "AIA 304");
    builder.SetCadence(3600);
    builder.SetTimeRange("2023-01-01", "2023-02-02");
    let request = builder.Build();
    expect(request).toBeInstanceOf(JhvRequest);
  });

  it("should build valid JHV json", () => {
    // Expose protected method that builds JSON.
    class JhvRequestBuilderHarness extends JhvRequestBuilder {
      GetJson(): Object {
        return this._BuildJson();
      }
    }

    let builder = new JhvRequestBuilderHarness();
    builder.AddSource("SDO", "AIA 304", "GSFC");
    builder.AddSource("SDO", "AIA 94");
    builder.SetCadence(3600);
    builder.SetTimeRange("2023-01-01", "2023-02-02");
    let json = builder.GetJson();
    expect(
      json.hasOwnProperty("org.helioviewer.jhv.request.image"),
    ).toBeTruthy();
    let imageRequests = json["org.helioviewer.jhv.request.image"];
    expect(imageRequests).toBeInstanceOf(Array);
    expect(imageRequests[0]).toHaveProperty("observatory", "SDO");
    expect(imageRequests[0]).toHaveProperty("server", "GSFC");
    expect(imageRequests[0]).toHaveProperty("cadence", 3600);
    expect(imageRequests[0]).toHaveProperty("dataset", "AIA 304");
    expect(imageRequests[0]).toHaveProperty("startTime", "2023-01-01");
    expect(imageRequests[0]).toHaveProperty("endTime", "2023-02-02");
    expect(imageRequests[1]).toHaveProperty("observatory", "SDO");
    expect(imageRequests[1]).toHaveProperty("server", "");
    expect(imageRequests[1]).toHaveProperty("cadence", 3600);
    expect(imageRequests[1]).toHaveProperty("dataset", "AIA 94");
    expect(imageRequests[1]).toHaveProperty("startTime", "2023-01-01");
    expect(imageRequests[1]).toHaveProperty("endTime", "2023-02-02");
  });
});
