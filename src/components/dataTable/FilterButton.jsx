import React from 'react';

import { Button, Tooltip } from 'antd';

import { SortAscendingOutlined } from '@ant-design/icons';

const FilterButton = ({ isFilterData, sortSave, isLoading }) => {
  return !isFilterData ? (
    <Tooltip title="정렬 저장">
      <Button shape="circle" icon={<SortAscendingOutlined />} onClick={sortSave} loading={isLoading} />
    </Tooltip>
  ) : (
    <p className="data-sort-btn-tooltip">* 필터 상태로는 정렬이 불가능합니다.</p>
  );
};

export default FilterButton;
