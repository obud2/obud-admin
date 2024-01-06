import { Table } from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import { useQuery } from "react-query";
import DataTableHeader from "../../components/dataTable/DataTableHeader";
import {
  Coupon,
  CouponDiscountType,
  CouponIssueType,
} from "../../entities/coupon";
import CouponService from "../../services/CouponService";
import { FILTER } from "./CouponListPage.option";
import CouponDetail from "./detail/CouponDetail";

const CouponListPage = () => {
  const [detailId, setDetailId] = useState<any>("");
  const [searchFilter, setSearchFilter] = useState({ value: "", filter: "" });
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch, isRefetching } = useCoupons(page);

  const doSearch = (type: string, e: string) => {
    setSearchFilter((prev) => ({ ...prev, [type]: e }));
    refetch();
  };

  const onDetail = (item: { id: string }) => {
    setDetailId({ id: item?.id || "new" });
  };

  const onDetailClose = (refresh: boolean) => {
    if (refresh) refetch();

    setDetailId("");
  };

  const isAllLoading = isLoading || isRefetching;

  const columns = [
    {
      title: "쿠폰 이름",
      render: (item: Coupon) => (
        <div>
          <div>
            <b>{item.name}</b>
          </div>
          {item.discountType === CouponDiscountType.AMOUNT && (
            <>{`${item.discountAmount}원 할인`}</>
          )}
          {item.discountType === CouponDiscountType.PERCENTAGE && (
            <>{`${item.discountAmount}% 할인`}</>
          )}
        </div>
      ),
    },
    {
      title: "상태",
      render: (item: Coupon) => (
        <div style={{ color: "skyblue", fontWeight: "bold" }}>
          {dayjs(item.startDate).isAfter(dayjs()) && <div>대기중</div>}
          {dayjs(item.startDate).isBefore(dayjs()) &&
            dayjs(item.endDate).isAfter(dayjs()) && <div>진행중</div>}
          {dayjs(item.endDate).isBefore(dayjs()) && <div>종료</div>}
        </div>
      ),
    },
    {
      title: "발급방식",
      render: (item: Coupon) => (
        <div>
          {item.issueType === CouponIssueType.BY_CODE && <div>코드 입력</div>}
          {item.issueType === CouponIssueType.TO_USER && (
            <div>특정 유저에게 지급</div>
          )}
          {item.issueType === CouponIssueType.TO_ALL_USERS && (
            <div>모든 유저에게 지급</div>
          )}
        </div>
      ),
    },
    {
      title: "사용기간",
      render: (item: Coupon) => (
        <div>
          <div>{dayjs(item.startDate).format("YYYY-MM-DD")} 부터</div>
          <div>{dayjs(item.endDate).format("YYYY-MM-DD")} 까지</div>
        </div>
      ),
    },
    {
      title: "등록일",
      render: (item: Coupon) => (
        <div>{dayjs(item.createdAt).format("YYYY-MM-DD")}</div>
      ),
    },
    {
      title: "수정일",
      render: (item: Coupon) => (
        <div>{dayjs(item.updatedAt).format("YYYY-MM-DD")}</div>
      ),
    },
  ];

  const dataSource = data?.map((item) => ({
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
        doSearch={(e) => doSearch("value", e)}
        doFilter={(e) => doSearch("filter", e)}
        resister={{ text: "쿠폰 등록", onClick: () => onDetail({ id: "new" }) }}
        title="쿠폰 관리"
        filter={FILTER}
        searchPlaceholder="쿠폰 이름으로 검색하세요."
        isLoading={isAllLoading}
      />
      <Table
        style={{ marginTop: "20px" }}
        columns={columns}
        dataSource={dataSource}
        pagination={{
          position: ["bottomRight"],
          current: page,
          onChange: (page) => setPage(page),
        }}
      />
      <CouponDetail
        id={detailId?.id || ""}
        open={detailId}
        onClose={() => onDetailClose(false)}
        refresh={() => onDetailClose(true)}
      />
    </>
  );
};

export default CouponListPage;

const useCoupons = (page: number) => {
  const query = useQuery(["coupons", page], () =>
    CouponService.listCoupons({ page })
  );

  return query;
};
