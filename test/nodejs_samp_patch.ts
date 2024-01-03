import { DOMParser } from "@xmldom/xmldom";
import { XMLHttpRequest } from "xmlhttprequest";

global.XMLHttpRequest = XMLHttpRequest;

// Sampjs doesn't support nodejs, this is a somewhat hacky way to make it work
// requires the xmlhttprequest and xmldom packages.
// Override responseXML with the xmldom object which sampjs expects so that it can parse the response.
Object.defineProperty(XMLHttpRequest.prototype, "responseXML", {
  get: function () {
    return new DOMParser().parseFromString(this.responseText);
  },
  set: function () {},
});
