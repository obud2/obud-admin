import React, { useEffect, useRef, useState } from 'react';

import { Typography } from 'antd';
import { Flex } from '../../styles/CommonStyles';

import DataTableHeader from '../../components/dataTable/DataTableHeader';

import Editor from '../../components/smartEditor/Editor';

import { SDataDetailBody } from '../../components/detailTable/DataDetailBody.styled';

import InfoService from '../../services/InfoService';

const SettingPolicyPage = () => {
  const termsRef = useRef('');
  const personalyRef = useRef('');

  const [body, setBody] = useState({ terms: '', privacyPolicy: '' });

  const [isLoading, setIsLoading] = useState(true);
  const [notiMessage, setNotiMessage] = useState('');

  useEffect(() => {
    if (notiMessage) {
      setTimeout(() => {
        setNotiMessage('');
      }, [2000]);
    }
  }, [notiMessage]);

  useEffect(() => {
    setIsLoading(true);
    InfoService.info('policy').then(async (res) => {
      const terms = res?.terms;
      const privacyPolicy = res?.privacyPolicy;

      await setBody({ terms, privacyPolicy });
      await setIsLoading(false);
    });
  }, []);

  const onClickSubmit = () => {
    setIsLoading(true);

    const terms = termsRef.current.getValue();
    const personal = personalyRef.current.getValue();

    const param = {
      id: 'policy',
      terms: terms,
      privacyPolicy: personal,
    };

    InfoService.saveItem('edit', param)
      .then(() => {
        setNotiMessage('수정 되었습니다.');
      })
      .catch(() => {
        setNotiMessage('에러가 발생하였습니다. 잠시 후 다시시도해주세요.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <React.Fragment>
      <DataTableHeader
        title="약관관리"
        resister={{ text: '저장', onClick: onClickSubmit }}
        isLoading={isLoading}
        notiMessage={notiMessage}
      />

      <SDataDetailBody padding>
        <Flex gap="10px" flexDirection="column">
          <Flex gap="5px" flexDirection="column" flex="1">
            <Typography.Title level={5}>이용약관</Typography.Title>
            <Editor ref={termsRef} value={body?.terms || ''} disabled={isLoading} />
          </Flex>

          <Flex gap="5px" flexDirection="column" flex="1">
            <Typography.Title level={5}>개인정보처리방침</Typography.Title>
            <Editor ref={personalyRef} value={body?.privacyPolicy || ''} disabled={isLoading} />
          </Flex>
        </Flex>
      </SDataDetailBody>
    </React.Fragment>
  );
};

export default SettingPolicyPage;
