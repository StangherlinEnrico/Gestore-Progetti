export type UserPreferences = {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
};

export type UserSecurity = {
  twoFactorEnabled: boolean;
  lastPasswordChange: Date | null;
  activeSessions: number;
};

export type UserSubscription = {
  plan: 'free' | 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'expired' | 'cancelled';
  expiresAt: Date | null;
  autoRenew: boolean;
};

export type SettingsPageData = {
  preferences: UserPreferences;
  security: UserSecurity;
  subscription: UserSubscription;
};

export type UpdateSettingsPayload = {
  preferences?: Partial<UserPreferences>;
  user?: {
    name?: string;
    avatar?: string;
  };
  security?: {
    password?: string;
    twoFactorEnabled?: boolean;
  };
};

export type Project = {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'archived' | 'deleted';
};

export type CreateProjectPayload = {
  name: string;
  description?: string;
  ownerId: string;
};

export type UpdateProjectPayload = {
  name?: string;
  description?: string;
  status?: Project['status'];
};