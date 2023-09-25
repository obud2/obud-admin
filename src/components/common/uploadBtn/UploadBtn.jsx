import React from 'react';

import { SUploadBtn } from './UploadBtn.styled';

/**
 *
 * @param {*} onClick : 파일업로드 Ref 넘겨주면 됨
 * @param {*} helpText : 업로드 권장 사이즈 표시
 * @returns
 */
const UploadBtn = ({ onClick, helpText }) => {
  const onClickUploadBtn = () => {
    if (onClick?.current) {
      onClick?.current?.open();
    }
  };

  return (
    <SUploadBtn>
      <button className="upload-button" onClick={onClickUploadBtn}>
        이미지 추가
      </button>
      {helpText && <p className="upload-helptext">{helpText}</p>}
    </SUploadBtn>
  );
};

export default UploadBtn;
