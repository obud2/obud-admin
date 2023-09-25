import React, { useState } from 'react';

import { SDataSearchBox } from './DataSearchBox.styled';
import { SearchOutlined } from '@ant-design/icons';

const DataSearchBox = ({ doSearch, placeholder, isLoading, disabled }) => {
  const [value, setValue] = useState('');

  const onChangeInput = (e) => {
    setValue(e.target.value);
  };

  const onKeyDown = (e) => {
    const KEY = e.key;
    const ENTER = 'Enter';

    if (KEY === ENTER) {
      onSubmit(value);
    }
  };

  const onSubmit = async () => {
    if (isLoading) return;

    await doSearch(value);
  };

  return (
    <SDataSearchBox disabled={isLoading || disabled} doSearch={doSearch}>
      <input
        className="search-box-input"
        placeholder={placeholder || '검색어를 입력해주세요.'}
        value={value}
        disabled={isLoading || disabled}
        onChange={onChangeInput}
        onKeyDown={onKeyDown}
      />

      <div className="select-filter-item-icon" onClick={onSubmit}>
        <SearchOutlined />
      </div>
    </SDataSearchBox>
  );
};

export default DataSearchBox;
