import { LegacyFullTimestamp } from '@/entities/common';

export type Program = LegacyFullTimestamp & {
  id: string;
  studiosId: string;
  lessonType: string;
  title: string;
  contents: string;
  images: {
    key: string;
    name: string;
    size: number;
    type: string;
    upload: boolean;
    url: string;
  }[];
};
