import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { StatusCodes, getReasonPhrase } from "http-status-codes";

export class APIResponse implements APIGatewayProxyStructuredResultV2 {
  statusCode: number = StatusCodes.OK
  headers: Record<string, string | number | boolean> = {}
  body: string = getReasonPhrase(this.statusCode)

  static from(result: APIGatewayProxyStructuredResultV2): APIResponse {
    return new APIResponse()
      .withStatusCode(result.statusCode ?? StatusCodes.OK)
      .withBody(result.body ?? getReasonPhrase(result.statusCode ?? StatusCodes.OK))
      .withHeaders(result.headers ?? {})
  }

  withHeaders(headers: Record<string, string | number | boolean>): APIResponse {
    this.headers = headers
    return this
  }

  withStatusCode(statusCode: number): APIResponse {
    this.statusCode = statusCode
    return this
  }

  withBody(body: string): APIResponse {
    this.body = body
    return this
  }
}
