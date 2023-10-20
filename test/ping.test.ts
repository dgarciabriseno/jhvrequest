import { describe, it, expect } from "@jest/globals";
import { IsJhvRunning } from "../src/index";
import "./nodejs_samp_patch";

describe("Ping Test", () => {
  it("should return false when JHelioviewer is not running", async () => {
    expect(await IsJhvRunning()).toBeFalsy();
  });
  it.failing("should return true when JHelioviewer is running", async () => {
    expect(await IsJhvRunning()).toBeTruthy();
  });
});
