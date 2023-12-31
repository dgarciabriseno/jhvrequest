import { describe, it } from "@jest/globals";
import { JhvRequest, JhvRequestBuilder } from "../src/index";
import "./nodejs_samp_patch";

describe("Jhv Request", () => {
  // Using "failing" here because I want the test to always run in local environment
  // but it will always fail in CI because there's no SAMP server.
  it.failing("can send requests to JHelioviewer", async () => {
    let builder = new JhvRequestBuilder();
    let request = builder
      .AddSource("SDO", "AIA 304")
      .AddSource("SDO", "AIA 94")
      .SetCadence(3600)
      .SetTimeRange("2023-01-01 00:00:00", "2023-01-02 00:00:00")
      .SetName("JHV Request Test Suite")
      .Build();
    await request.Send();
  });
});
