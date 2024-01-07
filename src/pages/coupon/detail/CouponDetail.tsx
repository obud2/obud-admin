import CouponService, {
  PlaceResult,
  RegisterCouponRequest,
  UserResult,
} from "@/services/CouponService";
import { Button, DatePicker, Input, InputNumber, Radio, Select } from "antd";
import locale from "antd/es/date-picker/locale/ko_KR";
import dayjs from "dayjs";
import { useState } from "react";
import styled from "styled-components";
import swal from "sweetalert";
import DataDetailBody, {
  DataDetailItem,
  DataDetailTitle,
} from "../../../components/detailTable/DataDetailBody";
import {
  Coupon,
  CouponApplyType,
  CouponDiscountType,
  CouponIssueType,
} from "../../../entities/coupon";
import CouponPlaceSearchModal from "./CouponPlaceSearchModal";

/**
 * @param {*} id : Coupon Id
 * @returns
 */

const dateFormat = "YYYY-MM-DD";

const initialBody: RegisterCouponRequest = {
  name: "",
  issueType: CouponIssueType.BY_CODE,
  discountType: CouponDiscountType.AMOUNT,
  discountAmount: 0,
  startDate: dayjs().format(dateFormat),
  endDate: dayjs().format(dateFormat),
  minOrderPriceAmount: 0,
  maxDiscountAmount: 0,
  allowDuplicatePerUser: false,
  placeAllowList: [],
  programAllowList: [],
  placeBlockList: [],
  programBlockList: [],
  userId: null,
  userIds: [],
};

type Props = {
  id: string;
  open: boolean;
  onClose: () => void;
  refresh: () => void;
};

const CouponDetail = ({ id, open, onClose, refresh }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [notiMessage, setNotiMessage] = useState("");
  const [body, setBody] = useState<RegisterCouponRequest>(initialBody);
  const [applyType, setApplyType] = useState<CouponApplyType>(
    CouponApplyType.ALL
  );
  const [placeAllowModalOpen, setPlaceAllowModalOpen] = useState(false);
  const [placeAllowList, setPlaceAllowList] = useState<PlaceResult["id"][]>([]);
  const [programAllowList, setProgramAllowList] = useState<
    PlaceResult["programs"][number]["id"][]
  >([]);

  const [placeBlockModalOpen, setPlaceBlockModalOpen] = useState(false);
  const [placeBlockList, setPlaceBlockList] = useState<PlaceResult["id"][]>([]);
  const [programBlockList, setProgramBlockList] = useState<
    PlaceResult["programs"][number]["id"][]
  >([]);

  const [issueUserModalOpen, setIssueUserModalOpen] = useState(false);
  const [issueUserList, setIssueUserList] = useState<UserResult["id"][]>([]);

  const isActive =
    body.name && body.maxDiscountAmount && body.minOrderPriceAmount;

  // TODO: 쿠폰 정보 수정

  const onChangeInputValue = (
    key: keyof Coupon,
    value: Coupon[keyof Coupon]
  ) => {
    setBody((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = () => {
    const text = id === "new" ? "등록" : "수정";
    const param = body;

    if (!param?.name) {
      emptyCheck("이름을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    CouponService.registerCoupon(param)
      .then(() => {
        setNotiMessage(`쿠폰 ${text} 되었습니다.`);
      })
      .catch(() => {
        setNotiMessage("에러가 발생하였습니다. 잠시 후 다시시도해주세요.");
      })
      .finally(() => {
        refresh();
        setBody(initialBody);
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
      subTitle={body.name}
      isLoading={isLoading}
      notiMessage={notiMessage}
    >
      <DataDetailTitle title="쿠폰 정보" />
      <DataDetailItem label="쿠폰명" span={2} point>
        <Input
          placeholder="쿠폰명을 입력하세요."
          value={body.name || ""}
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
            { label: "전체 회원", value: CouponIssueType.TO_ALL_USERS },
            { label: "특정 회원", value: CouponIssueType.TO_USER },
          ]}
          style={{ width: "100%" }}
        />
      </DataDetailItem>
      <DataDetailItem label="쿠폰코드" span={2} point>
        <Input
          placeholder="쿠폰코드는 자동 생성됩니다"
          onChange={(e) => onChangeInputValue("code", e.target.value)}
          disabled
        />
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
          <InputNumber
            min={100}
            style={{ width: "100%", marginLeft: "4px" }}
            value={body.discountAmount}
            onChange={(e) => e && onChangeInputValue("discountAmount", e)}
            placeholder={
              body.discountType === CouponDiscountType.AMOUNT
                ? "할인 금액을 입력하세요."
                : "할인 비율을 입력하세요."
            }
            addonAfter={
              body.discountType === CouponDiscountType.AMOUNT ? "원" : "%"
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
          value={body.maxDiscountAmount}
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
          value={body.minOrderPriceAmount}
          onChange={(e) => e && onChangeInputValue("minOrderPriceAmount", e)}
          disabled={isLoading}
        />
      </DataDetailItem>
      <DataDetailItem label="쿠폰 적용 범위" span={2}>
        <Select
          value={applyType}
          onChange={(e) => setApplyType(e)}
          options={[
            { label: "모든 장소", value: CouponApplyType.ALL },
            { label: "선택", value: CouponApplyType.PARTIAL },
          ]}
          style={{ width: "100%" }}
        />
        {applyType === CouponApplyType.PARTIAL && (
          <ApplyOptionWrapper>
            <Button type="primary" onClick={() => setPlaceAllowModalOpen(true)}>
              쿠폰 적용 상품 선택
            </Button>
            <CouponPlaceSearchModal
              open={placeAllowModalOpen}
              onClose={() => setPlaceAllowModalOpen(false)}
              placeList={placeAllowList}
              setPlaceList={setPlaceAllowList}
              programList={programAllowList}
              setProgramList={setProgramAllowList}
            />
          </ApplyOptionWrapper>
        )}
      </DataDetailItem>
      <DataDetailItem label="사용 제외 상품" span={2}>
        <ApplyOptionWrapper>
          <Button type="primary" onClick={() => setPlaceBlockModalOpen(true)}>
            쿠폰 적용 제외 상품 선택
          </Button>
          <CouponPlaceSearchModal
            open={placeBlockModalOpen}
            onClose={() => setPlaceBlockModalOpen(false)}
            placeList={placeBlockList}
            setPlaceList={setPlaceBlockList}
            programList={programBlockList}
            setProgramList={setProgramBlockList}
          />
        </ApplyOptionWrapper>
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
            dayjs(body.startDate ?? "", dateFormat),
            dayjs(body.endDate ?? "", dateFormat),
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
      <DataDetailItem label="중복 발급 가능 여부" span={2}>
        <Radio.Group
          value={body.allowDuplicatePerUser}
          onChange={(e) =>
            onChangeInputValue("allowDuplicatePerUser", e.target.value)
          }
        >
          <Radio value={true}>가능</Radio>
          <Radio value={false}>불가능</Radio>
        </Radio.Group>
      </DataDetailItem>
    </DataDetailBody>
  );
};

export default CouponDetail;

export const ApplyOptionWrapper = styled.div`
  margin-top: 12px;
`;
