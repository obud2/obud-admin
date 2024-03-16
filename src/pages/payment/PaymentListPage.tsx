import DataTableHeader from '@/components/dataTable/DataTableHeader';
import PaymentService, { ListPaymentsRequest } from '@/services/PaymentService';
import { DatePicker, Input, Select, Tag } from 'antd';
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
import { MerchandiseType, Payment, PaymentStatus } from '@/entities/payment';
import DataListTable from '@/components/dataTable/DataListTable';
import { UserContext } from '@/context/UserContext';
import PaymentRefundModal from './PaymentRefundModal';

const dateFormat = 'YYYY-MM-DD';
const defaultStartDate = dayjs().subtract(1, 'day').format(dateFormat);
const defaultEndDate = dayjs().add(1, 'month').format(dateFormat);

const PaymentListPage = () => {
  const { isAdmin } = useContext(UserContext);

  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<Place>();
  const [selectedProgram, setSelectedProgram] = useState<Program>();
  const [selectedMerchandiseType, setSelectedMerchandiseType] = useState<MerchandiseType>();
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus>();

  const [openRefundModal, setOpenRefundModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment>();

  const { data: places } = usePlaces();
  const { data: programs } = usePrograms(selectedPlace?.id);
  const { data: payments, isLoading } = usePayments({
    startDate,
    endDate,
    query: searchKeyword,
    placeId: selectedPlace?.id,
    programId: selectedProgram?.id,
    merchandiseType: selectedMerchandiseType,
    paymentStatus: selectedStatus,
  });

  console.log('payments', payments);

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  const handleExcelListApi = () => {
    return PaymentService.listPaymentsExcelListRequest({
      startDate,
      endDate,
      query: searchKeyword,
      placeId: selectedPlace?.id,
      programId: selectedProgram?.id,
      merchandiseType: selectedMerchandiseType,
      paymentStatus: selectedStatus,
    });
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

        <PassListWrapper>
          <DataListTable
            data={payments || []}
            detailTitle="환불"
            onClick={(payment: Payment) => {
              setSelectedPayment(payment);
              setOpenRefundModal(true);
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
      <PaymentRefundModal open={openRefundModal} onClose={() => setOpenRefundModal(false)} payment={selectedPayment} />
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

const EXCEL_HEADER = [
  { id: 'status', label: '상태' },
  { id: 'key', label: '결제번호' },
  { id: 'payAt', label: '결제일' },
  { id: 'userName', label: '이름' },
  { id: 'userPhone', label: '연락처' },
  { id: 'merchandiseType', label: '이용권 타입' },
  { id: 'passProgram', label: '결제상품' },
  { id: 'place', label: '장소' },
  { id: 'totalAmount', label: '판매금액' },
  { id: 'discountAmount', label: '할인금액' },
  { id: 'payAmount', label: '결제금액' },
  { id: 'cancelAmount', label: '환불금액' },
];

const HEADER = [
  {
    id: 'status',
    label: '상태',
    flex: 0.6,
    customBodyRender: (_: any, data: Payment) => {
      if (data.status === 'COMPLETE') {
        return <Tag color="green">결제 완료</Tag>;
      }

      if (data.status === 'CANCEL') {
        return <Tag color="red">환불 완료</Tag>;
      }

      return <div>-</div>;
    },
  },
  {
    id: 'keyPayAt',
    label: '결제번호/결제일',
    flex: 0.8,
    customBodyRender: (_: any, data: Payment) => {
      return (
        <div>
          <div style={{ fontSize: '11px' }}>{data.key}</div>
          <div style={{ fontSize: '9px', color: 'grey' }}>{dayjs(data.payAt).format('YYYY-MM-DD HH:mm')}</div>
        </div>
      );
    },
  },
  {
    id: 'user.name',
    label: '이름',
    flex: 0.5,
    customBodyRender: (_: any, data: Payment) => {
      return <div>{data?.user.name}</div>;
    },
  },
  {
    id: 'user.phone',
    label: '연락처',
    flex: 0.8,
    customBodyRender: (_: any, data: Payment) => {
      return <div>{data?.user.phone}</div>;
    },
  },
  {
    id: 'merchandiseType',
    label: '이용권 타입',
    flex: 0.6,
    customBodyRender: (_: any, data: Payment) => {
      if (data.merchandiseType === 'ONE_TIME_RESERVATION') {
        return <Tag color="blue">단건 결제</Tag>;
      }

      if (data.merchandiseType === 'PASS') {
        return <Tag color="purple">패스</Tag>;
      }
    },
  },

  {
    id: 'pass-program-place', // pass 결제 시 패스명, 단건 결제 시 프로그램명 표시
    label: '결제상품/장소',
    flex: 1.2,
    customBodyRender: (_: any, data: Payment) => {
      if (data.merchandiseType === 'ONE_TIME_RESERVATION') {
        return (
          <div>
            <div>{data?.program?.title}</div>
            <div style={{ fontSize: '11px', color: 'grey' }}>{data?.place?.title}</div>
          </div>
        );
      }

      if (data.merchandiseType === 'PASS') {
        return (
          <div>
            <div>{data?.pass?.title}</div>
            <div style={{ fontSize: '11px', color: 'grey' }}>{data?.place?.title}</div>
          </div>
        );
      }
    },
  },

  {
    id: 'payAmount',
    label: '결제금액',
    customBodyRender: (_: any, data: Payment) => {
      if (data.discountAmount) {
        return (
          <div>
            <div>{data.payAmount.toLocaleString()}원</div>
            <div style={{ fontSize: '8px', color: 'grey' }}>판매금액 {data.totalAmount.toLocaleString()}원</div>
            <div style={{ fontSize: '8px', color: 'grey' }}>할인금액 {data.discountAmount.toLocaleString()}원</div>
          </div>
        );
      }

      return <div>{data.payAmount.toLocaleString()}원</div>;
    },
  },
  {
    id: 'cancelAmount',
    label: '환불금액',
    customBodyRender: (_: any, data: Payment) => {
      if (!data.cancelAmount) return <div>-</div>;

      return <div>{data.cancelAmount.toLocaleString()}원</div>;
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
