import { describe, it } from "@jest/globals";
import { JhvRequest, JhvRequestBuilder } from "../src/index";
import { DOMParser } from "xmldom";
import { XMLHttpRequest } from "xmlhttprequest";

global.XMLHttpRequest = XMLHttpRequest;

// Sampjs doesn't support nodejs, this is a somewhat hacky way to make it work
// requires the xmlhttprequest and xmldom packages.
// Override responseXML with the xmldom object which sampjs expects so that it can parse the response.
Object.defineProperty(XMLHttpRequest.prototype, "responseXML", {
    get: function () {
        return new DOMParser().parseFromString(this.responseText);
    },
    set: function () {}
});

describe('Jhv Request', () => {
    // Using "failing" here because I want the test to always run in local environment
    // but it will always fail in CI because there's no SAMP server.
    it.failing('can send requests to JHelioviewer', async () => {
        let builder = new JhvRequestBuilder();
        let request = builder.AddSource("SDO", "AIA 304")
            .AddSource("SDO", "AIA 94")
            .SetCadence(3600)
            .SetTimeRange("2023-01-01 00:00:00", "2023-01-02 00:00:00")
            .Build();
            await request.Send();
    });
});