import { APIRequest } from "./APIRequest";
import { APIResponse } from "./APIResponse";

export type Runnable = (
  request: APIRequest,
  response: APIResponse
) => Promise<APIResponse | void> | APIResponse | void;
