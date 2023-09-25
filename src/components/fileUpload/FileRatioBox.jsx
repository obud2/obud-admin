import React, { useState } from 'react';

import { SlSizeFullscreen } from 'react-icons/sl';

const SIZE_OPTION = [
  {
    id: '1',
    label: '1:1',
  },
  {
    id: '4 / 3',
    label: '4:3',
  },
  {
    id: '16 / 9',
    label: '16:9',
  },
];

const FileRatioBox = ({ onClickSize }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClickOpenSize = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <ul className={`uploading-option-size-select-box ${isOpen ? 'open' : ''}`}>
        {SIZE_OPTION?.map((item) => (
          <li key={item?.label} className="uploading-option-select-item" onClick={() => onClickSize(item?.id)}>
            {item?.label}
          </li>
        ))}
      </ul>

      <div className="uploading-option-box size" onClick={onClickOpenSize}>
        <SlSizeFullscreen />
      </div>
    </>
  );
};

export default FileRatioBox;
