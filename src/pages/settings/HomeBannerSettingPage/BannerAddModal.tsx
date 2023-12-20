import UploadBtn from "@/components/common/uploadBtn/UploadBtn";
import { DataDetailItem } from "@/components/detailTable/DataDetailBody";
import FileUpload, { FileUploadElem } from "@/components/fileUpload/FileUpload";
import BannerService from "@/services/BannerService";
import { Button, Input, Modal, message } from "antd";
import { useRef, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  lastOrder: number;
  refetch: () => void;
};

const BannerAddModal = ({ open, onClose, lastOrder, refetch }: Props) => {
  const [name, setName] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [file, setFile] = useState([]);
  const fileRef = useRef<FileUploadElem>();

  const handleClose = () => {
    setName("");
    setLinkUrl("");
    setFile([]);
    onClose();
  };

  const handleSubmit = async () => {
    if (!fileRef.current) return;

    const { images } = await fileRef.current.upload("lesson");
    try {
      await BannerService.createBanner({
        name,
        linkUrl,
        order: lastOrder + 1,
        imageUrl: images[0].url,
      });
      refetch();
      message.success("저장되었습니다.");
    } catch (err) {
      message.error("에러가 발생하였습니다. 잠시 후 다시 시도해주세요.");
    }
    handleClose();
  };

  return (
    <Modal
      title="배너 추가"
      open={open}
      onCancel={handleClose}
      destroyOnClose
      footer={[
        <Button key={"save"} onClick={handleSubmit}>
          저장
        </Button>,
        <Button key={"cancel"} onClick={handleClose}>
          취소
        </Button>,
      ]}
    >
      <DataDetailItem label="배너 이름">
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </DataDetailItem>
      <DataDetailItem label="배너 링크">
        <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
      </DataDetailItem>
      <DataDetailItem label="배너이미지" span={2}>
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
    </Modal>
  );
};

export default BannerAddModal;
