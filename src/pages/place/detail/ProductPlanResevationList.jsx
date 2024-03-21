import React, { useState } from 'react';
import styled from 'styled-components';
import { Checkbox } from 'antd';
import { Spin } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { useQuery } from 'react-query';
import SideBar from '../../../components/sidebar/SideBar';

import { getPlan, onAttendance } from '@/services/ScheduleService';
import { IoCloseCircleOutline } from 'react-icons/io5';

/**
 *
 * @param {*} id : 상품 등록 ID 값 new
 * @returns
 */
const ProductPlanResevationList = ({ id, open, onClose }) => {
  const {
    data: plan,
    isLoading: isPlanLoading,
    isRefetching: isPlanRefetchLoading,
    refetch,
  } = useQuery(['product-plan-item', id], () => getPlan(id), {
    enabled: !!id,
  });

  const isAllLoading = isPlanLoading || isPlanRefetchLoading;

  const sortByReservationer = (list) => {
    return list.slice().sort((a, b) => a.reservationer.localeCompare(b.reservationer));
  };

  const onClickAttendance = (reservationId, isAttendance) => {
    const param = {
      orderItemId: reservationId,
      isAttendance: !isAttendance,
    };

    onAttendance(param).then(() => {
      refetch();
    });
  };

  return (
    <SideBar open={open} onClose={onClose}>
      {isAllLoading ? (
        <Wrapper>
          <Spin />
        </Wrapper>
      ) : (
        <Wrapper>
          <div className="reservation-title-container">
            <button className="close-button">
              <IoCloseCircleOutline size={25} onClick={onClose} />
            </button>
            <div className="reservation-title">예약자 리스트</div>
          </div>

          <div className="reservation-schedule-info-container">
            <div>
              <div style={{ marginBottom: '10px', fontSize: '1.3rem' }}>
                {dayjs(plan?.startDate).locale('ko').format('YYYY-MM-DD (ddd) HH:mm')}-{dayjs(plan?.endDate).locale('ko').format('HH:mm')}
              </div>
            </div>
            <div style={{ fontSize: '1.3rem' }}>
              {plan?.title && <div>{plan?.title || '-'}</div>}
              {plan?.instructorInfo && <div> - 강사: {plan?.instructorInfo?.name || '-'}</div>}
            </div>
          </div>

          <hr className="horizontal-line" />

          <div className="reservation-number-info-container">
            <div className={`reservation-status ${plan?.reservationStatus === 'impossible' ? 'impossible' : 'possible'}`}>
              {plan?.reservationStatus === 'impossible' ? '예약불가능' : '예약가능'}
            </div>

            <div className="item">
              예약인원/정원: {plan?.currentMember || 0}/{plan?.maxMember || 0}
            </div>
          </div>
          <div className="reservation-list">
            <div className="reservation-list-item">
              <div className="reservationer-info">예약자/핸드폰번호</div>
              <div className="reservationer-number">인원</div>
              <div className="reservationer-attendance">출석체크</div>
            </div>
            {plan &&
              plan?.reservationList?.length > 0 &&
              sortByReservationer(plan.reservationList).map((reservation) => (
                <div className="reservation-list-item" key={reservation.id}>
                  <div className="reservationer-info">
                    <div className="reservationer">{reservation.reservationer}</div>
                    <div className="reservationer-hp">{reservation.reservationerHp}</div>
                  </div>
                  <div className="reservationer-number">{reservation.reservationCount}</div>
                  <div className="reservationer-attendance">
                    <Checkbox
                      checked={reservation.attendance}
                      onClick={() => onClickAttendance(reservation.id, reservation.attendance)}
                      disabled={isAllLoading}
                    />
                  </div>
                </div>
              ))}
          </div>
        </Wrapper>
      )}
    </SideBar>
  );
};

export default ProductPlanResevationList;

const Wrapper = styled.div`
  width: 100%;
  padding: 25px 0;

  display: flex;
  flex-direction: column;
  gap: 20px;

  font-size: 1.2rem;

  .reservation-title-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 30px 20px 30px;
  }

  .reservation-title {
    flex: 1; /* 확장 가능한 영역을 설정하여 가운데 정렬 */
    text-align: center;
    font-size: 1.5rem;
    font-weight: 500;
  }

  .reservation-schedule-info-container {
    margin: 0 30px;
  }

  .reservation-number-info-container {
    margin: 0 30px;
  }

  .reservation-status {
    /* border-radius: 20px;
    border: 1px solid #ccc;
    width: 70px;
    text-align: center;
    padding: 4px; */
    font-size: 1.2rem;
    margin-bottom: 10px;
  }

  .reservation-status.impossible {
    color: red; /* 예약 불가능일 때의 색상 */
  }

  .reservation-status.possible {
    color: #009ef7;
  }

  .horizontal-line {
    border: 0.5px solid #e8e7e7;
    margin: 10px 0;
  }
  .reservation-list {
    display: flex;
    flex-direction: column;

    .reservation-list-item {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;

      padding: 15px 30px;
      border-bottom: 0.5px solid #e8e7e7;

      .reservationer {
        font-size: 1.2rem;
        margin-bottom: 3px;
      }

      .reservationer-hp {
        font-size: 1.1rem;
      }
    }
  }
`;
