export interface DeviceInfo {
  id: string;
  userId: string;
  name: string;
  fingerprint: string;
  userAgent: string | null;
  ipAddress: string | null;
  trusted: boolean;
  lastSeen: Date;
  createdAt: Date;
}

export interface RegisterDeviceInput {
  userId: string;
  name: string;
  fingerprint: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface DeviceFingerprint {
  userAgent: string;
  language: string;
  platform: string;
  screenResolution: string;
  timezone: string;
  cookiesEnabled: boolean;
}
