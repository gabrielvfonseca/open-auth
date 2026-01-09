export declare class RefillingTokenBucket<_Key> {
  max: number;
  refillIntervalSeconds: number;
  constructor(max: number, refillIntervalSeconds: number);
  private storage;
  check(key: _Key, cost: number): boolean;
  consume(key: _Key, cost: number): boolean;
}
export declare class Throttler<_Key> {
  timeoutSeconds: number[];
  private storage;
  constructor(timeoutSeconds: number[]);
  consume(key: _Key): boolean;
  reset(key: _Key): void;
}
export declare class ExpiringTokenBucket<_Key> {
  max: number;
  expiresInSeconds: number;
  private storage;
  constructor(max: number, expiresInSeconds: number);
  check(key: _Key, cost: number): boolean;
  consume(key: _Key, cost: number): boolean;
  reset(key: _Key): void;
  getRemaining(key: _Key): number;
  getResetTime(key: _Key): Date | null;
}
