import { APIGatewayProxyEventV2, Context } from "aws-lambda";

export interface APIRequest {
  event: APIGatewayProxyEventV2,
  context: Context
}
