import DataTableHeader from '@/components/dataTable/DataTableHeader';
import { Pass } from '@/entities/pass';
import { Place } from '@/entities/place';
import { PassService } from '@/services/PassService';
import { listManagedByMePlaces } from '@/services/PlaceV2Service';
import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { ReactSortable } from 'react-sortablejs';
import styled from 'styled-components';
import PassItem from './PassItem';
import PassDetail from './detail/PassDetail';

const PassListPage = () => {
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
    setSortedPasses(passes || []);
  }, passes);

  const setList = (e: Pass[]) => {
    setSortedPasses(e);
  };

  const onDetail = (item: Pass | null) => {
    setPass(item);
    setOpen(true);
  };

  return (
    <div>
      <DataTableHeader
        title="패스 목록"
        searchDisabled
        doSearch={() => null}
        register={{ text: '패스 등록', onClick: () => onDetail(null) }}
      />

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
        </FilterWrapper>
        <PassListWrapper>
          <ReactSortable
            className="product-shell-list-container"
            list={sortedPasses}
            setList={setList}
            animation={200}
            delayOnTouchStart
            delay={1}
            handle=".product-shell-item-drag-button"
          >
            {sortedPasses.length > 0 ? (
              sortedPasses.map((pass) => <PassItem key={pass.id} pass={pass} />)
            ) : (
              <div className="empty-list">등록된 패스가 존재하지 않습니다.</div>
            )}
          </ReactSortable>
        </PassListWrapper>
        <PassDetail currentPlace={selectedPlace} open={open} pass={pass} onClose={() => setOpen(false)} />
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
  return useQuery(['passesByPlace', placeId], () => PassService.listPasses({ placeId, status: filter }), {
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
