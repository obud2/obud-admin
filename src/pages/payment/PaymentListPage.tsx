import DataTableHeader from '@/components/dataTable/DataTableHeader';
import PaymentService, { ListPaymentsRequest } from '@/services/PaymentService';
import { DatePicker, Input, Select } from 'antd';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import locale from 'antd/es/date-picker/locale/ko_KR';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { useState } from 'react';
import { Place } from '@/entities/place';
import { listManagedByMePlaces } from '@/services/PlaceV2Service';
import { programService } from '@/services/ProgramService';
import { Program } from '@/entities/program';
import { MerchandiseType, PaymentStatus } from '@/entities/payment';

const dateFormat = 'YYYY-MM-DD';
const defaultStartDate = dayjs().format(dateFormat);
const defaultEndDate = dayjs().add(1, 'month').format(dateFormat);

const PaymentListPage = () => {
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<Place>();
  const [selectedProgram, setSelectedProgram] = useState<Program>();
  const [selectedMerchandiseType, setSelectedMerchandiseType] = useState<MerchandiseType>();
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus>();

  const { data: places } = usePlaces();
  const { data: programs } = usePrograms(selectedPlace?.id);

  const { data: payments, isLoading } = usePayments({
    startDate,
    endDate,
    query: searchKeyword,
    placeId: selectedPlace?.id,
    programId: selectedProgram?.id,
    merchandiseType: selectedMerchandiseType,
    status: selectedStatus,
  });

  console.log(payments, isLoading);

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  return (
    <div>
      <DataTableHeader title="결제 관리" />
      <Wrapper>
        <FilterWrapper>
          <DatePicker.RangePicker
            // disabled={isLoading}
            locale={locale}
            style={{ width: '50%' }}
            format={dateFormat}
            value={[dayjs(startDate, dateFormat), dayjs(endDate, dateFormat)]}
            onChange={(_, dateString) => {
              setStartDate(dateString[0]);
              setEndDate(dateString[1]);
            }}
          />
          <Input.Search placeholder="이름 또는 전화번호로 검색" allowClear onSearch={handleSearch} style={{ width: '40%' }} />
          <Select
            value={selectedPlace?.id}
            placeholder="장소 선택"
            onChange={(e) => setSelectedPlace(places?.find((place) => place.id === e))}
            options={places?.map((place) => ({ label: place.title, value: place.id }))}
            style={{ width: '200px' }}
          />
          <Select
            disabled={!selectedPlace}
            value={selectedProgram?.id}
            placeholder="프로그램 선택"
            onChange={(e) => setSelectedProgram(programs?.find((program) => program.id === e))}
            options={programs?.map((program) => ({ label: program.title, value: program.id }))}
            style={{ width: '200px' }}
          />
          <Select
            value={selectedMerchandiseType}
            placeholder="이용권 타입"
            onChange={(e) => setSelectedMerchandiseType(e)}
            options={[
              { label: '전체', value: '' },
              { label: '단건 결제', value: 'ONE_TIME_RESERVATION' },
              { label: '패스', value: 'PASS' },
            ]}
            style={{ width: '150px' }}
          />
          <Select
            value={selectedStatus}
            placeholder="상태"
            onChange={(e) => setSelectedStatus(e)}
            options={[
              { label: '전체', value: '' },
              { label: '결제 완료', value: 'COMPLETE' },
              { label: '결제 취소', value: 'CANCEL' },
            ]}
            style={{ width: '150px' }}
          />
        </FilterWrapper>
      </Wrapper>
    </div>
  );
};

export default PaymentListPage;

const usePayments = (filters: ListPaymentsRequest) => {
  return useQuery(['payments', filters], () => PaymentService.listPayments(filters));
};

const usePlaces = () => {
  return useQuery(['placesManagedByMe'], () => listManagedByMePlaces(), {
    select: (data) => data?.value,
  });
};

const usePrograms = (placeId?: Place['id']) => {
  return useQuery(['programsByPlace', placeId], () => programService.listPrograms({ placeId: placeId || '' }), {
    enabled: !!placeId,
  });
};

const Wrapper = styled.div`
  width: 100%;
  padding: 25px 0;
`;

const FilterWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
`;
