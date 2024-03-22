import DataDetailBody, { DataDetailItem } from '@/components/detailTable/DataDetailBody';
import { Place } from '@/entities/place';
import { CreateUserPassRequest, PassService } from '@/services/PassService';
import { Button, DatePicker, Select } from 'antd';
import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import swal from 'sweetalert';
import locale from 'antd/es/date-picker/locale/ko_KR';
import dayjs from 'dayjs';
import { SearchOutlined } from '@ant-design/icons';
import { User } from '@/entities/user';
import UserService from '@/services/UserService';

const dateFormat = 'YYYY-MM-DD';

const initialBody: CreateUserPassRequest = {
  passId: 0,
  userId: '',
  startDate: dayjs().format(dateFormat),
};

type Props = {
  currentPlace?: Place;
  open: boolean;
  onClose: () => void;
};

const PassRegister = ({ currentPlace, open, onClose }: Props) => {
  const queryClient = useQueryClient();
  const { data: passes } = usePassesByPlace(currentPlace?.id || '', '');

  const [isLoading, setIsLoading] = useState(false);
  const [notiMessage, setNotiMessage] = useState('');
  const [body, setBody] = useState<CreateUserPassRequest>(initialBody);
  const [users, setUsers] = useState<{ id: User['id']; name: User['name']; email: User['email']; phone: User['phone'] }[]>([]);

  const isActive = body.userId && body.passId && body.startDate;

  const onChangeInputValue = (key: keyof CreateUserPassRequest, value: CreateUserPassRequest[keyof CreateUserPassRequest]) => {
    setBody((prev) => ({ ...prev, [key]: value }));
  };

  const handleClose = () => {
    setBody(initialBody);

    onClose();
  };

  const onSubmit = () => {
    const param = body;

    if (!param?.userId) {
      emptyCheck('회원을 선택해주세요.');
      return;
    }

    if (!currentPlace?.id) {
      emptyCheck('공간을 선택해주세요.');
      return;
    }

    setIsLoading(true);

    PassService.createUserPass({
      ...param,
    })
      .then(() => {
        setNotiMessage('패스 등록 되었습니다.');
        setIsLoading(false);
        queryClient.invalidateQueries();
        handleClose();
      })
      .catch(() => {
        setNotiMessage('에러가 발생하였습니다. 잠시 후 다시 시도해주세요.');
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const emptyCheck = (text: string) => swal({ title: '', text, icon: 'warning' });

  const renderButtons = () => {
    return [
      <Button key="cancel-btn" style={{ width: '70px', marginRight: '5px' }} onClick={handleClose}>
        취소
      </Button>,
      <Button key="add-btn" type="primary" style={{ width: '70px' }} disabled={!isActive} onClick={onSubmit}>
        등록
      </Button>,
    ];
  };

  const handleSearch = (keyword: string) => {
    const keywordArr = keyword.split(',');
    if (keywordArr.length !== 2) return;

    const name = keywordArr[0].trim();
    const phone = keywordArr[1].trim();

    if (phone.length < 10) return;
    UserService.listUsersFromNameAndPhone({ name, phone }).then((res) => setUsers(res || []));
  };

  return (
    <DataDetailBody
      open={open}
      onClose={onClose}
      title={`패스 등록 (${currentPlace?.title})`}
      extra={renderButtons()}
      isLoading={isLoading}
      notiMessage={notiMessage}
    >
      <DataDetailItem label="회원 선택" span={2} point>
        <Select
          value={body.userId || '홍길동,010-1122-3344'}
          defaultActiveFirstOption={false}
          suffixIcon={<SearchOutlined />}
          showSearch
          disabled={isLoading}
          filterOption={false}
          onChange={(e) => onChangeInputValue('userId', e)}
          onSearch={handleSearch}
          options={users.map((user) => ({ label: `${user.name} (${user.email})`, value: user.id }))}
          style={{ width: '100%' }}
        />
      </DataDetailItem>
      <DataDetailItem label="시작일" span={2}>
        <DatePicker
          disabled={isLoading}
          locale={locale}
          style={{ width: '100%' }}
          format={dateFormat}
          value={dayjs(body.startDate ?? '', dateFormat)}
          onChange={(e) => onChangeInputValue('startDate', dayjs(e).format(dateFormat))}
        />
      </DataDetailItem>
      <DataDetailItem label="패스 선택" span={2}>
        <Select
          value={body.passId || '패스를 선택해주세요'}
          placeholder="장소 선택"
          onChange={(e) => onChangeInputValue('passId', e)}
          options={passes?.map((pass) => ({ label: pass.title, value: pass.id }))}
          style={{ width: '200px' }}
        />
      </DataDetailItem>
    </DataDetailBody>
  );
};

export default PassRegister;

const usePassesByPlace = (placeId: Place['id'], filter: string) => {
  return useQuery(['passesByPlace', placeId], () => PassService.listPasses({ placeId, status: filter }), {
    enabled: !!placeId,
    select: (data) => data?.value,
  });
};
