import DataTableHeader from '@/components/dataTable/DataTableHeader';
import { Button, DatePicker, Input, Modal, Select, Tag } from 'antd';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import locale from 'antd/es/date-picker/locale/ko_KR';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { useContext, useState } from 'react';
import { Place } from '@/entities/place';
import { listManagedByMePlaces } from '@/services/PlaceV2Service';
import { programService } from '@/services/ProgramService';
import { Program } from '@/entities/program';
import DataListTable from '@/components/dataTable/DataListTable';
import { UserContext } from '@/context/UserContext';
import ReservationService, { ListReservationsRequest } from '@/services/ReservationService';
import { Reservation, ReservationStatus } from '@/entities/reservation';

const dateFormat = 'YYYY-MM-DD';
const defaultStartDate = dayjs().subtract(1, 'day').format(dateFormat);
const defaultEndDate = dayjs().add(1, 'month').format(dateFormat);

const OrderListPage = () => {
  const { isAdmin } = useContext(UserContext);

  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<Place>();
  const [selectedProgram, setSelectedProgram] = useState<Program>();
  const [selectedStatus, setSelectedStatus] = useState<ReservationStatus>();

  const [selectedReservation, setSelectedReservation] = useState<Reservation>();
  const [openCancelModal, setOpenCancelModal] = useState(false);

  const { data: places } = usePlaces();
  const { data: programs } = usePrograms(selectedPlace?.id);
  const { data: reservations, isLoading } = useReservations({
    startDate,
    endDate,
    query: searchKeyword,
    placeId: selectedPlace?.id,
    programId: selectedProgram?.id,
    status: selectedStatus,
  });

  const handleExcelListApi = () => {
    return ReservationService.listReservationsExcelList({
      startDate,
      endDate,
      query: searchKeyword,
      placeId: selectedPlace?.id,
      programId: selectedProgram?.id,
      status: selectedStatus,
    });
  };

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  const handleCancelReservation = async () => {
    if (!selectedReservation) return;

    if (selectedReservation.payment.merchandiseType === 'PASS') {
      // 페스 예약 취소
    } else {
      // 단건 예약 취소
    }

    // await ReservationService.cancelReservation(selectedReservation.id);
    setOpenCancelModal(false);
  };

  return (
    <div>
      <DataTableHeader title="예약 내역" />
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
            detailTitle="취소"
            onClick={(reservation: Reservation) => {
              setSelectedReservation(reservation);
              setOpenCancelModal(true);
            }}
            header={HEADER}
            isLoading={isLoading}
            sorted={false}
            useDetail={isAdmin}
            excel
            excelCols={EXCEL_HEADER}
            onExcelListApi={handleExcelListApi}
          />
        </PassListWrapper>
      </Wrapper>
      <Modal
        title="취소"
        open={openCancelModal && !!selectedReservation}
        onCancel={() => setOpenCancelModal(false)}
        destroyOnClose
        footer={[
          <Button key="refund" onClick={handleCancelReservation}>
            예약 취소
          </Button>,
          <Button key="cancel" onClick={() => setOpenCancelModal(false)}>
            취소
          </Button>,
        ]}
      >
        <div>정말로 예약을 취소하시겠습니까?</div>
        <ul>
          <li>취소 후 복구가 불가합니다.</li>
          <li>환불은 결제 내역에서 처리해야 결제한 금액이 환불됩니다.</li>
        </ul>
      </Modal>
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
  { id: 'reserveAt', label: '예약일' },
  { id: 'userName', label: '이름' },
  { id: 'userPhone', label: '연락처' },
  { id: 'placeProgram', label: '장소/프로그램' },
  { id: 'scheduleStartDate', label: '수업일' },
  { id: 'payment', label: '이용수단' },
  { id: 'paymentId', label: '결제번호' },
];

const HEADER = [
  {
    id: 'status',
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
    id: 'id',
    label: '예약번호',
    customBodyRender: (_: any, data: Reservation) => {
      return <div style={{ fontSize: '10px' }}>{data.key}</div>;
    },
  },
  {
    id: 'reserveAt',
    label: '예약일',
    customBodyRender: (_: any, data: Reservation) => {
      return <div style={{ padding: '0 8px', fontSize: '11px' }}>{dayjs(data.reserveAt).format('YYYY-MM-DD HH:mm')}</div>;
    },
  },
  {
    id: 'user.name',
    label: '이름',
    customBodyRender: (_: any, data: Reservation) => {
      return <div style={{ padding: '0 8px' }}>{data?.user.name}</div>;
    },
  },
  {
    id: 'user.phone',
    label: '연락처',
    customBodyRender: (_: any, data: Reservation) => {
      return <div style={{ padding: '0 8px', fontSize: '11px' }}>{data?.user.phone}</div>;
    },
  },
  {
    id: 'place-program',
    label: '장소/프로그램',
    customBodyRender: (_: any, data: Reservation) => {
      return (
        <div style={{ padding: '8px' }}>
          <div style={{ fontSize: '11px' }}>{data?.place?.title}</div>
          <div style={{ fontSize: '8px', color: 'grey' }}>{data?.program?.title}</div>
        </div>
      );
    },
  },
  {
    id: 'schedule.startDate',
    label: '수업일',
    customBodyRender: (_: any, data: Reservation) => {
      return <div style={{ padding: '0 8px', fontSize: '11px' }}>{dayjs(data.schedule.startDate).format('YYYY-MM-DD HH:mm')}</div>;
    },
  },
  {
    id: 'payment',
    label: '이용수단',
    customBodyRender: (_: any, data: Reservation) => {
      return (
        <div style={{ padding: '0 8px' }}>
          <div>{data.payment?.merchandiseType === 'ONE_TIME_RESERVATION' ? '단건 결제' : '패스'}</div>
          <div style={{ fontSize: '9px', color: 'grey' }}>{data.payment?.key}</div>
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
