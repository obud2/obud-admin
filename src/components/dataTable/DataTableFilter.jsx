import React, { useEffect, useState } from 'react';

import { SDataTableFilter } from './DataTableFilter.styled';

const DataTableFilter = ({ filter, onChangeFilter }) => {
  const [choose, setChoose] = useState('');

  useEffect(() => {
    if (filter && filter?.length > 0) {
      setChoose(filter[0]?.id);
    }
  }, [filter]);

  const onChangeFilterData = (e) => {
    setChoose(e);
    onChangeFilter(e);
  };

  return (
    filter &&
    filter?.length > 0 && (
      <SDataTableFilter>
        {filter?.map((item) => (
          <div key={item?.id} className={`filter-item ${choose === item?.id ? 'active' : ''}`} onClick={() => onChangeFilterData(item?.id)}>
            {item?.label}
          </div>
        ))}
      </SDataTableFilter>
    )
  );
};

export default DataTableFilter;
