import { HttpMethod } from "@aws-cdk/aws-apigatewayv2";
import { RunnablePipe } from "./RunnablePipe";
import { Runnable } from "./Runnable";
import { APIResource } from "./APIResource";
import { StatusCodes } from "http-status-codes";
import { MethodArray } from "./MethodArray";

export class APIResourceBuilder {
  constructor(
    private runnables: MethodArray<Runnable[]> = [],
    private interceptors: Runnable[] = [],
    private fallback: Runnable = (_, res) => res.withStatusCode(StatusCodes.METHOD_NOT_ALLOWED)
  ) { }

  on(method: HttpMethod, ...runnables: Runnable[]): APIResourceBuilder {
    return new APIResourceBuilder(
      [...this.runnables, [method, runnables]],
      this.interceptors,
      this.fallback
    )
  }

  withInterceptors(...runnables: Runnable[]): APIResourceBuilder {
    return new APIResourceBuilder(
      this.runnables,
      runnables,
      this.fallback
    )
  }

  withFallback(fallback: Runnable): APIResourceBuilder {
    return new APIResourceBuilder(
      this.runnables,
      this.interceptors,
      fallback
    )
  }

  build(): APIResource {
    return new APIResource(this.toMethodPipes(), new RunnablePipe(this.fallback))
  }

  private toMethodPipes(): MethodArray<RunnablePipe> {
    return this.runnables.map(([method, runnables]) =>
      [method, new RunnablePipe(...this.interceptors, ...runnables)])
  }
}