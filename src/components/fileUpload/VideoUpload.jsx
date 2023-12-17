import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { BASE_IMG_URL } from "../../constants/config";

import { v4 as uuidv4 } from "uuid";
import UploadToS3 from "./UploadToS3";

import { SVideoUpload } from "./VideoUpload.styled";

const VideoUpload = forwardRef((props, ref) => {
  const {
    files,
    onFileHandler,

    deleteId,
    deleteKey,

    folder = "temp",
    uploadKey = "images",
  } = props;

  const fileRef = useRef();

  const [uploadList, setUploadList] = useState([]);

  const [errMessage, setErrMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    async open() {
      if (isLoading) return;

      fileRef.current.click();
    },

    async cleanUp() {
      setUploadList([]);
      setErrMessage("");
      setIsLoading(false);
    },

    async upload(id) {
      if (isLoading) return;

      if (!id) return setErrMessage("Missing required key.");
      if (!(files?.length > 0)) return [];

      const param = { id };
      const upKey = uploadKey;

      param[upKey] = [];
      param.uploadKey = upKey;

      for await (const file of files) {
        if (file?.upload) {
          // 파일이 S3 업로드 되어 있을 시..
          param[upKey].push(file);
        } else {
          // 파일이 S3 업로드 되어 있지 않을 시..

          const fileName = uuidv4();
          const newFile = new File([file], fileName, {
            name: fileName,
            path: file?.path,
            lastModified: file?.lastModified,
            lastModifiedDate: file?.lastModified,
            size: file?.size,
            type: "image/jpeg",
          });

          const result = await UploadToS3(newFile, folder, id);

          const url = `${BASE_IMG_URL}${result?.key}`;

          param[upKey].push({
            key: result?.key,
            url,
            name: newFile?.name,
            type: newFile?.type,
            size: newFile?.size,
            upload: true, // 파일이 업로드 된 경우 upload 값 추가 -> 파일 업로드 체크
          });
        }
      }

      return param;
    },
  }));

  // 기본값 이미지 추가
  useEffect(() => {
    setUploadList(files);
  }, [files]);

  useEffect(() => {
    if (errMessage) {
      setTimeout(() => {
        setErrMessage("");
      }, [5000]);
    }
  }, [errMessage]);

  const onChangeFile = async (e) => {
    e.preventDefault();

    const maxCount = 1;
    const files = e.target.files;

    if (maxCount && files.length > maxCount) {
      setErrMessage(`${maxCount}개까지 업로드 가능합니다.`);
      e.target.value = "";
      return;
    }
    if (maxCount && uploadList.length + files.length > maxCount) {
      setErrMessage(`${maxCount}개까지 업로드 가능합니다.`);
      e.target.value = "";
      return;
    }

    setIsLoading(true);
    for (let i = 0; i < files.length; i++) {
      const temp = files[i];
      const list = [...uploadList, temp];

      if (i === files.length - 1) {
        setIsLoading(false);
        setUploadList(list);
        onFileHandler(list);
      }
    }

    e.target.value = "";
  };

  const removeUploadListFile = (idx, item) => {
    if (item?.upload) {
      removeStorageFile(item, deleteId, uploadKey, deleteKey);
    }

    uploadList.splice(idx, 1);
    setUploadList([...uploadList]);
    onFileHandler([...uploadList], uploadKey);
  };

  return (
    <SVideoUpload>
      <input
        className="fileupload-input"
        ref={fileRef}
        type="file"
        accept="video/mp4,video/mkv, video/x-m4v,video/*"
        onChange={(e) => onChangeFile(e)}
        //
      />

      {uploadList?.map((item, idx) => (
        <div className="upload-container" key={`file-video-${idx}`}>
          <button
            className="upload-delete-btn"
            onClick={() => removeUploadListFile(idx, item)}
          />

          <p className="video-name">{item?.name}</p>
          <video
            className="upload-video"
            src={item?.upload ? item?.url : URL.createObjectURL(item)}
          />
        </div>
      ))}
    </SVideoUpload>
  );
});

export default VideoUpload;
