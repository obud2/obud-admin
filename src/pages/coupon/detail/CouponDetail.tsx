import { Button, DatePicker, Input, InputNumber, Select } from "antd";
import React, { useEffect, useState } from "react";
import swal from "sweetalert";
import DataDetailBody, {
  DataDetailItem,
  DataDetailTitle,
} from "../../../components/detailTable/DataDetailBody";
import {
  Coupon,
  CouponDiscountType,
  CouponIssueType,
} from "../../../entities/coupon";
import ProductService from "../../../services/ProductService";
import locale from "antd/es/date-picker/locale/ko_KR";
import dayjs from "dayjs";

/**
 * @param {*} id : Coupon Id
 * @returns
 */

const dateFormat = "YYYY-MM-DD";

const CouponDetail = ({ id, open, onClose, refresh }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [notiMessage, setNotiMessage] = useState("");
  const [body, setBody] = useState<Partial<Coupon>>({
    issueType: CouponIssueType.BY_CODE,
    startDate: dayjs().format(dateFormat),
    endDate: dayjs().format(dateFormat),
  });
  const [amountByUser, setAmountByUser] = useState(1);

  const isActive =
    body.name && body.maxDiscountAmount && body.minOrderPriceAmount;

  /** 기본정보 호출 */
  useEffect(() => {
    if (id && id !== "new") {
      setIsLoading(true);

      ProductService?.getStudio(id).then((res) => {
        setBody(res);
        setIsLoading(false);
      });
    }
  }, [id]);

  const onChangeInputValue = (type: keyof Coupon, e: Coupon[keyof Coupon]) => {
    setBody((prev) => ({ ...prev, [type]: e }));
  };

  const onSubmit = async () => {
    const text = id === "new" ? "등록" : "수정";
    const param = body;

    if (!param?.name) {
      emptyCheck("이름을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    ProductService?.setStudio(id, param)
      .then(() => {
        setNotiMessage(`${text} 되었습니다.`);
      })
      .catch(() => {
        setNotiMessage("에러가 발생하였습니다. 잠시 후 다시시도해주세요.");
      })
      .finally(() => {
        refresh();
        setIsLoading(false);
      });
  };

  const emptyCheck = (text: string) => {
    swal({
      title: "",
      text: text,
      icon: "warning",
    });
  };

  const renderButtons = () => {
    return [
      <Button
        key="cancel-btn"
        style={{ width: "70px", marginRight: "5px" }}
        onClick={onClose}
      >
        취소
      </Button>,
      <Button
        key="add-btn"
        type="primary"
        style={{ width: "70px" }}
        disabled={!isActive}
        onClick={onSubmit}
      >
        {id === "new" ? "등록" : "수정"}
      </Button>,
    ];
  };

  console.log(body);

  return (
    <DataDetailBody
      open={open}
      onClose={onClose}
      title={`쿠폰 ${id === "new" ? "등록" : "수정"}`}
      extra={renderButtons()}
      subTitle={body?.id}
      isLoading={isLoading}
      notiMessage={notiMessage}
    >
      <DataDetailTitle title="쿠폰 정보" />
      <DataDetailItem label="쿠폰명" span={2} point>
        <Input
          placeholder="쿠폰명을 입력하세요."
          value={body?.name || ""}
          onChange={(e) => onChangeInputValue("name", e.target.value)}
          disabled={isLoading}
        />
      </DataDetailItem>
      <DataDetailItem label="쿠폰 형식" span={2}>
        <Select
          value={body.issueType}
          onChange={(e) => onChangeInputValue("issueType", e)}
          options={[
            { label: "코드 입력", value: CouponIssueType.BY_CODE },
            { label: "특정 유저에게 지급", value: CouponIssueType.TO_USER },
            {
              label: "모든 유저에게 지급",
              value: CouponIssueType.TO_ALL_USERS,
            },
          ]}
          style={{ width: "100%" }}
          disabled={isLoading}
        />
      </DataDetailItem>
      <DataDetailItem label="발행 대상" span={2}></DataDetailItem>
      <DataDetailItem label="발행 수량" span={2}>
        <Input disabled placeholder="개수제한 없음" />
      </DataDetailItem>
      <DataDetailTitle title="사용 정보" />
      <DataDetailItem label="사용 혜택" span={2} point>
        <div style={{ display: "flex" }}>
          <Select
            value={body.discountType}
            onChange={(e) => onChangeInputValue("discountType", e)}
            options={[
              { label: "금액 할인", value: CouponDiscountType.AMOUNT },
              { label: "비율 할인", value: CouponDiscountType.PERCENTAGE },
            ]}
            style={{ width: "200px" }}
            disabled={isLoading}
          />
          <Input
            placeholder={
              body.discountType === CouponDiscountType.AMOUNT
                ? "할인 금액을 입력하세요."
                : "할인 비율을 입력하세요."
            }
            addonAfter={
              body.discountType === CouponDiscountType.AMOUNT ? "원" : "%"
            }
            min={100}
            style={{ width: "100%", marginLeft: "4px" }}
            value={body?.discountAmount}
            onChange={(e) =>
              e && onChangeInputValue("discountAmount", e.target.value)
            }
            disabled={isLoading}
          />
        </div>
      </DataDetailItem>
      <DataDetailItem label="최대 할인 금액" span={2} point>
        <InputNumber
          placeholder="최대 할인 금액을 입력하세요."
          addonAfter="원"
          min={100}
          style={{ width: "100%" }}
          value={body?.maxDiscountAmount}
          onChange={(e) => e && onChangeInputValue("maxDiscountAmount", e)}
          disabled={isLoading}
        />
      </DataDetailItem>
      <DataDetailItem label="최소 주문 금액" span={2} point>
        <InputNumber
          placeholder="최소 주문 금액을 입력하세요."
          addonAfter="원"
          min={100}
          style={{ width: "100%" }}
          value={body?.minOrderPriceAmount}
          onChange={(e) => e && onChangeInputValue("minOrderPriceAmount", e)}
          disabled={isLoading}
        />
      </DataDetailItem>
      <DataDetailItem label="사용 기간" span={2}>
        <DatePicker.RangePicker
          showTime
          hourStep={1 as const}
          minuteStep={5 as const}
          secondStep={10 as const}
          disabled={isLoading}
          locale={locale}
          style={{ width: "100%" }}
          format={dateFormat}
          value={[
            dayjs(body?.startDate ?? "", dateFormat),
            dayjs(body?.endDate ?? "", dateFormat),
          ]}
          onChange={(_, dateString) => {
            onChangeInputValue(
              "startDate",
              dayjs(dateString[0] ?? "").format(dateFormat)
            );
            onChangeInputValue(
              "endDate",
              dayjs(dateString[1] ?? "").format(dateFormat)
            );
          }}
        />
      </DataDetailItem>
      <DataDetailItem label="사용 횟수" span={2}>
        <div
          style={{ fontSize: "12px", display: "flex", alignItems: "center" }}
        >
          동일 회원이 최대
          <InputNumber
            value={amountByUser}
            min={1}
            onChange={(e) => e && setAmountByUser(e)}
            style={{ width: "70px", margin: "0 4px" }}
            disabled={isLoading}
          />
          회까지 사용 가능
        </div>
      </DataDetailItem>
    </DataDetailBody>
  );
};

export default CouponDetail;
