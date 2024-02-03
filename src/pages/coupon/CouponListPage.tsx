import { Button, Table, message } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import DataTableHeader from '../../components/dataTable/DataTableHeader';
import { Coupon, CouponDiscountType, CouponIssueType, CouponStatus } from '../../entities/coupon';
import CouponService from '../../services/CouponService';
import { FILTER } from './CouponListPage.option';
import CouponDetail from './detail/CouponDetail';

const CouponListPage = () => {
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [name, setName] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch, isRefetching } = useCoupons({
    page,
    name,
    status,
  });

  const onDetail = (item: Coupon | null) => {
    setCoupon(item);
    setOpen(true);
  };

  const onDetailClose = (refresh: boolean) => {
    if (refresh) refetch();

    setCoupon(null);
    setOpen(false);
  };

  const onDisableCoupon = async (couponId: string) => {
    console.log(couponId);
    try {
      await CouponService.disableCoupon({ couponId });
      refetch();
      message.success('쿠폰이 비활성화 되었습니다.');
    } catch (err) {
      message.error('에러가 발생하였습니다. 잠시 후 다시 시도해주세요.');
      console.error(err);
    }
  };

  const isAllLoading = isLoading || isRefetching;

  const columns = [
    {
      title: '쿠폰 이름',
      render: (item: Coupon) => (
        <div>
          <div>
            <b>{item.name}</b>
          </div>
          {item.discountType === CouponDiscountType.AMOUNT && <>{`${item.discountAmount}원 할인`}</>}
          {item.discountType === CouponDiscountType.PERCENTAGE && <>{`${item.discountAmount}% 할인`}</>}
        </div>
      ),
    },
    {
      title: '상태',
      render: (item: Coupon) => (
        <div style={{ color: 'skyblue', fontWeight: 'bold' }}>
          {dayjs(item.startDate).isAfter(dayjs()) && <div>대기중</div>}
          {dayjs(item.startDate).isBefore(dayjs()) && dayjs(item.endDate).isAfter(dayjs()) && <div>진행중</div>}
          {dayjs(item.endDate).isBefore(dayjs()) && <div>종료</div>}
        </div>
      ),
    },
    {
      title: '발급방식',
      render: (item: Coupon) => (
        <div>
          {item.issueType === CouponIssueType.BY_CODE && <div>코드 입력</div>}
          {item.issueType === CouponIssueType.TO_USER && <div>특정 유저에게 지급</div>}
          {item.issueType === CouponIssueType.TO_ALL_USERS && <div>모든 유저에게 지급</div>}
        </div>
      ),
    },
    {
      title: '사용기간',
      render: (item: Coupon) => (
        <div>
          <div>{dayjs(item.startDate).format('YYYY-MM-DD')} 부터</div>
          <div>{dayjs(item.endDate).format('YYYY-MM-DD')} 까지</div>
        </div>
      ),
    },
    {
      title: '등록일',
      render: (item: Coupon) => <div>{dayjs(item.createdAt).format('YYYY-MM-DD')}</div>,
    },
    {
      title: '수정일',
      render: (item: Coupon) => <div>{dayjs(item.updatedAt).format('YYYY-MM-DD')}</div>,
    },
    {
      title: '비활성화',
      render: (item: Coupon & { key: Coupon['id'] }) => (
        <div>
          <Button onClick={() => onDisableCoupon(item.key)}>비활성화</Button>
        </div>
      ),
    },
    // {
    //   title: "상세",
    //   render: (item: Coupon) => (
    //     <div>
    //       <Button onClick={() => onDetail(item)}>상세</Button>
    //     </div>
    //   ),
    // },
  ];

  const dataSource = data?.data.map((item) => ({
    key: item.id,
    name: item.name,
    issueType: item.issueType,
    discountType: item.discountType,
    discountAmount: item.discountAmount,
    maxDiscountAmount: item.maxDiscountAmount,
    minOrderPriceAmount: item.minOrderPriceAmount,
    startDate: item.startDate,
    endDate: item.endDate,
  }));

  return (
    <>
      <DataTableHeader
        doSearch={(e) => setName(e)}
        doFilter={(e) => setStatus(e)}
        register={{ text: '쿠폰 등록', onClick: () => onDetail(null) }}
        title="쿠폰 관리"
        filter={FILTER}
        searchPlaceholder="쿠폰 이름으로 검색하세요."
        isLoading={isAllLoading}
      />
      <Table
        style={{ marginTop: '20px' }}
        columns={columns}
        dataSource={dataSource}
        pagination={{
          position: ['bottomRight'],
          current: page,
          total: data?.meta.total,
          pageSize: 30,
          onChange: (page) => setPage(page),
        }}
      />
      <CouponDetail coupon={coupon} open={open} onClose={() => onDetailClose(false)} refresh={() => onDetailClose(true)} />
    </>
  );
};

export default CouponListPage;

const useCoupons = ({
  page,
  name,
  status,
}: {
  page: number;
  name?: string;
  status?: string; // 'wait' | 'active' | 'done' | ''
}) => {
  return useQuery(['coupons', page, name, status], () =>
    CouponService.listCoupons({
      page,
      name,
      status: mapCouponStatus(status || ''),
    }),
  );
};

function mapCouponStatus(status: string): CouponStatus {
  switch (status) {
    case 'wait':
      return 'PENDING';
    case 'active':
      return 'IN_PROGRESS';
    case 'done':
      return 'FINISHED';
    default:
      return '';
  }
}
