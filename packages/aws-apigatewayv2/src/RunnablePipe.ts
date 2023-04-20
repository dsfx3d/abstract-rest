import { Runnable } from "./Runnable";
import { APIResponse } from "./APIResponse";
import { APIRequest } from "./APIRequest";
import { APIError } from './APIError';
import { Interception } from './Interception';
import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";

export class RunnablePipe extends Array<Runnable> {
  run(request: APIRequest): Promise<APIGatewayProxyStructuredResultV2> {
    return this.toReducedResponse(request).catch(thrown => {
      if (thrown instanceof Interception) {
        return thrown.response
      }
      return APIResponse.from(APIError.fromError(thrown as Error))
    })
  }

  private toReducedResponse(request: APIRequest): Promise<APIGatewayProxyStructuredResultV2> {
    return this.reduce(async (responsePromise, runnable) =>
      this.toResponse(runnable, request, await responsePromise),
      Promise.resolve(new APIResponse())
    )
  }

  private async toResponse(
    runnable: Runnable,
    request: APIRequest,
    response: APIResponse
  ): Promise<APIResponse> {
    return Promise.resolve(runnable({ ...request }, response)).then(intercepted => {
      intercepted ??= response
      if (response === intercepted) {
        return response
      }
      throw new Interception(intercepted)
    })
  }
}
