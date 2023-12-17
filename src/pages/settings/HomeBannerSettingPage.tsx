import React, { useEffect, useRef, useState } from "react";

import { useQuery } from "react-query";
import BannerService from "../../services/BannerService";

import DataTableHeader from "../../components/dataTable/DataTableHeader";

import { SDataDetailBody } from "../../components/detailTable/DataDetailBody.styled";
import { DataDetailItem } from "../../components/detailTable/DataDetailBody";

import UploadBtn from "../../components/common/uploadBtn/UploadBtn";
import FileUpload from "../../components/fileUpload/FileUpload";

const HomeBannerSettingPage = () => {
  // TODO: type
  const fileRef = useRef<any>();

  const { data, isLoading: bannerLoading } = useQuery(["banner-about"], () =>
    BannerService.info("about")
  );

  const [body, setBody] = useState({ bannerType: "image" });
  const [file, setFile] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [notiMessage, setNotiMessage] = useState("");

  useEffect(() => {
    setFile(data?.images || []);

    setBody(data);
  }, [data]);

  const onClickSubmit = async () => {
    setIsLoading(true);

    const param = {
      id: "about",
      ...body,
    } as any;

    if (!fileRef.current) return;

    const web = await fileRef.current.upload("about");
    param["images"] = web.images || [];

    BannerService.saveItem("new", param)
      .then(() => {
        setNotiMessage("수정 되었습니다.");
      })
      .catch(() => {
        setNotiMessage("에러가 발생하였습니다. 잠시 후 다시시도해주세요.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <React.Fragment>
      <DataTableHeader
        title="홈 배너 관리"
        resister={{ text: "저장", onClick: onClickSubmit }}
        notiMessage={notiMessage}
        isLoading={isLoading || bannerLoading}
      />

      <SDataDetailBody padding>
        <DataDetailItem span={2} />
        <DataDetailItem label="배너이미지" span={2}>
          <UploadBtn
            onClick={fileRef}
            helpText="권장 사이즈 : 1920*1080 / 최대 용량 : 5MB / 최대 개수 : 10개"
          />
          <FileUpload
            ref={fileRef}
            files={file}
            maxCount={10}
            onFileHandler={setFile}
            folder="main"
          />
        </DataDetailItem>
      </SDataDetailBody>
    </React.Fragment>
  );
};

export default HomeBannerSettingPage;
