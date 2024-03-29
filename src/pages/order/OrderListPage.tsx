import DataTableHeader from '@/components/dataTable/DataTableHeader';
import { DatePicker, Form, Input, Select, Tag } from 'antd';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { useContext, useState } from 'react';
import { Place } from '@/entities/place';
import { listManagedByMePlaces } from '@/services/PlaceV2Service';
import { programService } from '@/services/ProgramService';
import { Program } from '@/entities/program';
import DataListTable from '@/components/dataTable/DataListTable';
import ReservationService, { ListReservationsRequest } from '@/services/ReservationService';
import { Reservation, ReservationStatus } from '@/entities/reservation';
import OrderCancelModal from './OrderCancelModal';
import { UserContext } from '@/context/UserContext';

const dateFormat = 'YYYY-MM-DD';
const defaultStartDate = dayjs().subtract(1, 'day').format(dateFormat);
const defaultEndDate = dayjs().add(3, 'month').format(dateFormat);

const OrderListPage = () => {
  const { isAdmin } = useContext(UserContext);

  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedPlaceId, setSelectedPlaceId] = useState<Place['id'] | ''>('');
  const [selectedProgramId, setSelectedProgramId] = useState<Program['id'] | ''>('');
  const [selectedStatus, setSelectedStatus] = useState<ReservationStatus>();

  const [selectedReservation, setSelectedReservation] = useState<Reservation>();
  const [openCancelModal, setOpenCancelModal] = useState(false);

  const { data: places } = usePlaces();
  const { data: programs } = usePrograms(selectedPlaceId || undefined);
  const { data: reservations, isLoading } = useReservations({
    startDate,
    endDate,
    query: searchKeyword,
    placeId: selectedPlaceId || undefined,
    programId: selectedProgramId || undefined,
    status: selectedStatus,
  });

  const handleExcelListApi = () => {
    return ReservationService.listReservationsExcelList({
      startDate,
      endDate,
      query: searchKeyword,
      placeId: selectedPlaceId || undefined,
      programId: selectedProgramId || undefined,
      status: selectedStatus,
    });
  };

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  const handleHideCancelButton = (reservation: Reservation): boolean => {
    if (reservation.status === 'CANCELLED') return true;

    // 전체 관리자인 경우에는 취소 상태만 아니면 무조건 보여주어야 한다.
    if (isAdmin) return false;

    if (dayjs(reservation.schedule.startDate).isBefore(dayjs())) return true;

    return false;
  };

  return (
    <div>
      <DataTableHeader title="예약내역" />
      <Wrapper>
        <FilterWrapper>
          <Form.Item label="이용일자" style={{ maxHeight: '32px', height: '32px', margin: '0px' }}></Form.Item>
          <DatePicker.RangePicker
            style={{ width: '45%', height: '32px' }}
            disabled={isLoading}
            format={dateFormat}
            value={[dayjs(startDate, dateFormat), dayjs(endDate, dateFormat)]}
            onChange={(_, dateString) => {
              setStartDate(dateString[0]);
              setEndDate(dateString[1]);
            }}
            allowClear={false}
          />
          <Input.Search placeholder="이름 또는 전화번호로 검색" allowClear onSearch={handleSearch} style={{ width: '40%' }} />
          <Select
            value={selectedPlaceId}
            placeholder="장소 선택"
            onChange={(e) => setSelectedPlaceId(places?.find((place) => place.id === e)?.id ?? '')}
            options={[
              { label: '전체', value: '' },
              ...(places?.sort((a, b) => a.title.localeCompare(b.title)).map((place) => ({ label: place.title, value: place.id })) ?? []),
            ]}
            style={{ width: '200px' }}
          />
          <Select
            disabled={!selectedPlaceId}
            value={selectedProgramId}
            placeholder="프로그램 선택"
            onChange={(e) => setSelectedProgramId(programs?.find((program) => program.id === e)?.id ?? '')}
            options={[
              { label: '전체', value: '' },
              ...(programs
                ?.sort((a, b) => a.title.localeCompare(b.title))
                .map((program) => ({ label: program.title, value: program.id })) ?? []),
            ]}
            style={{ width: '200px' }}
          />
          <Select
            value={selectedStatus}
            placeholder="상태"
            onChange={(e) => setSelectedStatus(e)}
            options={[
              { label: '전체', value: '' },
              { label: '예정', value: 'UPCOMING' },
              { label: '확정', value: 'COMPLETED' },
              { label: '취소', value: 'CANCELLED' },
            ]}
            style={{ width: '150px' }}
          />
        </FilterWrapper>

        <PassListWrapper>
          <DataListTable
            data={reservations || []}
            hideDetail={handleHideCancelButton}
            detailTitle="취소"
            onClick={(reservation: Reservation) => {
              setSelectedReservation(reservation);
              setOpenCancelModal(true);
            }}
            header={HEADER}
            isLoading={isLoading}
            sorted={false}
            useDetail
            excel
            excelCols={EXCEL_HEADER}
            onExcelListApi={handleExcelListApi}
          />
        </PassListWrapper>
      </Wrapper>
      <OrderCancelModal open={openCancelModal} reservation={selectedReservation} onClose={() => setOpenCancelModal(false)} />
    </div>
  );
};

export default OrderListPage;

const useReservations = (filters: ListReservationsRequest) => {
  return useQuery(['reservations', filters], () => ReservationService.listReservations(filters));
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

const EXCEL_HEADER = [
  { id: 'status', label: '상태' },
  { id: 'id', label: '예약번호' },
  { id: 'reserveAt', label: '예약일자' },
  { id: 'userName', label: '예약자명' },
  { id: 'userPhone', label: '연락처' },
  { id: 'scheduleStartDate', label: '이용일시' },
  { id: 'program', label: '프로그램' },
  { id: 'place', label: '장소' },
  { id: 'payment', label: '이용수단' },
  { id: 'paymentId', label: '결제번호' },
  { id: 'totalAmount', label: '판매금액' },
  { id: 'payAmount', label: '결제금액' },
];

const HEADER = [
  {
    id: 'status',
    flex: 0.3,
    label: '상태',
    customBodyRender: (_: any, data: Reservation) => {
      if (data.status === 'COMPLETED') {
        return <Tag color="green">확정</Tag>;
      }

      if (data.status === 'CANCELLED') {
        return <Tag color="red">취소</Tag>;
      }

      if (data.status === 'UPCOMING') {
        return <Tag color="blue">예정</Tag>;
      }

      return <div>-</div>;
    },
  },
  {
    id: 'id-reserveAt',
    label: '예약번호/예약일자',
    flex: 0.7,
    customBodyRender: (_: any, data: Reservation) => {
      return (
        <div>
          <div style={{ fontSize: '10px' }}>{data?.key}</div>
          <div style={{ fontSize: '8px', color: 'grey' }}>{dayjs(data.reserveAt).format('YYYY-MM-DD HH:mm')}</div>
        </div>
      );
    },
  },
  {
    id: 'schedule.startDate',
    label: '이용일시',
    flex: 0.7,
    customBodyRender: (_: any, data: Reservation) => {
      return <div style={{ fontSize: '1.2rem' }}>{dayjs(data.schedule.startDate).locale('ko').format('YYYY-MM-DD (ddd) HH:mm')}</div>;
    },
  },
  {
    id: 'user.name',
    label: '예약자명',
    flex: 0.5,
    customBodyRender: (_: any, data: Reservation) => {
      return (
        <div>
          <div>{data?.user.name}</div>
          <div style={{ fontSize: '1rem' }}>{data?.user.phone}</div>
        </div>
      );
    },
  },

  {
    id: 'program-place',
    label: '프로그램/장소',
    customBodyRender: (_: any, data: Reservation) => {
      return (
        <div>
          <div style={{ fontSize: '1.2rem' }}>{data?.program?.title}</div>
          <div style={{ fontSize: '9px', color: 'grey' }}>{data?.place?.title}</div>
        </div>
      );
    },
  },
  {
    id: 'payment',
    label: '이용수단',
    customBodyRender: (_: any, data: Reservation) => {
      return (
        <div>
          <div style={{ fontSize: '1.2rem' }}>{data.payment?.merchandiseType === 'ONE_TIME_RESERVATION' ? '단건 결제' : '패스'}</div>
          <div style={{ fontSize: '9px', color: 'grey' }}>{data.payment?.key}</div>
          {data.payment?.merchandiseType === 'ONE_TIME_RESERVATION' && (
            <div style={{ fontSize: '9px', color: 'grey' }}>
              판매금액:{data.payment?.totalAmount?.toLocaleString()} 결제금액:{data.payment?.payAmount?.toLocaleString()}
            </div>
          )}
        </div>
      );
    },
  },
];

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

const PassListWrapper = styled.div`
  padding: 0;
  background: white;
  margin-top: 20px;
  border-radius: 10px;
`;
