import DataTableHeader from '@/components/dataTable/DataTableHeader';
import { Place } from '@/entities/place';
import { PassService } from '@/services/PassService';
import { listManagedByMePlaces } from '@/services/PlaceV2Service';
import { Select, Tag } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import PassRegister from './register/PassRegister';
import DataListTable from '@/components/dataTable/DataListTable';
import { UserPass } from '@/entities/pass';
import dayjs from 'dayjs';
import { UserContext } from '@/context/UserContext';
import UserPassDetail from './detail/UserPassDetail';

const PassManagePage = () => {
  const { isAdmin } = useContext(UserContext);

  const [selectedPlace, setSelectedPlace] = useState<Place>();
  const [selectedFilter, setSelectedFilter] = useState<'IN_USE' | 'EXPIRED' | 'CANCELLED'>('IN_USE');
  const [openRegister, setOpenRegister] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [currentUserPass, setCurrentUserPass] = useState<UserPass | null>(null);

  const { data: places } = usePlacesManagedByMe();
  const { data: userPasses } = useUserPasses(selectedPlace?.id || '', selectedFilter);

  const handleDetail = (userPass: UserPass) => {
    setOpenDetail(true);
    setCurrentUserPass(userPass);
  };

  useEffect(() => {
    if (places?.[0]) {
      setSelectedPlace(places[0]);
    }
  }, [places]);

  const onExcelListApi = () => {
    return PassService.listUserPassesExcelList({ placeId: selectedPlace?.id || '', status: selectedFilter });
  };

  return (
    <div>
      <DataTableHeader title="패스 회원 관리" searchDisabled register={{ text: '회원 등록', onClick: () => setOpenRegister(true) }} />

      <Wrapper>
        <FilterWrapper>
          <Select
            value={selectedPlace?.id}
            placeholder="장소 선택"
            onChange={(e) => setSelectedPlace(places?.find((place) => place.id === e))}
            options={places?.map((place) => ({ label: place.title, value: place.id }))}
            style={{ width: '200px' }}
          />
          <Select
            value={selectedFilter}
            placeholder="타입 선택"
            onChange={(e) => setSelectedFilter(e)}
            options={[
              { label: '사용중', value: 'IN_USE' },
              { label: '만료', value: 'EXPIRED' },
              { label: '취소', value: 'CANCELLED' },
            ]}
            style={{ width: '100px' }}
          />
        </FilterWrapper>

        <PassListWrapper>
          <DataListTable
            data={userPasses || []}
            header={HEADER}
            onClick={handleDetail}
            isLoading={false}
            sorted={false}
            useDetail={isAdmin}
            excel
            excelCols={EXCEL_HEADER}
            onExcelListApi={onExcelListApi}
          />
        </PassListWrapper>
        <PassRegister currentPlace={selectedPlace} open={openRegister} onClose={() => setOpenRegister(false)} />
        <UserPassDetail currentPlace={selectedPlace} userPass={currentUserPass} open={openDetail} onClose={() => setOpenDetail(false)} />
      </Wrapper>
    </div>
  );
};

export default PassManagePage;

const usePlacesManagedByMe = () => {
  return useQuery('placesManagedByMe', () => listManagedByMePlaces(), {
    select: (data) => data?.value,
  });
};

const useUserPasses = (placeId: Place['id'], status: 'IN_USE' | 'EXPIRED' | 'CANCELLED') => {
  return useQuery(['listUserPasses', placeId, status], () => PassService.listUserPasses({ placeId, status }), {
    enabled: !!placeId,
    select: (data) => data?.value,
  });
};

const EXCEL_HEADER = [
  { id: 'createdAt', label: '결제일' },
  { id: 'userName', label: '이름' },
  { id: 'userPhone', label: '연락처' },
  { id: 'placeTitle', label: '장소' },
  { id: 'pass', label: '패스' },
  { id: 'startDate', label: '시작일' },
  { id: 'endDate', label: '종료일' },
  { id: 'status', label: '상태' },
];

const HEADER = [
  { id: 'createdAt', label: '결제일' },
  {
    id: 'user.name',
    label: '이름',
    customBodyRender: (_: any, data: UserPass) => {
      return <div>{data?.user.name}</div>;
    },
  },
  {
    id: 'user.phone',
    label: '연락처',
    customBodyRender: (_: any, data: UserPass) => {
      return <div>{data?.user.phone}</div>;
    },
  },
  {
    id: 'place',
    label: '장소',
    customBodyRender: (_: any, data: UserPass) => {
      return <div>{data?.place.title}</div>;
    },
  },
  {
    id: 'pass',
    label: '패스',
    customBodyRender: (_: any, data: UserPass) => {
      return (
        <div>
          {data?.pass?.title}({data?.pass.durationInDays}일)
        </div>
      );
    },
  },
  {
    id: 'startDate',
    label: '시작일',
    customBodyRender: (_: any, data: UserPass) => {
      return <div>{data?.startDate}</div>;
    },
  },
  {
    id: 'endDate',
    label: '종료일',
    customBodyRender: (_: any, data: UserPass) => {
      return <div>{data?.endDate}</div>;
    },
  },
  {
    id: 'status',
    label: '상태',
    customBodyRender: (_: any, data: UserPass) => {
      const dDay = dayjs(data?.endDate).diff(dayjs(), 'day');
      return <Tag>{dDay < 0 ? '만료' : `D-${dDay}`}</Tag>;
    },
  },
];
const Wrapper = styled.div`
  width: 100%;
  padding: 25px 0;
`;

const FilterWrapper = styled.div`
  display: flex;
  gap: 10px;
`;

const PassListWrapper = styled.div`
  padding: 0;
  background: white;
  margin-top: 20px;
  border-radius: 10px;
`;
