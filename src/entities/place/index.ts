export type Place = {
  id: string;
  status: string;
  title: string;
  content: string;
  studioCategoryId: number;
  address?: string;
  addressDetail?: string;
  category: any;
  convenience: any;
  homepage: string;
  images: any;
  information: string;
  isShow: boolean;
  parking: boolean;
  parkingInfo: string;
  refundPolicy: string;
  serviceCenter: string;
  sortOrder: number;
  wishCount: number;
  viewCount: number;
};

export type Section = {
  id: number;
  name: string;
  order: number;
  isVisible: boolean;
  createdAt: string; // ex: "2023-12-11T05:15:22.275Z"
  updatedAt: string;
};

export type SectionOrderItem = {
  id: number;
  order: number;
};

export enum SectionItemType {
  //studios
  PLACE = "PLACE",
  //lesson
  PROGRAM = "PROGRAM",
}

export type SectionItem = {
  type: SectionItemType;
  id: string;
  name: string;
  images: { key: string; url: string }[];
  order: number;
};

export type SectionWithItems = {
  id: number; // Section Id;
  section: Section;
  items: SectionItem[];
};
