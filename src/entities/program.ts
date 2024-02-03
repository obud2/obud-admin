import { LegacyFullTimestamp } from '@/entities/common';

export type Image = {
  key: string;
  name: string;
  size: number;
  type: string;
  upload: boolean;
  url: string;
};

export type Program = LegacyFullTimestamp & {
  id: string;
  studiosId: string;
  lessonType: string;
  title: string;
  contents: string;
  images: Image[];
};
