export type Banner = {
  id: number;
  name: string;
  imageUrl: string;
  linkUrl: string;
  order: number;
  createdAt: string;
  isShow: boolean;
};

export type BannerOrderItem = {
  id: Banner["id"];
  order: number;
};
