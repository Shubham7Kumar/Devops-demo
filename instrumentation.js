import { NodeSDK } from "@opentelemetry/sdk-node";
import { ConsoleSpanExporter } from "@opentelemetry/sdk-trace-base";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { ExpressInstrumentation } from "@opentelemetry/instrumentation-express";
import { MongoDBInstrumentation } from "@opentelemetry/instrumentation-mongodb";
import { RedisInstrumentation } from "@opentelemetry/instrumentation-redis";

const sdk = new NodeSDK({
  traceExporter: new ConsoleSpanExporter(),

  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
    new MongoDBInstrumentation(),
    new RedisInstrumentation(),
  ],
});

sdk.start();

console.log("OpenTelemetry initialized");