/**
 * 포인트(적립금) TO be implemented
 */

export type Point = {
  id: string;
  isActive: boolean;
  welcomePointAmount: number;
  inviteePointAmount: number;
  inviterPointAmount: number;
  mobileAppLoginPointAmount: number;
  pointAccumulationPercent: number;
};

export type PointActionLog = {
  id: string;
  userId: string;
  amount: number;
  balance: number;
  reason: string;
  order: string;
  actionBy: PointActionBy;
};

export enum PointActionBy {
  ADMIN = 'ADMIN',
  SYSTEM = 'SYSTEM',
}
