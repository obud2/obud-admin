import React, { useContext, useEffect, useRef, useState } from 'react';

import { Button, Radio, Input, Switch, notification } from 'antd';
import { UserContext } from '@/context/UserContext';

import Editor from '../../../components/smartEditor/Editor';

import { useQuery, useQueryClient } from 'react-query';
import CodeService from '../../../services/CodeService';

import UploadBtn from '../../../components/common/uploadBtn/UploadBtn';
import FileUpload from '../../../components/fileUpload/FileUpload';
import swal from 'sweetalert';

import { getProgram, setProgram } from '@/services/ProgramService';
import styled, { css } from 'styled-components';
import { smLayout } from '@/styles/VariablesStyles';
import { NotificationPlacement } from 'antd/es/notification/interface';

const EditProgram = ({ programId, placeId }: { programId: string; placeId: string }) => {
  const defaultBody = { lessonType: 'Regular', title: '', id: '', isShow: undefined, contents: '' };

  const fileRef = useRef<{
    getValue: () => string;
    upload: (key: string) => Promise<{ images: any[] }>;
  }>();
  const contentsRef = useRef<HTMLDivElement & { getValue: () => string }>(null);

  const queryClient = useQueryClient();

  /**
   *
   * @returns 공간 - 이용안내 / 환불규정 / 고객센터 값 호출
   */
  const fetchData = async () => {
    const res = await Promise.all([CodeService.getItem('product-shell-setting'), CodeService.getItem('product-class-setting')]);
    const res1 = res[0]?.value || {};
    const res2 = res[1]?.value || {};

    return {
      convenience: res1?.convenience || [],
      information: res1?.information || '',
      refundPolicy: res1?.refundPolicy || '',
      serviceCenter: res1?.serviceCenter || '',
      type: res2?.type || [],
      category: res2?.category || [],
    };
  };

  const { isAdmin } = useContext(UserContext);
  const { data: code, isLoading: isCodeLoading } = useQuery(['product-code'], fetchData);
  // --------------------------------------------------

  const [body, setBody] = useState(defaultBody);
  const [files, setFiles] = useState([]);

  const [isActive, setIsActive] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [notiMessage, setNotiMessage] = useState('');

  const { data: program } = useQuery(['/studios/lesson', { programId }], () => getProgram(programId));

  useEffect(() => {
    if (!program) {
      setBody(defaultBody);
      setFiles([]);
      return;
    }
    setBody(program);
    setFiles(program.images);

    return () => {
      setBody(defaultBody);
      setFiles([]);
    };
  }, [program]);

  /** 등록 / 수정 버튼 활성화 */
  useEffect(() => {
    if (body?.lessonType && body?.title && files?.length > 0) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [body, files]);

  const onChangeInputValue = (type: 'lessonType' | 'title' | 'isShow', e: string | boolean) => {
    setBody((prev) => ({ ...prev, [type]: e }));
  };

  const onSubmit = async () => {
    const param = {
      ...body,
      placeId,
      contents: contentsRef.current!.getValue(),
      images: [] as any[],
    };

    if (!param?.lessonType) {
      emptyCheck('분류를 선택해주세요.');
      return;
    }
    if (!param?.title) {
      emptyCheck('프로그램명을 입력해주세요.');
      return;
    }

    const text = programId === 'new' ? '등록' : '수정';
    const files = await fileRef.current!.upload('lesson');
    param.images = files.images || [];

    setIsLoading(true);
    setProgram(programId, param)
      .then(() => {
        setNotiMessage(`${text} 되었습니다.`);
      })
      .catch(() => {
        setNotiMessage('에러가 발생하였습니다. 잠시 후 다시시도해주세요.');
      })
      .finally(() => {
        queryClient.invalidateQueries('/studios/lesson');
      });
  };

  const emptyCheck = (text: string) => {
    swal({
      title: '',
      text,
      icon: 'warning',
    });
  };

  const renderButtons = () => {
    return [
      <Button key="cancel-btn" style={{ width: '70px', marginRight: '5px' }}>
        취소
      </Button>,
      <Button key="add-btn" type="primary" style={{ width: '70px' }} disabled={!isActive} onClick={onSubmit}>
        {programId === 'new' ? '등록' : '수정'}
      </Button>,
    ];
  };

  const isAllLoading = isLoading || isCodeLoading;

  return (
    <DataDetailBody
      title={`프로그램 ${programId === 'new' ? '등록' : '수정'}`}
      extra={renderButtons()}
      subTitle={body?.id}
      isLoading={isAllLoading}
      notiMessage={notiMessage}
    >
      <DataDetailItem label="게시여부" span={2}>
        <Switch style={{ width: '50px' }} checked={body?.isShow || false} onChange={(e) => onChangeInputValue('isShow', e)} />
      </DataDetailItem>

      <DataDetailItem label="분류" span={2} point>
        <Radio.Group onChange={(e) => onChangeInputValue('lessonType', e.target.value)} value={body?.lessonType || ''} disabled={!isAdmin}>
          {code &&
            code?.type &&
            code?.type
              ?.filter((a: { isShow: boolean }) => a?.isShow)
              ?.map((type: { title: string }) => (
                <Radio key={type?.title} value={type?.title || ''}>
                  {type?.title || ''}
                </Radio>
              ))}
        </Radio.Group>
      </DataDetailItem>

      <DataDetailItem label="프로그램명" span={2} point>
        <Input
          placeholder="프로그램명을 입력하세요."
          value={body?.title || ''}
          onChange={(e) => onChangeInputValue('title', e.target.value)}
          disabled={isAllLoading}
        />
      </DataDetailItem>

      <DataDetailItem label="이미지" span={2} point>
        <UploadBtn onClick={fileRef} helpText="권장 사이즈 : 123*123 / 최대 용량 : 5MB / 최대 개수 : 5개" />
        <FileUpload ref={fileRef} files={files} maxCount={5} onFileHandler={setFiles} folder="class" />
      </DataDetailItem>

      <DataDetailItem label="상세정보" span={2}>
        <Editor ref={contentsRef} value={body?.contents || ''} disabled={isAllLoading} />
      </DataDetailItem>
    </DataDetailBody>
  );
};

const DataDetailBody = ({
  title,
  subTitle,
  isLoading,
  extra,
  children,
  notiMessage,
}: {
  title: string;
  subTitle: string;
  isLoading: boolean;
  extra: React.ReactNode[];
  children: React.ReactNode;
  notiMessage: string;
}) => {
  return (
    <DataDetail notiMessage={notiMessage} notiDescription="">
      <DetailHeader title={title} subTitle={subTitle} extra={extra} />

      <SDataDetailBody>
        {isLoading && (
          <div className="detail-body-loading">
            <span className="svg-loading" />
          </div>
        )}

        <div className="data-detail-body-container">{children}</div>
      </SDataDetailBody>
    </DataDetail>
  );
};

const DetailHeader = ({ title, subTitle, extra }: { title: string; subTitle: string; extra: React.ReactNode[] }) => {
  return (
    title && (
      <SDetailHeader>
        <div className="detail-header-title-container">
          <span className="detail-title">{title}</span>
          <span className="detail-subTitle">{subTitle}</span>
        </div>

        <div className="detail-header-btn-container">{extra}</div>
      </SDetailHeader>
    )
  );
};

const DataDetail = ({
  children,
  notiDescription,
  notiMessage,
}: {
  children: React.ReactNode;
  notiMessage: string;
  notiDescription: string;
}) => {
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (notiMessage || notiDescription) {
      openNotification(notiMessage, notiDescription, 'bottomRight');
    }
  }, [notiMessage, notiDescription]);

  const openNotification = (notiMessage: string, notiDescription: string, placement: NotificationPlacement) => {
    api.info({
      message: notiMessage,
      description: notiDescription,
      placement,
    });
  };

  return (
    <React.Fragment>
      {contextHolder}
      <SDataDetail>
        <div className="detail-body-container">{children}</div>
      </SDataDetail>
    </React.Fragment>
  );
};
const DataDetailItem = ({
  label,
  point = false,
  span = 2,
  children,
}: {
  label: string;
  point?: boolean;
  span?: number;
  children: React.ReactNode;
}) => {
  return (
    <SDataDetailItem span={span}>
      <p className={`data-detail-body-title ${label ? '' : 'empty'}`}>
        {label} {point && <i className="title-point" />}
      </p>

      <div className="data-detail-body-contents">{children}</div>
    </SDataDetailItem>
  );
};

const SDataDetailBody = styled.div<{ padding?: boolean }>`
  width: 100%;
  min-height: 500px;
  overflow-x: auto;
  height: calc(95% - 24px);

  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 5px;

  margin-top: 10px;
  background-color: #ffffff;

  ${smLayout} {
    padding-bottom: 200px;
  }

  .detail-body-loading {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    background-color: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(4px);

    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
  }

  .data-detail-body-container {
    width: 100%;
    border-radius: 8px;

    border: 1px solid rgba(5, 5, 5, 0.06);
  }

  ${(props) =>
    props.padding &&
    css`
      padding: 10px 15px;
    `}
`;

const SDataDetailItem = styled.div<{ span?: number }>`
  width: 100%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  display: inline-flex;

  ${(props) =>
    props.span === 1 &&
    css`
      width: 50%;

      .data-detail-body-title {
        border-inline-start: 1px solid rgba(0, 0, 0, 0.1);
      }
    `}

  ${(props) =>
    props.span === 2 &&
    css`
      width: 100%;
    `}



  ${smLayout} {
    width: 100%;
    flex-direction: column;
  }

  .data-detail-body-title {
    min-width: 160px;

    color: rgba(0, 0, 0, 0.65);
    background-color: #f7f8fb;

    padding: 16px 24px;
    font-size: 1.45rem;

    white-space: pre-line;

    display: flex;
    align-items: flex-start;

    &.empty {
      background-color: #ffffff;
    }

    .title-point {
      display: inline-block;
      width: 5px;
      height: 5px;
      background: #ec35197c;
      border-radius: 50%;
      margin-left: 5px;
    }

    ${smLayout} {
      padding: 10px 16px 5px;
      background-color: #ffffff;
    }
  }

  .data-detail-body-contents {
    flex: 1;
    padding: 16px 24px;

    ${smLayout} {
      padding: 5px 16px 10px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
  }
`;

export const SDataDetail = styled.div`
  width: 100%;
  position: relative;

  .detail-body-container {
    background-color: #ffffff;

    padding: 15px;
    border-radius: 5px;

    overflow: hidden;

    transition: all 0.3s;

    width: 95%;
    height: 95%;

    opacity: 1;
    pointer-events: auto;
  }
`;

export const SDetailHeader = styled.div`
  width: 100%;
  min-height: 54px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: 10px;

  background-color: #f7f8fb;

  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  padding: 10px 15px;

  ${smLayout} {
    flex-wrap: wrap;
  }

  .detail-header-title-container {
    display: flex;
    align-items: center;

    color: #555555;

    .detail-title {
      font-size: 1.6rem;
      font-weight: bold;
      margin-right: 6px;

      white-space: nowrap;
    }

    .detail-subTitle {
      font-size: 1.4rem;
    }
  }

  .detail-header-btn-container {
    display: flex;
    align-items: center;
  }
`;

export default EditProgram;
