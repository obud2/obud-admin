import DataDetailBody, { DataDetailItem } from '@/components/detailTable/DataDetailBody';
import { UserPass } from '@/entities/pass';
import { Place } from '@/entities/place';
import { PassService, UpdateUserPassRequest } from '@/services/PassService';
import { Button, DatePicker } from 'antd';
import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import swal from 'sweetalert';
import locale from 'antd/es/date-picker/locale/ko_KR';
import dayjs from 'dayjs';
import styled from 'styled-components';

const dateFormat = 'YYYY-MM-DD';

const initialBody: UpdateUserPassRequest = {
  userPassId: 0,
  startDate: '',
  endDate: '',
};

type Props = {
  currentPlace?: Place;
  userPass: UserPass | null;
  open: boolean;
  onClose: () => void;
};

const UserPassDetail = ({ currentPlace, userPass, open, onClose }: Props) => {
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);
  const [notiMessage, setNotiMessage] = useState('');
  const [body, setBody] = useState<UpdateUserPassRequest>(initialBody);

  const isActive = body.startDate && body.endDate;

  useEffect(() => {
    if (userPass) {
      setBody({
        userPassId: userPass.id,
        startDate: userPass.startDate,
        endDate: userPass.endDate,
      });
    }
  }, [userPass]);

  const onChangeInputValue = (key: keyof UserPass, value: UserPass[keyof UserPass]) => {
    setBody((prev) => ({ ...prev, [key]: value }));
  };

  const handleClose = () => {
    setBody(initialBody);
    onClose();
  };

  const handleRevoke = () => {
    swal({
      title: '',
      text: '회원과 패스 관련 환불절차를 이행 후 해지 신청을 해주세요.\n패스 해지 시  되돌릴 수 없습니다. 진행하시겠습니까?\n해당 패스로 예약한 클래스들은 자동으로 취소됩니다.',
      buttons: ['취소', '해지'],
    }).then((confirm) => {
      if (confirm && userPass?.id) {
        setIsLoading(true);
        PassService.cancelUserPass({ userPassId: userPass.id })
          .then(() => {
            setNotiMessage('해지 되었습니다.');
            setIsLoading(false);
            queryClient.invalidateQueries();
            handleClose();
          })
          .catch(() => {
            setNotiMessage('에러가 발생하였습니다. 잠시 후 다시시도해주세요.');
            setIsLoading(false);
          });
      }
    });
  };

  const onSubmit = () => {
    const param = body;

    if (!param?.startDate) {
      emptyCheck('시작일을 선택해주세요.');
      return;
    }

    if (!param?.endDate) {
      emptyCheck('종료일을 선택해주세요.');
      return;
    }

    setIsLoading(true);
    if (userPass) {
      PassService.updateUserPass(param)
        .then(() => {
          setNotiMessage('수정 되었습니다.');
          setIsLoading(false);
          queryClient.invalidateQueries();
          handleClose();
        })
        .catch(() => {
          setNotiMessage('에러가 발생하였습니다. 잠시 후 다시시도해주세요.');
          setIsLoading(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const emptyCheck = (text: string) => swal({ title: '', text, icon: 'warning' });

  const renderButtons = () => {
    return [
      <Button key="cancel-btn" style={{ width: '70px', marginRight: '5px' }} onClick={handleClose}>
        취소
      </Button>,
      <Button key="revoke-btn" style={{ width: '70px', marginRight: '5px' }} onClick={handleRevoke}>
        해지
      </Button>,
      <Button key="add-btn" type="primary" style={{ width: '70px' }} disabled={!isActive} onClick={onSubmit}>
        수정
      </Button>,
    ];
  };

  return (
    <DataDetailBody
      open={open}
      onClose={onClose}
      title={`패스 수정 (${currentPlace?.title})`}
      extra={renderButtons()}
      isLoading={isLoading}
      notiMessage={notiMessage}
    >
      <Title>회원 정보</Title>
      <DataDetailItem label="이름" span={2} point>
        <Detail>{userPass?.user?.name}</Detail>
      </DataDetailItem>
      <DataDetailItem label="연락처" span={2} point>
        <Detail>{userPass?.user?.phone}</Detail>
      </DataDetailItem>

      <Title>패스 정보</Title>
      <PassInfo>
        {userPass?.pass.title} - {userPass?.pass.durationInDays}일
      </PassInfo>
      <DataDetailItem label="시작일" span={2} point>
        <DatePicker
          disabled={isLoading}
          locale={locale}
          style={{ width: '100%' }}
          format={dateFormat}
          value={dayjs(body.startDate ?? '', dateFormat)}
          onChange={(e) => onChangeInputValue('startDate', dayjs(e).format(dateFormat))}
        />
      </DataDetailItem>
      <DataDetailItem label="종료일" span={2} point>
        <DatePicker
          disabled={isLoading}
          locale={locale}
          style={{ width: '100%' }}
          format={dateFormat}
          value={dayjs(body.endDate ?? '', dateFormat)}
          onChange={(e) => onChangeInputValue('endDate', dayjs(e).format(dateFormat))}
        />
      </DataDetailItem>
      <PassDetail>
        에약횟수 / 예약가능횟수: {userPass?.totalReservations} / {userPass?.pass.maxReservations}
      </PassDetail>
      <PassDetail>
        취소횟수 / 취소가능횟수: {userPass?.totalCancels} / {userPass?.pass.maxCancels}
      </PassDetail>
    </DataDetailBody>
  );
};

export default UserPassDetail;

const Title = styled.div`
  font-size: 16px;
  font-weight: bold;
  padding: 12px;
`;

const Detail = styled.div`
  font-size: 14px;
`;

const PassInfo = styled.div`
  font-size: 14px;
  padding: 12px;
  border-top: 1px solid #f0f0f0;
  margin: 0 0 12px 0;
`;

const PassDetail = styled.div`
  padding: 8px 12px;
  color: grey;
`;
