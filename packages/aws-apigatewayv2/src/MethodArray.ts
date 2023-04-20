import { HttpMethod } from "@aws-cdk/aws-apigatewayv2";

export type MethodArray<T> = Array<[keyof typeof HttpMethod, T]>
