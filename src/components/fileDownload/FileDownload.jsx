import React, { useState } from 'react';

import { Button, notification, Tooltip } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

import Excel from 'exceljs';
import moment from 'moment';

/**
 *
 * @param {*} cols
 * const EXCEL_COLS = [
 *  { id: 'id', label: 'ID' },
 *  { id: 'title', label: '제목' },
 *  { id: 'category', label: '구분', customBodyRender: f },
 * ];
 *
 *  customBodyRender : 리스트 헤더랑 똑같이 동작
 *
 * @param {Promise} listApi : 전체 리스트 불러오는 API/ 결과값은 무조건 Array 반환되도록.
 *
 */
const FileDownload = ({ cols, listApi }) => {
  const [api, contextHolder] = notification.useNotification();
  const [isLoading, setIsLoadig] = useState(false);

  const openNotification = (notiMessage, notiDescription, placement) => {
    api.error({
      message: notiMessage,
      description: notiDescription,
      placement,
    });
  };

  const handleClick = () => {
    if (!listApi) {
      openNotification('Error', 'List Api를 추가해주세요.', 'bottomRight');
      return;
    }

    setIsLoadig(true);

    // resolve Array
    listApi().then((data) => {
      if (data && data?.length > 0) {
        try {
          // 엑셀 생성
          const workbook = new Excel.Workbook();

          // 생성일(현재 일자로 처리)
          workbook.created = new Date();

          // 수정일(현재 일자로 처리)
          workbook.modified = new Date();

          // addWorksheet() 함수를 사용하여 엑셀 시트를 추가한다.
          // 엑셀 시트는 순차적으로 생성된다.
          workbook.addWorksheet('Sheet One');

          // 엑셀 시트를 접근하는 방법은 세 가지 방법이 존재한다.
          // 1. getWorksheet() 함수에서 시트 명칭 전달
          const sheetOne = workbook.getWorksheet('Sheet One');

          const _cols = [
            {
              header: 'no',
              key: 'no',
              width: 20,
            },
          ];
          const _body = [];

          for (let i = 0; i < cols?.length; i++) {
            if (cols[i]?.id && cols[i]?.label) {
              _cols.push({
                header: cols[i]?.label,
                key: cols[i]?.id,
                width: 40,
                customBodyRender: cols[i]?.customBodyRender || false,
              });
            }
          }

          const obj = [];
          for (let i = 0; i < _cols?.length; i++) {
            obj.push(_cols[i].key);
          }

          for (let i = 0; i < data?.length; i++) {
            let _obj = {};

            for (let j = 0; j < obj?.length; j++) {
              if (_cols[j]?.customBodyRender) {
                _obj[obj[j]] = _cols[j]?.customBodyRender(data[i][obj[j]], data[i]);
              } else {
                if (obj[j] === 'no') _obj[obj[j]] = i + 1;
                else _obj[obj[j]] = data[i][obj[j]] || '';
              }
            }

            _body.push(_obj);
          }

          // 컬럼 바디설정
          sheetOne.columns = _cols;
          _body.map((item) => {
            sheetOne.addRow(item);
          });

          workbook.xlsx.writeBuffer().then((data) => {
            setIsLoadig(false);

            const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = `${moment().format('YYYY.MM.DD_HH.mm.ss')}.xlsx`;
            anchor.click();
            window.URL.revokeObjectURL(url);
          });
        } catch (error) {
          openNotification('Error', error, 'bottomRight');
        }
      } else {
        setIsLoadig(false);
        openNotification('Error', '다운 가능한 리스트가 없습니다.', 'bottomRight');
      }
    });
  };

  return (
    <React.Fragment>
      {contextHolder}

      <Tooltip title="엑셀 다운">
        <Button shape="circle" icon={<SaveOutlined />} onClick={handleClick} loading={isLoading} disabled={isLoading} />
      </Tooltip>
    </React.Fragment>
  );
};

export default FileDownload;
