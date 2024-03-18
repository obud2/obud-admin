import React, { useEffect, useState } from 'react';

import swal from 'sweetalert';
import moment from 'moment';

import { Select, Input, Button } from 'antd';
import { SearchOutlined, CalendarOutlined } from '@ant-design/icons';

import { SDataTableSearchBox, SRenderText } from './DataTableSearchBox.styled';
import { SEARCH_FILTER } from './DataTableSearchBox.filter';
import DatePicker from './DatePicker';

const DataTableSearchBox = ({ doSearch, doClear, isLoading }) => {
  const [filterArr, setFilterArr] = useState([]);

  const doSearchd = () => {
    if (filterArr?.length > 0) {
      if (doSearch) doSearch(filterArr);
    } else {
      swal('필터를 입력 후 추가해주세요.', {
        icon: 'error',
      });
    }
  };

  const doCleard = () => {
    setFilterArr([]);
    if (doClear) doClear();
  };

  const rtData = (data) => {
    const filterCopy = [...filterArr];
    const dataCopy = { ...data, id: `${data?.filter}-${data?.value}-${filterArr.length}` };

    filterCopy.push(dataCopy);

    setFilterArr(filterCopy);
  };

  return (
    <SDataTableSearchBox>
      <RenderText filterData={SEARCH_FILTER} filterArr={filterArr} rtData={rtData} isLoading={isLoading} />

      <div className="filter-list-container">
        {filterArr && filterArr?.length > 0 && (
          <>
            {filterArr?.map((filter) => (
              <div className="select-filter-item" key={filter?.id}>
                <div className="select-filter-item-icon">
                  <SearchOutlined />
                </div>

                <p>{filter?.filterLabel || ''}</p>
                <p>-</p>
                <p>{filter?.value || ''}</p>
              </div>
            ))}
            <p className="filter-list-info-text">* 상단검색 데이터 우선순위로 검색 됩니다.</p>
          </>
        )}
      </div>

      <div className="data-table-search-btn-container">
        <div className="data-table-search-btn">
          <Button block type="primary" onClick={doSearchd} loading={isLoading}>
            검색
          </Button>
        </div>

        <div className="data-table-reset-btn">
          <Button block onClick={doCleard} loading={isLoading}>
            초기화
          </Button>
        </div>
      </div>
    </SDataTableSearchBox>
  );
};

const RenderText = ({ filterData, filterArr, rtData, isLoading }) => {
  const [filterRenderData, setFilterRenderData] = useState([]);

  const [selectFilter, setSelectFilter] = useState({});
  const [value, setValue] = useState({});

  const [isDateOpen, setIsDateOpen] = useState(false);

  useEffect(() => {
    if (filterData?.length > 0) {
      const filterArrCopy = filterArr?.map((a) => a?.filter);

      const filterDataCopy = filterData?.filter((a) => !filterArrCopy?.includes(a?.value));

      setFilterRenderData(filterDataCopy);
    }
  }, [filterData, filterArr]);

  useEffect(() => {
    if (filterData?.length > 0) {
      filterData?.forEach((a) => {
        if (a?.value === value?.filter) {
          setSelectFilter(a);
        }
      });
    }
  }, [filterData, value]);

  const onClickDateClose = () => {
    setIsDateOpen(false);
  };

  const handleChange = (type, e) => {
    if (type === 'filter') {
      setValue({ ...value, filter: e, value: '' });
    } else {
      setValue({ ...value, [type]: e });
    }
  };

  const addItem = () => {
    if (value?.value && value?.filter) {
      const valueCopy = { ...value, filterLabel: selectFilter?.label };

      if (valueCopy?.filter === 'isShow') {
        if (valueCopy?.value === '공개') valueCopy.value = 'true';
        if (valueCopy?.value === '비공개') valueCopy.value = 'false';
      }

      if (valueCopy?.filter === 'createdAt') {
        valueCopy.value = moment(valueCopy.value).format('YYYY-MM-DD');
        valueCopy.date = moment(valueCopy.value).valueOf();
      }

      setValue({});
      setSelectFilter({});

      rtData(valueCopy);
    } else {
      swal('검색어를 입력해주세요.', {
        icon: 'error',
      });
    }
  };

  return (
    <SRenderText>
      <div className="render-text-label">검색</div>

      <div className="render-text-filter">
        <Select
          defaultValue="필터"
          style={{ width: 120 }}
          value={value?.filter || ''}
          options={filterRenderData}
          onChange={(e) => handleChange('filter', e)}
          disabled={isLoading}
        />

        <Input
          value={value?.value || ''}
          onChange={(e) => handleChange('value', e?.target?.value)}
          placeholder={selectFilter?.placeholder || '필터를 선택해주세요.'}
          maxLength={selectFilter?.maxLength || 10}
          disabled={isLoading || selectFilter?.date}
        />

        {selectFilter?.date && (
          <Button onClick={() => setIsDateOpen(true)} disabled={isLoading}>
            <CalendarOutlined />
          </Button>
        )}

        <Button danger onClick={addItem} disabled={isLoading}>
          추가
        </Button>

        <DatePicker open={isDateOpen} onClose={onClickDateClose} onChange={(e) => handleChange('value', e)} allowClear={false} />
      </div>
    </SRenderText>
  );
};

export default DataTableSearchBox;
