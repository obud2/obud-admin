import React from 'react';
import DaumPostCode from 'react-daum-postcode';
import { SDaumPost } from './DaumPost.styled';

const DaumPost = ({ isOpen, isClose, onChange }) => {
  const handleComplete = (data) => {
    let Address = data.address;
    let postCode = data.zonecode;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
    }

    if (onChange) onChange(Address, extraAddress, postCode);
    isClose();
  };

  return (
    isOpen && (
      <SDaumPost isOpen={isOpen}>
        <div className="daum-post-background" />

        <div className="daum-post-container">
          <div className="daum-post-header">
            <p className="daum-post-title">주소검색</p>
            <button className="daum-post-close" onClick={isClose} />
          </div>

          <DaumPostCode onComplete={handleComplete} className="daumPost" />
        </div>
      </SDaumPost>
    )
  );
};

export default DaumPost;
