export interface RecoveryCode {
  id: string;
  codeHash: string;
  used: boolean;
  usedAt: Date | null;
  createdAt: Date;
}

export interface RecoveryCodesResult {
  codes: string[];
  userId: string;
}
