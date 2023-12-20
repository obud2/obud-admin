import { Banner } from "@/entities/banner";

type Props = {
  banner: Banner;
};

const BannerItem = ({ banner }: Props) => {
  return <div>{banner.name}</div>;
};

export default BannerItem;
