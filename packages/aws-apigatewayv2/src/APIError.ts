import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { StatusCodes } from 'http-status-codes'

export class APIError extends Error implements APIGatewayProxyStructuredResultV2 {
  private constructor(
    public readonly body: string,
    public readonly statusCode: number,
    public readonly headers: Record<string, string> = {}
  ) {
    super(body)
  }

  static fromError(error: Error): APIError {
    return this.constructWith(
      error,
      (error as APIError).statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR
    )
  }

  static badRequest(error: Error): APIError {
    return this.constructWith(error, StatusCodes.BAD_REQUEST)
  }

  private static constructWith(error: Error, statusCode: number) {
    return new APIError(error.message, statusCode)
  }
}
