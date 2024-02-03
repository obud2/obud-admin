import React, { useEffect, useState } from 'react';

import { Button, Input, Select, Typography } from 'antd';
import { QqOutlined, SettingOutlined, UserAddOutlined } from '@ant-design/icons';

import { STUDIO, USER_ROLE, setCreatedAt } from '../../constants/config';

import { LIST_HEADER } from './UserListPage.option';

import UserService from '../../services/UserService';

import DataTableHeader from '../../components/dataTable/DataTableHeader';
import DataListTable from '../../components/dataTable/DataListTable';

import DataDetailBody, { DataDetailItem } from '../../components/detailTable/DataDetailBody';
import InstructorRegist from './InstructorRegist';
import swal from 'sweetalert';

/**
 *
 * @param {*} id : 상품 등록 ID 값 new
 * @returns
 */
const UserDetail = ({ open, onClose, id, refresh }) => {
  const [body, setBody] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [instructorList, setInstructorList] = useState([]);

  const [header, setHeader] = useState([]);
  const [isSns, setIsSns] = useState({ type: '', id: '' });

  const [isRegistOpen, setIsRegistOpen] = useState(false);
  const [notiMessage, setNotiMessage] = useState('');

  useEffect(() => {
    if (notiMessage) {
      setTimeout(() => {
        setNotiMessage('');
      }, [2000]);
    }
  }, [notiMessage]);

  useEffect(() => {
    const temp = [...LIST_HEADER];

    //   강사 해지 버튼 추가
    temp.push({
      id: 'id',
      label: '',
      customBodyRender: (value) => {
        return <Button onClick={() => onClickDeleteInstructor(value, body?.id)}>해지</Button>;
      },
    });
    setHeader(temp);
  }, [body]);

  useEffect(() => {
    if (id && id !== 'new') {
      setIsLoading(true);

      UserService?.getUser(id).then((res) => {
        let sns = '';

        if (res?.kakao) sns = '카카오 소셜로그인';
        else if (res?.naver) sns = '네이버 소셜로그인';
        else if (res?.google) sns = '구글 소셜로그인';
        else if (res?.apple) sns = '애플 소셜로그인';

        if (sns) {
          setIsSns({
            type: sns,
            id: res?.kakao || res?.naver || res?.google || res?.apple,
          });
        }

        setBody(res);
        setIsLoading(false);
      });
    } else {
      setBody({});
      setIsSns({
        type: '',
        id: '',
      });
    }

    return () => setBody({});
  }, [id]);

  useEffect(() => {
    if (body?.group === STUDIO) {
      getAdminStudiosInstr();
    }
  }, [body]);

  const onClickDeleteInstructor = (instructorId, studiosAdminId) => {
    swal({
      title: '',
      text: '해당 강사 권한을 해지하시겠습니가?',
      buttons: true,
      icon: 'warning',
    }).then(async (willDelete) => {
      if (willDelete) {
        const body = {
          instructorId,
          studiosAdminId,
        };

        await UserService?.deleteInstructor(body);
        getAdminStudiosInstr();
      }
    });
  };

  const getAdminStudiosInstr = () => {
    UserService?.getAdminStudiosInstructor(body?.id).then((res) => {
      setInstructorList(res?.val || []);
    });
  };

  const onChangeBody = (type, e) => {
    setBody((prev) => ({ ...prev, [type]: e }));
  };

  const onClickRegistOpen = () => {
    setIsRegistOpen(true);
  };

  const onSubmit = () => {
    setIsLoading(true);

    UserService?.setUser('edit', body)
      .then(() => {
        setNotiMessage('수정 되었습니다.');
      })
      .catch(() => {
        setNotiMessage('에러가 발생하였습니다. 잠시 후 다시시도해주세요.');
      })
      .finally(() => {
        refresh();
      });
  };

  const renderButtons = () => {
    return [
      <Button key="cancel-btn" style={{ marginRight: '5px' }} onClick={onClose}>
        취소
      </Button>,
      <Button key="add-btn" type="primary" style={{ marginRight: '5px' }} onClick={onSubmit}>
        {id === 'new' ? '등록' : '수정'}
      </Button>,
    ];
  };

  return (
    <DataDetailBody
      open={open}
      onClose={onClose}
      title={`사용자 ${id === 'new' ? '등록' : '수정'}`}
      extra={renderButtons()}
      subTitle={body?.name}
      isLoading={isLoading}
      notiMessage={notiMessage}
    >
      {/* 권한설정 */}
      <DataDetailItem span={2}>
        <Typography.Text>
          <SettingOutlined /> &nbsp; 권한 설정
        </Typography.Text>
      </DataDetailItem>

      <DataDetailItem label="권한설정" span={2}>
        <Select
          value={USER_ROLE?.filter((a) => a?.value === body?.group)[0]?.label}
          style={{ width: '100%' }}
          onChange={(e) => onChangeBody('group', e)}
          options={USER_ROLE}
          disabled={isLoading}
        />
      </DataDetailItem>

      {/* 유저 정보 */}
      <DataDetailItem span={2}>
        <Typography.Text>
          <UserAddOutlined /> &nbsp; 사용자 정보
        </Typography.Text>
      </DataDetailItem>

      <DataDetailItem label="이메일" span={2}>
        <Input
          value={body?.email}
          disabled
          style={{ width: '100%' }}
          //
        />
      </DataDetailItem>

      {isSns?.id && (
        <DataDetailItem label="SNS" span={2}>
          <Input
            value={isSns?.type || ''}
            readOnly
            style={{ width: '100%' }}
            //
          />
        </DataDetailItem>
      )}

      <DataDetailItem label="이름" span={2}>
        <Input
          value={body?.name}
          onChange={(e) => onChangeBody('name', e.target.value)}
          disabled={isLoading}
          style={{ width: '100%' }}
          //
        />
      </DataDetailItem>

      <DataDetailItem label="전화번호" span={2}>
        <Input
          value={body?.hp}
          onChange={(e) => onChangeBody('hp', e.target.value)}
          disabled={isLoading}
          style={{ width: '100%' }}
          //
        />
      </DataDetailItem>

      <DataDetailItem label="주소" span={2}>
        <Input
          value={body?.adr}
          disabled
          style={{ width: '100%' }}
          //
        />
      </DataDetailItem>

      <DataDetailItem label="상세 주소" span={2}>
        <Input value={body?.adrDetail} disabled style={{ width: '100%' }} />
      </DataDetailItem>

      <DataDetailItem label="성별" span={2}>
        <Input
          value={body?.gender}
          onChange={(e) => onChangeBody('gender', e.target.value)}
          disabled={isLoading}
          style={{ width: '100%' }}
        />
      </DataDetailItem>

      <DataDetailItem label="생년월일" span={2}>
        <Input
          type="date"
          value={body?.birthdate}
          onChange={(e) => onChangeBody('birthdate', e.target.value)}
          disabled={isLoading}
          style={{ width: '100%' }}
        />
      </DataDetailItem>

      <DataDetailItem label="가입일자" span={2}>
        <Input
          disabled
          value={setCreatedAt(body?.createdAt, '-')}
          style={{ width: '100%' }}
          //
        />
      </DataDetailItem>

      {/* 권한이 스튜디오 관리자에게만 노출 */}
      {body?.group === STUDIO && (
        <React.Fragment>
          {/* 강사관리 */}
          <DataDetailItem span={2}>
            <Typography.Text>
              <QqOutlined /> &nbsp; 강사 관리
            </Typography.Text>
          </DataDetailItem>

          <DataTableHeader
            resister={{ text: '강사추가', onClick: onClickRegistOpen }} // 스튜디오 관리자 강사 등록 폼 추가
            title="강사 목록"
            isLoading={isLoading}
          />

          <DataListTable data={instructorList || []} header={header} useDetail={false} />

          {/* 강사 등록 폼 */}
          <InstructorRegist
            isOpen={isRegistOpen}
            isClose={() => setIsRegistOpen(false)}
            studiosId={body?.id || ''}
            refresh={getAdminStudiosInstr}
          />
        </React.Fragment>
      )}
    </DataDetailBody>
  );
};

export default UserDetail;
