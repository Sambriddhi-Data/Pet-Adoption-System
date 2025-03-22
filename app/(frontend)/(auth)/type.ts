export interface LogoProps {
    className?: string;
    color?: string;
  }

export type Session = {
  session: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string | null;
    userAgent?: string | null;
    impersonatedBy?: string | null;
  };
  user: {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
    user_role: string;
    createdAt: Date;
    updatedAt: Date;
    phoneNumber?: string | null;
    location?: string | null;
    isVerifiedUser: boolean;
    image?: string | null;
    banned?: boolean | null;
    banReason?: string | null;
    banExpires?: Date | null;
  };
} | null;

