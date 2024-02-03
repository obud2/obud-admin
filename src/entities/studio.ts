import { LegacyFullTimestamp } from '@/entities/common';
import { Image } from '@/entities/program';

export type Studio = LegacyFullTimestamp & {
  id: string;
  title: string;
  category: string;
  sortOrder: number;
  images: Image[];
  isShow: boolean;
  isSpacial: boolean;
};
