import { HttpMethod } from "@aws-cdk/aws-apigatewayv2";
import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2, Context } from "aws-lambda";
import { RunnablePipe } from "./RunnablePipe";
import { MethodArray } from "./MethodArray";

export class APIResource extends Map<keyof typeof HttpMethod, RunnablePipe> {
  constructor(
    runnablePipes: MethodArray<RunnablePipe>,
    private fallback: RunnablePipe
  ) {
    super(runnablePipes)
  }

  call(event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyStructuredResultV2> {
    return this.toRunnablePipe(event).run({ event, context })
  }

  private toRunnablePipe(event: APIGatewayProxyEventV2): RunnablePipe {
    return this.get(this.toHttpMethod(event)) ?? this.fallback
  }

  private toHttpMethod(event: APIGatewayProxyEventV2): HttpMethod {
    return event.requestContext.http.method as HttpMethod
  }
}
