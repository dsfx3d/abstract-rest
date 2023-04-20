import { APIResponse } from "./APIResponse";

export class Interception extends Error {
  constructor(public readonly response: APIResponse) {
    super("Intercepted");
  }
}
