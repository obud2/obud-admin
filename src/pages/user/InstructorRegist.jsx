import React, { useState } from 'react';

import { Button, Descriptions, Input } from 'antd';

import { SInstructorRegist } from './InstructorRegist.styled';

import swal from 'sweetalert';

import SubMain from '../../sub-main';
import UserService from '../../services/UserService';

const InstructorRegist = ({ isOpen, isClose, studiosId, refresh }) => {
  const [body, setBody] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const onChangeInputBody = (e) => {
    const { name, value } = e.target;

    setBody((prev) => ({ ...prev, [name]: value }));
  };

  const onClickSubmit = () => {
    if (isLoading) return;
    if (!studiosId) return;

    setIsLoading(true);

    const param = {
      email: body?.email || '',
      name: body?.name || '',
      studiosAdminId: studiosId,
    };

    UserService.setInstructor(param)
      .then((res) => {
        if (res?.status === 200) {
          swal({ title: '', text: '등록이 완료되었습니다.' });
        } else {
          swal({ title: '', text: changeMessege(res?.message) || '에러가 발생하였습니다. 잠시 후 다시시도해주세요.', icon: 'warning' });
        }
      })
      .catch((error) => {
        swal({ title: '', text: error });
      })
      .finally(() => {
        setBody({});
        setIsLoading(false);

        if (refresh) refresh();
        isClose();
      });
  };

  const changeMessege = (text) => {
    let temp = '';

    if (text === "Cannot read properties of null (reading 'id')") {
      temp = '이름 또는 이메일을 확인해주세요.';
    } else {
      temp = text;
    }

    return temp;
  };

  return (
    <SubMain>
      <SInstructorRegist isOpen={isOpen}>
        <div className="instructor-regist-background" />

        <div className="instructor-regist-container">
          <div className="instructor-regist-header">
            <p className="instructor-regist-title">강사 등록</p>

            <button className="instructor-regist-close" onClick={isClose} />
          </div>

          <div className="instructor-regist-contents">
            <Descriptions bordered column={2}>
              <Descriptions.Item label="이름" span={2}>
                <Input name="name" value={body?.name} onChange={onChangeInputBody} disabled={isLoading} />
              </Descriptions.Item>

              <Descriptions.Item label="이메일" span={2}>
                <Input name="email" value={body?.email} onChange={onChangeInputBody} disabled={isLoading} />
              </Descriptions.Item>
            </Descriptions>
          </div>

          <div className="instructor-regist-footer">
            <Button onClick={isClose}>취소</Button>

            <Button type="primary" onClick={onClickSubmit}>
              등록
            </Button>
          </div>
        </div>
      </SInstructorRegist>
    </SubMain>
  );
};

export default InstructorRegist;
