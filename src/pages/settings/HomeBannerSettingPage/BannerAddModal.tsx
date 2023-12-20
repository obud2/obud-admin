import UploadBtn from "@/components/common/uploadBtn/UploadBtn";
import { DataDetailItem } from "@/components/detailTable/DataDetailBody";
import FileUpload from "@/components/fileUpload/FileUpload";
import { Button, Input, Modal } from "antd";
import { useRef, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  lastOrder: number;
};

const BannerAddModal = ({ open, onClose, lastOrder }: Props) => {
  const [name, setName] = useState("");
  const [file, setFile] = useState([]);
  const fileRef = useRef<HTMLInputElement>();

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    onClose();
  };

  return (
    <Modal
      title="배너 추가"
      open={open}
      onCancel={handleClose}
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
