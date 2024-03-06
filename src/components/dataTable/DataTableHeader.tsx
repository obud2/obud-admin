import React, { useEffect } from 'react';

import { notification } from 'antd';

import DataTableTitle from './DataTableTitle';
import DataSearchBox from './DataSearchBox';
import DataTableFilter from './DataTableFilter';

/**
 *
 * @param {String} title  : 상단 타이틀
 * @param {Object} resister  { text: 버튼이름, onClick: onClick Event } : 등록버튼
 *
 * @param {Array} filter : 필터 탭
 * @param {Fucntion} doFilter  : 필터 탭 Change Event
 *
 * @param {Fucntion} refetch : 새로고침 -> 등록 후 새로 고칠 펑션
 * @param {Fucntion} doSearch : 검색 버튼 -> 없을 시 화면 노출 x
 * @param {Boolean} isLoading  : 로딩
 * @returns
 */

type Props = {
  title: string | React.ReactNode;
  subTitle?: string;
  register?: { text: string; onClick: () => void };
  addResister?: { text: string; onClick: () => void };
  filter?: any;
  doFilter?: (value: string) => void;
  doSearch?: (value: string) => void;
  searchPlaceholder?: string;
  isLoading?: boolean;
  disabled?: boolean;
  notiMessage?: string;
  notiDescription?: string;
  searchDisabled?: boolean;
};

const DataTableHeader = ({
  title,
  subTitle,
  filter,
  doFilter,
  addResister,
  register,
  doSearch,
  disabled,
  searchPlaceholder,
  isLoading,
  notiMessage,
  notiDescription,
  searchDisabled = false,
}: Props) => {
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (notiMessage || notiDescription) {
      openNotification(notiMessage, notiDescription, 'bottomRight');
    }
  }, [notiMessage, notiDescription]);

  const openNotification = (notiMessage: any, notiDescription: any, placement: any) => {
    api.info({
      message: notiMessage,
      description: notiDescription,
      placement,
    });
  };

  return (
    <React.Fragment>
      {contextHolder}

      <DataTableTitle
        title={title}
        subTitle={subTitle}
        addResister={addResister}
        resister={register}
        isLoading={isLoading}
        disabled={disabled}
      />
      {filter && <DataTableFilter filter={filter} onChangeFilter={doFilter} />}
      {!searchDisabled && doSearch && (
        <DataSearchBox doSearch={doSearch} placeholder={searchPlaceholder} isLoading={isLoading} disabled={disabled} />
      )}
    </React.Fragment>
  );
};

/**
 *
 * @param {*} filter : 검색 제목
 * @param {*} data : 상품 리스트
 * @param {*} key  : 검색 될 Key
 * @returns
 */
export const dataFilter = async (filter: string, data: any, key: string) => {
  const dataCopy = [...data];
  let rtData = [];

  if (filter) {
    dataCopy?.forEach((d) => {
      if (d?.[key].includes(filter)) {
        rtData.push(d);
      }
    });
  } else {
    rtData = dataCopy;
  }

  return rtData;
};

/**
 *
 * @param {*} filter : 핕터 항목
 * @param {*} data : 상품 리스트
 * @param {*} key  : 검색 될 Key
 * @returns
 */
export const tabFilter = (filter: string, data: any[], key: string) => {
  const dataCopy = [...data];
  let rtData = [];

  if (filter) {
    dataCopy?.forEach((d) => {
      if (d?.[key] === filter) {
        rtData.push(d);
      }
    });
  } else {
    rtData = dataCopy;
  }

  return rtData;
};

export default DataTableHeader;
