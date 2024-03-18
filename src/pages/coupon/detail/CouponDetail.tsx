import CouponService, { PlaceResult, RegisterCouponRequest, UserResult } from '@/services/CouponService';
import { Button, DatePicker, Input, InputNumber, Radio, Select } from 'antd';
import locale from 'antd/es/date-picker/locale/ko_KR';
import dayjs from 'dayjs';
import { useState } from 'react';
import { BsTrash } from 'react-icons/bs';
import styled from 'styled-components';
import swal from 'sweetalert';
import DataDetailBody, { DataDetailItem, DataDetailTitle } from '../../../components/detailTable/DataDetailBody';
import { Coupon, CouponApplyType, CouponDiscountType, CouponIssueType } from '../../../entities/coupon';
import CouponPlaceSearchModal from './CouponPlaceSearchModal';
import CouponUserSearchModal from './CouponUserSearchModal';

/**
 * @param {*} id : Coupon Id
 * @returns
 */

const dateFormat = 'YYYY-MM-DD';

const initialBody: RegisterCouponRequest = {
  name: '',
  code: null,
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
  userIds: [],
};

type Props = {
  coupon: Coupon | null;
  open: boolean;
  onClose: () => void;
  refresh: () => void;
};

const CouponDetail = ({ coupon, open, onClose, refresh }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [notiMessage, setNotiMessage] = useState('');
  const [body, setBody] = useState<RegisterCouponRequest>(initialBody);
  const [applyType, setApplyType] = useState<CouponApplyType>(CouponApplyType.ALL);
  const [placeAllowModalOpen, setPlaceAllowModalOpen] = useState(false);
  const [placeAllowList, setPlaceAllowList] = useState<PlaceResult[]>([]);
  const [programAllowList, setProgramAllowList] = useState<PlaceResult['programs'][number][]>([]);

  const [placeBlockModalOpen, setPlaceBlockModalOpen] = useState(false);
  const [placeBlockList, setPlaceBlockList] = useState<PlaceResult[]>([]);
  const [programBlockList, setProgramBlockList] = useState<PlaceResult['programs'][number][]>([]);

  const [issueUserModalOpen, setIssueUserModalOpen] = useState(false);
  const [issueUserList, setIssueUserList] = useState<UserResult[]>([]);

  const isActive = body.name && body.discountAmount > 0;

  // TODO: 쿠폰 정보 수정

  const onChangeInputValue = (key: keyof Coupon, value: Coupon[keyof Coupon]) => {
    setBody((prev) => ({ ...prev, [key]: value }));
  };

  const handleClose = () => {
    setBody(initialBody);
    setPlaceAllowList([]);
    setProgramAllowList([]);
    setPlaceBlockList([]);
    setProgramBlockList([]);
    setIssueUserList([]);
    onClose();
  };

  const onSubmit = () => {
    const text = coupon ? '조회' : '등록';
    const param = body;

    if (!param?.name) {
      emptyCheck('이름을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    CouponService.registerCoupon({
      ...param,
      code: param.code?.trim()?.toLocaleUpperCase() || null,
      userIds: issueUserList.map((user) => user.id),
      placeAllowList: placeAllowList.map((place) => place.id),
      programAllowList: programAllowList.map((program) => program.id),
      placeBlockList: placeBlockList.map((place) => place.id),
      programBlockList: programBlockList.map((program) => program.id),
    })
      .then(() => {
        setNotiMessage(`쿠폰 ${text} 되었습니다.`);
        setIsLoading(false);
        refresh();
        handleClose();
      })
      .catch(() => {
        setNotiMessage('에러가 발생하였습니다. 잠시 후 다시시도해주세요.');
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const emptyCheck = (text: string) => {
    swal({
      title: '',
      text,
      icon: 'warning',
    });
  };

  const renderButtons = () => {
    return [
      <Button key="cancel-btn" style={{ width: '70px', marginRight: '5px' }} onClick={handleClose}>
        취소
      </Button>,
      <Button key="add-btn" type="primary" style={{ width: '70px' }} disabled={!isActive} onClick={onSubmit}>
        {coupon ? '조회' : '등록'}
      </Button>,
    ];
  };

  return (
    <DataDetailBody
      open={open}
      onClose={onClose}
      title={`쿠폰 ${coupon ? '조회' : '등록'}`}
      extra={renderButtons()}
      isLoading={isLoading}
      notiMessage={notiMessage}
    >
      <DataDetailTitle title="쿠폰 정보" />
      <DataDetailItem label="쿠폰명" span={2} point>
        <Input
          placeholder="쿠폰명을 입력하세요."
          value={body.name || ''}
          onChange={(e) => onChangeInputValue('name', e.target.value)}
          disabled={isLoading}
        />
      </DataDetailItem>
      <DataDetailItem label="쿠폰 형식" span={2}>
        <Select
          value={body.issueType}
          onChange={(e) => onChangeInputValue('issueType', e)}
          options={[
            { label: '코드 입력', value: CouponIssueType.BY_CODE },
            { label: '전체 회원', value: CouponIssueType.TO_ALL_USERS },
            { label: '특정 회원', value: CouponIssueType.TO_USER },
          ]}
          style={{ width: '100%' }}
        />
      </DataDetailItem>
      {/* 코드 생성 */}
      {body.issueType === CouponIssueType.BY_CODE && (
        <DataDetailItem label="쿠폰코드" span={2} point>
          <Input
            placeholder="영어 대문자 + 숫자 조합으로 최대 5자리. 미입력시 자동 생성"
            onChange={(e) => {
              const code = e.target.value.trim().slice(0, 5).toUpperCase();
              onChangeInputValue('code', code);
            }}
          />
        </DataDetailItem>
      )}
      {/* 특정 유저 */}
      {body.issueType === CouponIssueType.TO_USER && (
        <DataDetailItem label="회원 선택" span={2}>
          <Button type="primary" onClick={() => setIssueUserModalOpen(true)} disabled={isLoading}>
            회원 선택
          </Button>
          <CouponUserSearchModal
            open={issueUserModalOpen}
            onClose={() => setIssueUserModalOpen(false)}
            userList={issueUserList}
            setUserList={setIssueUserList}
          />
          {issueUserList.length > 0 && (
            <UserWrapper>
              <UserListWrapper>
                {issueUserList.map((user) => (
                  <UserItem key={user.id}>
                    {user.name} / {user.email} / {user.phone}
                    <BsTrash
                      style={{ marginLeft: '4px', cursor: 'pointer' }}
                      onClick={() => setIssueUserList(issueUserList.filter((item) => item.id !== user.id))}
                    />
                  </UserItem>
                ))}
              </UserListWrapper>
            </UserWrapper>
          )}
        </DataDetailItem>
      )}

      {/* 쿠폰 사용 정보 */}
      <DataDetailTitle title="사용 정보" />
      <DataDetailItem label="사용 혜택" span={2} point>
        <div style={{ display: 'flex' }}>
          <Select
            value={body.discountType}
            onChange={(e) => onChangeInputValue('discountType', e)}
            options={[
              { label: '금액 할인', value: CouponDiscountType.AMOUNT },
              { label: '비율 할인', value: CouponDiscountType.PERCENTAGE },
            ]}
            style={{ width: '200px' }}
            disabled={isLoading}
          />
          <InputNumber
            style={{ width: '100%', marginLeft: '4px' }}
            value={body.discountAmount}
            onChange={(e) => e && onChangeInputValue('discountAmount', e)}
            placeholder={body.discountType === CouponDiscountType.AMOUNT ? '할인 금액을 입력하세요.' : '할인 비율을 입력하세요.'}
            addonAfter={body.discountType === CouponDiscountType.AMOUNT ? '원' : '%'}
            disabled={isLoading}
          />
        </div>
      </DataDetailItem>
      <DataDetailItem label="최대 할인 금액" span={2} point>
        <InputNumber
          placeholder="최대 할인 금액을 입력하세요."
          addonAfter="원"
          style={{ width: '100%' }}
          value={body.maxDiscountAmount}
          onChange={(e) => e && onChangeInputValue('maxDiscountAmount', e)}
          disabled={isLoading}
        />
      </DataDetailItem>
      <DataDetailItem label="최소 주문 금액" span={2} point>
        <InputNumber
          placeholder="최소 주문 금액을 입력하세요."
          addonAfter="원"
          style={{ width: '100%' }}
          value={body.minOrderPriceAmount}
          onChange={(e) => e && onChangeInputValue('minOrderPriceAmount', e)}
          disabled={isLoading}
        />
      </DataDetailItem>
      <DataDetailItem label="쿠폰 적용 범위" span={2}>
        <Select
          value={applyType}
          onChange={(e) => setApplyType(e)}
          options={[
            { label: '모든 장소', value: CouponApplyType.ALL },
            { label: '선택', value: CouponApplyType.PARTIAL },
          ]}
          style={{ width: '100%' }}
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
        {placeAllowList.length > 0 && (
          <PlaceWrapper>
            <PlaceTitleWrapper>장소</PlaceTitleWrapper>
            <PlaceListWrapper>
              {placeAllowList.map((place) => (
                <PlaceItem key={place.id}>
                  {place.name}
                  <BsTrash
                    style={{ marginLeft: '4px', cursor: 'pointer' }}
                    onClick={() => setPlaceAllowList(placeAllowList.filter((item) => item.id !== place.id))}
                  />
                </PlaceItem>
              ))}
            </PlaceListWrapper>
          </PlaceWrapper>
        )}
        {programAllowList.length > 0 && (
          <PlaceWrapper>
            <PlaceTitleWrapper>프로그램</PlaceTitleWrapper>
            <PlaceListWrapper>
              {programAllowList.map((program) => (
                <PlaceItem key={program.id}>
                  {program.name}
                  <BsTrash
                    style={{ marginLeft: '4px', cursor: 'pointer' }}
                    onClick={() => setProgramAllowList(programAllowList.filter((item) => item.id !== program.id))}
                  />
                </PlaceItem>
              ))}
            </PlaceListWrapper>
          </PlaceWrapper>
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

        {placeBlockList.length > 0 && (
          <PlaceWrapper>
            <PlaceTitleWrapper>장소</PlaceTitleWrapper>
            <PlaceListWrapper>
              {placeBlockList.map((place) => (
                <PlaceItem key={place.id}>
                  {place.name}
                  <BsTrash
                    style={{ marginLeft: '4px', cursor: 'pointer' }}
                    onClick={() => setPlaceBlockList(placeBlockList.filter((item) => item.id !== place.id))}
                  />
                </PlaceItem>
              ))}
            </PlaceListWrapper>
          </PlaceWrapper>
        )}
        {programBlockList.length > 0 && (
          <PlaceWrapper>
            <PlaceTitleWrapper>프로그램</PlaceTitleWrapper>
            <PlaceListWrapper>
              {programBlockList.map((program) => (
                <PlaceItem key={program.id}>
                  {program.name}
                  <BsTrash
                    style={{ marginLeft: '4px', cursor: 'pointer' }}
                    onClick={() => setProgramBlockList(programBlockList.filter((item) => item.id !== program.id))}
                  />
                </PlaceItem>
              ))}
            </PlaceListWrapper>
          </PlaceWrapper>
        )}
      </DataDetailItem>
      <DataDetailItem label="사용 기간" span={2}>
        <DatePicker.RangePicker
          showTime
          hourStep={1 as const}
          minuteStep={5 as const}
          secondStep={10 as const}
          disabled={isLoading}
          locale={locale}
          style={{ width: '100%' }}
          format={dateFormat}
          value={[dayjs(body.startDate ?? '', dateFormat), dayjs(body.endDate ?? '', dateFormat)]}
          onChange={(_, dateString) => {
            onChangeInputValue('startDate', dayjs(dateString[0] ?? '').format(dateFormat));
            onChangeInputValue('endDate', dayjs(dateString[1] ?? '').format(dateFormat));
          }}
          allowClear={false}
        />
      </DataDetailItem>
      <DataDetailItem label="중복 발급 가능 여부" span={2}>
        <Radio.Group value={body.allowDuplicatePerUser} onChange={(e) => onChangeInputValue('allowDuplicatePerUser', e.target.value)}>
          <Radio value>가능</Radio>
          <Radio value={false}>불가능</Radio>
        </Radio.Group>
      </DataDetailItem>
    </DataDetailBody>
  );
};

export default CouponDetail;

const ApplyOptionWrapper = styled.div`
  margin-top: 12px;
`;

const PlaceWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;

  max-height: 300px;
`;

const PlaceTitleWrapper = styled.div`
  font-size: 14px;
  font-weight: bold;
`;

const PlaceListWrapper = styled.div``;

const PlaceItem = styled.div`
  padding: 4px;
  font-size: 13px;
  display: flex;
  align-items: center;
`;

const UserWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;

  max-height: 300px;
`;

const UserListWrapper = styled.div``;

const UserItem = styled.div`
  padding: 4px;
  font-size: 13px;
  display: flex;
  align-items: center;
`;
