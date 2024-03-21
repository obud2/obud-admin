import DataTableHeader from '@/components/dataTable/DataTableHeader';
import { Pass } from '@/entities/pass';
import { Place } from '@/entities/place';
import { PassService } from '@/services/PassService';
import { listManagedByMePlaces } from '@/services/PlaceV2Service';
import { Button, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { ReactSortable } from 'react-sortablejs';
import styled from 'styled-components';
import PassItem from './PassItem';
import PassDetail from './detail/PassDetail';
import swal from 'sweetalert';
import FloatingBtn from '@/components/common/floatingBtn/FloatingBtn';
import { smLayout } from '@/styles/VariablesStyles';

const PassListPage = () => {
  const queryClient = useQueryClient();
  const [selectedPlace, setSelectedPlace] = useState<Place>();
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  const { data: places } = usePlacesManagedByMe();
  const { data: passes } = usePassesByPlace(selectedPlace?.id || '', selectedFilter);

  const [sortedPasses, setSortedPasses] = useState<Pass[]>([]);

  const [open, setOpen] = useState(false);
  const [pass, setPass] = useState<Pass | null>(null);

  useEffect(() => {
    if (places?.[0]) {
      setSelectedPlace(places[0]);
    }
  }, [places]);

  useEffect(() => {
    if (passes) {
      setSortedPasses(passes);
    }
  }, [passes]);

  const setList = (e: Pass[]) => {
    setSortedPasses(e);
  };

  const updatePassOrder = () => {
    PassService.updatePassOrder({
      placeId: selectedPlace?.id || '',
      passOrders: sortedPasses.map((pass, index) => ({ id: pass.id, order: index + 1 })),
    })
      .then(() => {
        swal('패스 순서가 변경되었습니다.');
        queryClient.invalidateQueries(['passesByPlace', selectedPlace?.id]);
      })
      .catch(() => {
        swal('패스 순서 변경에 실패하였습니다.');
      });
  };

  const onDetail = (item: Pass | null) => {
    setPass(item);
    setOpen(true);
  };

  return (
    <div>
      <DataTableHeader title="패스 목록" searchDisabled />
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
              { label: '전체', value: '' },
              { label: '사용중', value: 'ACTIVE' },
            ]}
            style={{ width: '100px' }}
          />
          <Button onClick={updatePassOrder}>순서 저장</Button>
        </FilterWrapper>
        <PassListWrapper>
          <ReactSortable
            className="list-container"
            list={sortedPasses}
            setList={setList}
            animation={200}
            delayOnTouchStart
            delay={1}
            handle=".item-drag-button"
          >
            {sortedPasses.length > 0 ? (
              sortedPasses.map((pass) => <PassItem key={pass.id} pass={pass} onDetail={onDetail} />)
            ) : (
              <div className="empty-list">등록된 패스가 존재하지 않습니다.</div>
            )}
          </ReactSortable>
        </PassListWrapper>
        <PassDetail currentPlace={selectedPlace} open={open} pass={pass} onClose={() => setOpen(false)} />
        <FloatingBtn onClick={() => onDetail(null)} />
      </Wrapper>
    </div>
  );
};

export default PassListPage;

const usePlacesManagedByMe = () => {
  return useQuery('placesManagedByMe', () => listManagedByMePlaces(), {
    select: (data) => data?.value,
  });
};

const usePassesByPlace = (placeId: Place['id'], filter: string) => {
  return useQuery(['passesByPlace', { placeId, filter }], () => PassService.listPasses({ placeId, status: filter }), {
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
  min-height: 80vh;
  background: white;
  margin-top: 20px;
  border-radius: 10px;

  .empty-list {
    text-align: center;
    font-size: 1.3rem;
    color: #555555;
  }

  .list-container {
    margin-top: 24px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;

    color: rgba(0, 0, 0, 0.87);

    ${smLayout} {
      grid-template-columns: repeat(2, 1fr);
    }

    background-color: #ffffff;

    .empty-list-item {
      text-align: center;
      font-size: 1.3rem;

      color: #555555;
      padding: 30px 0;
    }
  }

  .item-drag-button {
    display: flex;
    align-items: center;
    justify-content: center;

    position: absolute;
    transform: translateY(-50%);
    right: 5px;
    top: 20px;
    transition: opacity 0.3s;

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;
