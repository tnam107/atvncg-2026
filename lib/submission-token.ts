import "server-only";

import { createHash, randomBytes } from "node:crypto";

/** A bearer token returned only to the browser that created a submission. */
export function createSubmissionTrackingToken() {
  return randomBytes(32).toString("base64url");
}

/** Store only a digest so a database leak cannot be used to read submission status. */
export function hashSubmissionTrackingToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function stripSubmissionTrackingToken<T extends object>(item: T) {
  const sanitized = { ...item } as T & { trackingTokenHash?: unknown };
  delete sanitized.trackingTokenHash;
  return sanitized;
}
