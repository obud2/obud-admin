import React, { useRef, useState } from 'react';

import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

import { Spin } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { SFileUploading } from './FileUploading.styled';

const FileUploading = ({ src, onClose, onClick }) => {
  const cropperRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);

  const onClickGetData = async () => {
    try {
      setIsLoading(true);
      const imageElement = cropperRef?.current;
      const cropper = imageElement?.cropper;
      const canvasToDataURL = await cropper.getCroppedCanvas().toDataURL();
      const file = await base64ToFile(canvasToDataURL.split(',')[1]);

      file['url'] = await cropper.getCroppedCanvas().toDataURL();

      await onClick(file);

      await setIsLoading(false);
      await onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const base64ToFile = (base64Address) => {
    var byteCharacters = atob(base64Address); // Base64 주소를 디코딩하여 이진 데이터로 변환합니다.
    var byteArrays = [];

    for (var i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i));
    }

    var byteArray = new Uint8Array(byteArrays);

    var file = new File([byteArray], uuidv4());

    return file;
  };

  return (
    <SFileUploading isOpen={src}>
      <div className="uploading-item-background" />

      <div className="uploading-item-option-container">
        {isLoading && (
          <div className="uploading-isLoading">
            <Spin />
          </div>
        )}

        <div className="uploading-item-option-header">
          <button className="uploading-item-close" onClick={onClose} disabled={isLoading} />

          <button className="uploading-item-upload" onClick={onClickGetData} disabled={isLoading}>
            선택
          </button>
        </div>

        <div className="uploading-item-option-main">
          <Cropper
            src={src}
            ref={cropperRef}
            style={{ width: '100%', maxHeight: 400 }}
            zoomTo={0.5}
            initialAspectRatio={1}
            viewMode={1}
            background={true}
            responsive={true}
            autoCropArea={1}
          />
        </div>
      </div>
    </SFileUploading>
  );
};

export default FileUploading;
