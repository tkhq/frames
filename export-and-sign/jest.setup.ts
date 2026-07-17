import "regenerator-runtime/runtime";
import { TextEncoder, TextDecoder } from "util";
import { ReadableStream } from "node:stream/web";
import { MessagePort } from "node:worker_threads";

if (typeof global.MessagePort === "undefined") {
  global.MessagePort = MessagePort as unknown as typeof global.MessagePort;
}

if (typeof global.ReadableStream === "undefined") {
  global.ReadableStream =
    ReadableStream as unknown as typeof global.ReadableStream;
}

if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = TextDecoder;
}
