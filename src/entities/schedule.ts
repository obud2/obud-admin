import { LegacyFullTimestamp } from '@/entities/common';

export type Schedule = LegacyFullTimestamp & {
  status: string;
  id: string;
  lessonId: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string; // "2024-02-29T21:40",
  fakePrice: number;
  price: number;
  currentMember: number;
  maxMember: number;
  instructor: string; // could be 'x' for emptyness in legacy rows
  isShow: boolean;
  reservationStatus: string;
  payOption:
    | {
        price: number;
        title: string;
        maxMember: number;
        currentMember: number;
      }
    | Record<string, never>;
  instructorInfo:
    | {
        id: string;
        hp: string;
        group: string;
        email: string;
        isDel: string;
        name: string;
        isShow: string;
        createdAt: number;
        updatedAt: number;
        role: string;
        birthdate: string;
      }
    | Record<string, never>;
};

export type ScheduleTitlePreset = LegacyFullTimestamp & {
  id: number;
  programId: string;
  title: string;
  description: string;
};
