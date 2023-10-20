[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# jhvrequest

jhvrequest is a javascript package for sending SAMP requests to [JHelioviewer](https://www.jhelioviewer.org/)

## Usage

Install the package with npm

```
npm i jhvrequest
```

Import and make requests.

```
import { JhvRequestBuilder } from "jhvrequest";

// Load AIA 304 between 2023-01-1 and 2023-01-02 every hour.
let requestBuilder = new JhvRequestBuilder();
requestBuilder.SetTimeRange(new Date('2023-01-01'), new Date('2023-01-02'))
    .SetCadence(3600)
    .AddSource("SDO", "AIA 304")
    .Build().Send();
```

You can add multiple sources to the request:

```
let requestBuilder = new JhvRequestBuilder();
requestBuilder.SetTimeRange(new Date('2023-01-01'), new Date('2023-01-02'))
    .SetCadence(3600)
    .AddSource("SDO", "AIA 304")
    .AddSource("SOHO", "LASCO C2")
    .AddSource("SOHO", "LASCO C3")
    .Build().Send();
```

## JhvRequestBuilder

| Method                          | Description                                                                              |
| ------------------------------- | ---------------------------------------------------------------------------------------- |
| SetTimeRange(start, end)        | Set the time range to query. Start and end are strings to remove ambiguity with js dates |
| SetCadence(seconds)             | Set the time step to use between start and end. in seconds.                              |
| AddSource(observatory, dataset) | Add an image layer to the request                                                        |
| Build()                         | Construct a JhvRequest from the builder                                                  |

## JhvRequest

| Method | Description                                                                                                                                    |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Send() | Send the request to JHelioviewer. This is an async operation and will complete after the user accepts or declines the request in JHelioviewer. |
