import DataTableHeader from '@/components/dataTable/DataTableHeader';
import { Place } from '@/entities/place';
import { PassService } from '@/services/PassService';
import { listManagedByMePlaces } from '@/services/PlaceV2Service';
import { Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';
import PassRegister from './register/PassRegister';

const PassManagePage = () => {
  const queryClient = useQueryClient();
  const [selectedPlace, setSelectedPlace] = useState<Place>();
  const [selectedFilter, setSelectedFilter] = useState<'IN_USE' | 'EXPIRED' | 'CANCELLED'>('IN_USE');
  const [openRegister, setOpenRegister] = useState(false);

  const { data: places } = usePlacesManagedByMe();
  const { data: userPasses } = useUserPasses(selectedPlace?.id || '', selectedFilter);

  console.log('userPasses', userPasses);

  useEffect(() => {
    if (places?.[0]) {
      setSelectedPlace(places[0]);
    }
  }, [places]);

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
          {/* <DataListTable data={userPasses || []} header={[]} onClick={() => console.log('HEY')} useDetail={false} /> */}
        </PassListWrapper>
        <PassRegister currentPlace={selectedPlace} open={openRegister} onClose={() => setOpenRegister(false)} />
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

const Wrapper = styled.div`
  width: 100%;
  padding: 25px 0;
`;

const FilterWrapper = styled.div`
  display: flex;
  gap: 10px;
`;

const PassListWrapper = styled.div`
  padding: 25px;
  background: white;
  margin-top: 20px;
  border-radius: 10px;
`;
