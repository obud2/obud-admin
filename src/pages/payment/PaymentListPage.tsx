import DataTableHeader from '@/components/dataTable/DataTableHeader';
import PaymentService, { ListPaymentsRequest } from '@/services/PaymentService';
import { DatePicker, Form, Input, Select, Tag } from 'antd';
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
const defaultStartDate = dayjs().subtract(1, 'month').format(dateFormat);
const defaultEndDate = dayjs().format(dateFormat);

const PaymentListPage = () => {
  const { isAdmin } = useContext(UserContext);

  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedPlaceId, setSelectedPlaceId] = useState<Place['id'] | ''>('');
  const [selectedProgramId, setSelectedProgramId] = useState<Program['id'] | ''>('');
  const [selectedMerchandiseType, setSelectedMerchandiseType] = useState<MerchandiseType>();
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus>();

  const [openRefundModal, setOpenRefundModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment>();

  const { data: places } = usePlaces();
  const { data: programs } = usePrograms(selectedPlaceId || undefined);
  const { data: payments, isLoading } = usePayments({
    startDate,
    endDate,
    query: searchKeyword,
    placeId: selectedPlaceId || undefined,
    programId: selectedProgramId || undefined,
    merchandiseType: selectedMerchandiseType,
    paymentStatus: selectedStatus,
  });

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  const handleExcelListApi = () => {
    return PaymentService.listPaymentsExcelListRequest({
      startDate,
      endDate,
      query: searchKeyword,
      placeId: selectedPlaceId || undefined,
      programId: selectedProgramId || undefined,
      merchandiseType: selectedMerchandiseType,
      paymentStatus: selectedStatus,
    });
  };

  const handleHideRefundButton = (payment: Payment): boolean => {
    if (payment.status === 'CANCEL') return true;

    // 전체 관리자인 경우에는 취소 상태만 아니면 무조건 보여주어야 한다.
    if (isAdmin) return false;

    if (payment.merchandiseType === 'PASS' && !isAdmin) {
      return true;
    }

    if (payment.merchandiseType === 'ONE_TIME_RESERVATION' && payment.schedule && dayjs(payment.schedule?.startDate).isBefore(dayjs())) {
      return true;
    }

    if (payment.merchandiseType === 'PASS' && payment.pass && dayjs(payment.pass.startDate).isBefore(dayjs())) {
      return true;
    }

    return false;
  };

  return (
    <div>
      <DataTableHeader title="결제내역" />
      <Wrapper>
        <FilterWrapper>
          <Form.Item label="결제일" style={{ maxHeight: '32px', height: '32px', margin: '0px' }}></Form.Item>
          <DatePicker.RangePicker
            style={{ width: '45%', height: '32px' }}
            disabled={isLoading}
            locale={locale}
            format={dateFormat}
            value={[dayjs(startDate, dateFormat), dayjs(endDate, dateFormat)]}
            onChange={(_, dateString) => {
              setStartDate(dateString[0]);
              setEndDate(dateString[1]);
            }}
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
            hideDetail={handleHideRefundButton}
            detailTitle="환불"
            onClick={(payment: Payment) => {
              setSelectedPayment(payment);
              setOpenRefundModal(true);
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
