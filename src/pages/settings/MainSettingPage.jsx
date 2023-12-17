import React, { useEffect, useRef, useState } from "react";

import { Radio, Spin } from "antd";

import { useQuery } from "react-query";
import BannerService from "../../services/BannerService";

import DataTableHeader from "../../components/dataTable/DataTableHeader";

import { SDataDetailBody } from "../../components/detailTable/DataDetailBody.styled.tsx";
import { DataDetailItem } from "../../components/detailTable/DataDetailBody";

import UploadBtn from "../../components/common/uploadBtn/UploadBtn";
import FileUpload from "../../components/fileUpload/FileUpload.tsx";
import VideoUpload from "../../components/fileUpload/VideoUpload";
import swal from "sweetalert";

const MainSettingPage = () => {
  const fileRef = useRef();
  const fileMobileRef = useRef();

  const videoRef = useRef();
  const videoMobileRef = useRef();

  const { data, isLoading: bannerLoading } = useQuery(["banner-main"], () =>
    BannerService.info("main")
  );

  const [body, setBody] = useState({
    bannerType: "image",
  });

  const [file, setFile] = useState([]);
  const [fileMobile, setFileMobile] = useState([]);

  const [video, setVideo] = useState([]);
  const [videoMobile, setVideoMobile] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [notiMessage, setNotiMessage] = useState("");

  useEffect(() => {
    setFile(data?.images || []);
    setFileMobile(data?.images_m || []);
    setVideo(data?.video || []);
    setVideoMobile(data?.video_m || []);

    setBody(data);
  }, [data]);

  const onChangeBody = (type, e) => {
    setBody((prev) => ({ ...prev, [type]: e }));
  };

  const onClickSubmit = async () => {
    setIsLoading(true);

    const param = {
      id: "main",
      ...body,
    };

    if (body?.bannerType === "image") {
      // 이미지 업로드
      if (!file?.length > 0) {
        swal("웹 / 모바일 둘중 하나의 이미지는 필수입니다.", {
          icon: "error",
        });
        return;
      }

      const web = await fileRef.current.upload("main");
      param["images"] = web.images || [];

      const mobile = await fileMobileRef.current.upload("main");
      param["images_m"] = mobile.images || [];
    } else if (body?.bannerType === "video") {
      // 비디오 업로드
      if (!video?.length > 0) {
        swal("웹 / 모바일 둘중 하나의 비디오는 필수입니다.", {
          icon: "error",
        });
        return;
      }

      const web = await videoRef.current.upload("main");
      param["video"] = web.images || [];

      const mobile = await videoMobileRef.current.upload("main");
      param["video_m"] = mobile.images || [];
    }

    BannerService.saveItem("edit", param)
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
        title="메인화면관리"
        resister={{ text: "저장", onClick: onClickSubmit }}
        notiMessage={notiMessage}
        isLoading={isLoading || bannerLoading}
      />

      <SDataDetailBody padding>
        <DataDetailItem label="화면 타입" span={2}>
          <Radio.Group
            onChange={(e) => onChangeBody("bannerType", e.target.value)}
            value={body?.bannerType || ""}
            disabled={isLoading || bannerLoading}
          >
            <Radio value="image">이미지</Radio>
            <Radio value="video">비디오</Radio>
          </Radio.Group>
        </DataDetailItem>

        <DataDetailItem span={2} />

        {(isLoading || bannerLoading) && <Spin />}

        {body?.bannerType === "image" && (
          <React.Fragment>
            <DataDetailItem label="(웹)" span={2}>
              <UploadBtn
                onClick={fileRef}
                helpText="권장 사이즈 : 1920*1080 / 최대 용량 : 5MB / 최대 개수 : 1개"
              />
              <FileUpload
                ref={fileRef}
                files={file}
                maxCount={1}
                onFileHandler={setFile}
                folder="main"
              />
            </DataDetailItem>

            <DataDetailItem label="(모바일)" span={2}>
              <UploadBtn
                onClick={fileMobileRef}
                helpText="권장 사이즈 : 1080*1920 / 최대 용량 : 5MB / 최대 개수 : 1개 (모바일 이미지를 추가 안할 시 웹 이미지가 노출됩니다.)"
              />
              <FileUpload
                ref={fileMobileRef}
                files={fileMobile}
                maxCount={1}
                onFileHandler={setFileMobile}
                folder="main"
              />
            </DataDetailItem>
          </React.Fragment>
        )}

        {body?.bannerType === "video" && (
          <React.Fragment>
            <DataDetailItem label="(웹)" span={2}>
              <UploadBtn
                onClick={videoRef}
                helpText="권장 사이즈 : 1920*1080 / 최대 용량 : 5MB / 최대 개수 : 1개"
              />
              <VideoUpload
                ref={videoRef}
                files={video}
                maxCount={1}
                onFileHandler={setVideo}
                folder="main"
              />
            </DataDetailItem>

            <DataDetailItem label="(모바일)" span={2}>
              <UploadBtn
                onClick={videoMobileRef}
                helpText="권장 사이즈 : 1080*1920 / 최대 용량 : 5MB / 최대 개수 : 1개 (모바일 비디오를 추가 안할 시 웹 비디오가 노출됩니다.)"
              />
              <VideoUpload
                ref={videoMobileRef}
                files={videoMobile}
                maxCount={1}
                onFileHandler={setVideoMobile}
                folder="main"
              />
            </DataDetailItem>
          </React.Fragment>
        )}
      </SDataDetailBody>
    </React.Fragment>
  );
};

export default MainSettingPage;
