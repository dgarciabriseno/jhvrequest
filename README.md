[![npm version](https://badge.fury.io/js/jhvrequest.svg)](https://badge.fury.io/js/jhvrequest)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# jhvrequest

jhvrequest is a javascript package for sending SAMP requests to [JHelioviewer](https://www.jhelioviewer.org/)

## Usage

Install the package with npm

```
npm i jhvrequest
```

Import and make requests.

```javascript
import { JhvRequestBuilder } from "jhvrequest";

// Load AIA 304 between 2023-01-1 and 2023-01-02 every hour.
let requestBuilder = new JhvRequestBuilder();
requestBuilder
  .SetTimeRange("2023-01-01 00:00:00", "2023-01-02 00:00:00")
  .SetCadence(3600)
  .AddSource("SDO", "AIA 304")
  .Build()
  .Send();
```

You can add multiple sources to the request:

```javascript
let requestBuilder = new JhvRequestBuilder();
requestBuilder.SetTimeRange('2023-01-01 00:00:00', '2023-01-02 00:00:00')
    .SetCadence(3600)e
    .AddSource("SDO", "AIA 304")
    .AddSource("SOHO", "LASCO C2")
    .AddSource("SOHO", "LASCO C3")
    .Build().Send();
```

You can check if JHelioviewer is alive before making any requests

```javascript
import { IsJhvRunning } from "jhvrequest";

// IsJhvRunning returns true/false
let isJhvRunning = await IsJhvRunning();
if (isJhvRunning) {
  // Send request
} else {
  // Jhv is not running
}
```

## Nodejs vs Browser environments

The dependency `sampjs` currently only supports a browser environment because it
depends on xmlhttprequest and parsing xml via the DOM.
But you can get this to work in a nodejs environment with the `xmlhttprequest`
and `xmldom` package by adding `XMLHttpRequest` to the the `global` variable
and hooking the `xmldom.DOMParser` into `XMLHttpRequest.prototype.responseXML`.

See `test/jhvrequest.test.ts` as an example.

## IsJhvRunning

async function checks if JHelioviewer is running and returns a boolean.

```javascript
import { IsJhvRunning } from "jhvrequest";
// result is a true/false
let result = await IsJhvRunning();
```

## JhvRequestBuilder

| Method                                             | Description                                                                              |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| SetTimeRange(start, end)                           | Set the time range to query. Start and end are strings to remove ambiguity with js dates |
| SetCadence(seconds)                                | Set the time step to use between start and end. in seconds.                              |
| AddSource(observatory, dataset, (Optional) server) | Add an image layer to the request.                                                       |
| Build()                                            | Construct a JhvRequest from the builder                                                  |

## JhvRequest

| Method | Description                                                                                                                                    |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Send() | Send the request to JHelioviewer. This is an async operation and will complete after the user accepts or declines the request in JHelioviewer. |
