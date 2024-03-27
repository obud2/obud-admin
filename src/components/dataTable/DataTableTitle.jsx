import React from 'react';

import { Button } from 'antd';

import { SDataTableTitle } from './DataTableTitle.styled';

const DataTableTitle = ({ title, subTitle, addResister, resister, isLoading, disabled }) => {
  return (
    <SDataTableTitle>
      <div className="data-table-title-container">
        <h6 className="data-table-title">{title}</h6>

        <p className="data-table-sub-title">{subTitle}</p>
      </div>

      <div className="data-table-button-container">
        {addResister && (
          <Button
            onClick={addResister?.onClick || addResister}
            block
            disabled={isLoading || disabled}
            loading={isLoading}
            style={{ width: 'auto', minWidth: '100px', borderColor: '##d9d9d9' }}
          >
            {addResister?.text || '등록'}
          </Button>
        )}

        {resister && (
          <Button
            onClick={resister?.onClick || resister}
            block
            type="primary"
            disabled={isLoading || disabled}
            loading={isLoading}
            style={{ width: 'auto', minWidth: '100px' }}
          >
            {resister?.text || '등록'}
          </Button>
        )}
      </div>
    </SDataTableTitle>
  );
};

export default DataTableTitle;
