import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { BASE_IMG_URL } from "../../constants/config";

import UploadToS3, { imageOptimization } from "./UploadToS3";

import { SFileUpload } from "./FileUpload.styled";
import { UploadingHelpMessage } from "./FileUploading.styled";

import { removeStorageFile } from "./FileUpload.function";

import FileUploading from "./FileUploading";

/**
 * TODO: Make Strict Typing
 */

/**
 *  @param {Ref} ref : 필수 값
 *
 *  @param {Promise} uploadKey : 업로드 될 키 )  default = images
 *
 *  삭제 시 필수 프롭스 ---------------------------------
 *  @param {String} deleteId : 파일 삭제 할 시 참조 Id
 *  @param {Promise} deleteKey : 파일 삭제 할 시 API Key  ex ) axios.put(API_UPL/"deleteKey"/file ~)
 *  -------------------------------------------------
 *
 *  @param {Number} limit : 업로드 파일 용량 제한 ( 기본값 5MB )
 *  @param {String} accept : 파일 포맷형식 ( 기본값 : image/* )
 *  @param {Number} maxCount : 최대 파일 업로드 수
 *
 *  @param {file} files : 파일 객체
 *  @param {String} folder : 파일 업로드 될 폴더
 *  @callback onFileHandler : 업로드 핸들러
 *
 *  파일 업로드는 업로드한 사진 확인 가능 용도 및 업로드 기능으로 만 사용 / 커스텀 버튼을 통해 업로드.
 */

const FileUpload = forwardRef((props: any, ref) => {
  const {
    files,
    onFileHandler,

    limit = 5,
    maxCount,

    deleteId,
    deleteKey,

    folder = "temp",
    accept = "image/*",
    uploadKey = "images",
  } = props;

  const fileRef = useRef<HTMLInputElement>(null);

  const [uploadList, setUploadList] = useState([]);
  const [uploadingItem, setUploadingItem] = useState("");

  const [errMessage, setErrMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    async open() {
      if (isLoading) return;

      fileRef.current!.click();
    },

    async cleanUp() {
      setUploadList([]);
      setUploadingItem("");
      setErrMessage("");
      setIsLoading(false);
    },

    async upload(id: any) {
      if (isLoading) return;

      if (!id) return setErrMessage("Missing required key.");
      if (!(files?.length > 0)) return [];

      const param = { id } as any;
      const upKey = uploadKey;

      param[upKey] = [];
      param.uploadKey = upKey;

      for await (const file of files) {
        if (file?.upload) {
          // 파일이 S3 업로드 되어 있을 시..
          param[upKey].push(file);
        } else {
          // 파일이 S3 업로드 되어 있지 않을 시..
          const newFile = new File([file], file?.name, {
            name: file?.name,
            path: file?.path,
            lastModified: file?.lastModified,
            lastModifiedDate: file?.lastModified,
            size: file?.size,
            type: "image/jpeg",
          } as any);

          const compressedFile = await imageOptimization(newFile);

          const result = await UploadToS3(compressedFile, folder, id);

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
      }, 5000);
    }
  }, [errMessage]);

  const onChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const files = e.target.files;

    if (!files) return;

    if (maxCount && files.length > maxCount) {
      setErrMessage(`${maxCount}장까지 첨부 가능합니다.`);
      e.target.value = "";
      return;
    }
    if (maxCount && uploadList.length + files.length > maxCount) {
      setErrMessage(`${maxCount}장까지 첨부 가능합니다.`);
      e.target.value = "";
      return;
    }

    setIsLoading(true);
    for (let i = 0; i < files.length; i++) {
      const temp = files[i];

      if (i === files.length - 1) {
        setIsLoading(false);
        setUploadingItem(URL.createObjectURL(temp));
      }
    }

    e.target.value = "";
  };

  const removeUploadListFile = (idx: number, item: { upload: any }) => {
    if (item?.upload) {
      removeStorageFile(item, deleteId, uploadKey, deleteKey);
    }

    uploadList.splice(idx, 1);
    setUploadList([...uploadList]);
    onFileHandler([...uploadList], uploadKey);
  };

  const onClickCloseOptionBox = () => {
    setUploadingItem("");
  };

  const onOptionSelect = async (item: any) => {
    const list = [...uploadList, item] as any;

    try {
      await setUploadList(list);
      await onFileHandler(list);
      await setUploadingItem("");
    } catch (error) {}
  };

  const updateList = (files: React.SetStateAction<never[]>) => {
    setUploadList(files);
    onFileHandler(files);
  };

  return (
    <SFileUpload>
      <input
        className="fileupload-input"
        ref={fileRef}
        type="file"
        accept={accept}
        onChange={(e) => onChangeFile(e)}
        //
      />

      {/* <Cropper  /> */}
      <FileUploading
        src={uploadingItem}
        onClose={onClickCloseOptionBox}
        onClick={onOptionSelect}
      />

      <div className="upload-list-view-box">
        {uploadList?.map((item, idx) => (
          <UploadedItem
            key={`file-gallery-${idx}`}
            idx={idx}
            item={item}
            dataList={uploadList}
            setDatas={updateList}
            removeUploadListFile={removeUploadListFile}
          />
        ))}
      </div>

      <UploadingHelpMessage>
        {errMessage && (
          <div className="uploading-help-message">
            <b>* </b>
            {errMessage}
          </div>
        )}
      </UploadingHelpMessage>
    </SFileUpload>
  );
});

const UploadedItem = ({
  item,
  idx,
  dataList,
  setDatas,
  removeUploadListFile,
}: any) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: any) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    const fromIndex = e.dataTransfer.getData("text/plain") as any;
    const newItems = [...dataList];
    const [removedItem] = newItems.splice(fromIndex, 1);

    newItems.splice(index, 0, removedItem);
    setDatas(newItems);
  };

  return (
    <div
      className="upload-list-item"
      draggable
      onDragStart={(e) => handleDragStart(e, idx)}
      onDrop={(e) => handleDrop(e, idx)}
      onDragOver={(e) => e.preventDefault()}
    >
      <button
        className="upload-delete-btn"
        onClick={() => removeUploadListFile(idx, item)}
      />

      <img
        className="upload-img"
        src={item?.path || item?.url}
        onError={(e: any) => {
          e.target.src = "https://via.placeholder.com/100.png?text=noimage";
        }}
        alt="preview-img"
      />
    </div>
  );
};

export default React.memo(FileUpload);
