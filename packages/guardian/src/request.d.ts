import { RefillingTokenBucket } from "@open-auth/core";
export declare const globalBucket: RefillingTokenBucket<unknown>;
export declare function globalGETRateLimit(): boolean;
export declare function globalPOSTRateLimit(): boolean;
