import { samp } from "sampjs";

/**
 * Sends out a samp ping request to see if a samp hub is running.
 * If JHelioviewer is running (or technically any samp hub) this will return true.
 */
function IsJhvRunning(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    samp.ping((result: boolean) => {
      resolve(result);
    });
  });
}

export { IsJhvRunning };
