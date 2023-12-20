export type Banner = {
  id: number;
  name: string;
  imageUrl: string;
  order: number;
  createdAt: string;
};

export type BannerOrderItem = {
  id: Banner["id"];
  order: number;
};
