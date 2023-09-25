import React, { useEffect, useState } from 'react';

import moment from 'moment';

import { useParams } from 'react-router-dom';

import { useQuery } from 'react-query';
import ProductService from '../../services/ProductService';

import { SDataDetailBody } from '../../components/detailTable/DataDetailBody.styled';

import Calendar from '../../components/caledar/Calendar';

import DataTableHeader from '../../components/dataTable/DataTableHeader';
import OrderStatusCalendarPalnList from './status/OrderStatusCalendarPalnList';
import ProductPlanResevationList from '../product/detail/ProductPlanResevationList';

/**
 *
 * @returns 일정(Plan) 페이지
 */
const OrderStatusCalendarPage = () => {
  const { id } = useParams();

  const dateFormat = 'YYYY-MM';

  const [detailId, setDetailId] = useState('');
  const [reservationId, setReservationId] = useState('');

  const [searchFilter, setSearchFilter] = useState({ value: '', filter: '' });

  const [month, setMonth] = useState(moment().format(dateFormat));

  const [notiMessage, setNotiMessage] = useState('');

  useEffect(() => {
    if (notiMessage) {
      setTimeout(() => {
        setNotiMessage('');
      }, [2000]);
    }
  }, [notiMessage]);

  const fetchStudioData = async () => {
    return await ProductService?.getStudio(id);
  };

  const fetchLessonData = async () => {
    const res = await ProductService?.getPlanCaledar(id, month, searchFilter?.filter);

    const lessonList = [{ id: '', label: '전체' }];
    const sortDate = [];

    // 클래스 필터
    res?.lessonList?.map((a) => {
      lessonList.push({
        id: a?.id,
        label: a?.title,
      });
    });

    // 일정 필터
    Object.entries(res?.sortDate)?.map((a) => {
      const date = a?.[0];
      const item = a?.[1];

      const start = moment(date).format('YYYY-MM-DD');
      const end = moment(date).format('YYYY-MM-DD');

      sortDate?.push(
        {
          id: `${start}-0`,
          date: start,
          start,
          end,
          title: `1. 예약가능 :: ${item?.spare || 0}`,
          backgroundColor: '#34423599',
          borderColor: '#34423599',
          textColor: '#ffffff',
        },
        {
          id: `${start}-1`,
          date: start,
          start,
          end,
          title: `2. 신청 :: ${item?.current || 0}`,
          backgroundColor: '#344235',
          borderColor: '#344235',
          textColor: '#ffffff',
        },
      );
    });

    return {
      lessonList,
      sortDate,
    };
  };

  const { data: studio, isLoading: isStudioLoading } = useQuery(['order-status-studio-item', id], fetchStudioData);
  const { data, isLoading, refetch, isRefetching } = useQuery(['status-lesson-items', id, month], fetchLessonData);

  const doSearch = async (type, e) => {
    await setSearchFilter((prev) => ({ ...prev, [type]: e }));
    refetch();
  };

  const onChangeDate = async (e) => {
    const currentDate = e.view.getCurrentData().currentDate;
    const formatDate = moment(currentDate).format(dateFormat);

    await setMonth(formatDate);
    refetch();
  };

  const onDetail = (data) => {
    setDetailId({ id: data?.date || 'new' });
  };

  const eventContent = (eventInfo) => {
    return <div style={{ padding: 3, fontSize: 11 }}>{eventInfo?.event?.title}</div>;
  };

  const onResevation = (data) => {
    setReservationId(data?.id);
  };

  const isAllLoading = isStudioLoading || isLoading || isRefetching;

  return (
    <React.Fragment>
      <DataTableHeader
        title="예약현황"
        subTitle={studio?.title || ''}
        doFilter={(e) => doSearch('filter', e)}
        // filter={data?.lessonList || []}
        isLoading={isAllLoading}
        notiMessage={notiMessage}
      />

      <SDataDetailBody padding>
        <Calendar
          list={data?.sortDate || []}
          onClick={onDetail}
          onChangeDate={onChangeDate}
          eventContent={eventContent}
          isLoading={isAllLoading}
          statusHide
        />
      </SDataDetailBody>

      {/* 예약목록 */}
      <OrderStatusCalendarPalnList
        lessonId={id}
        month={detailId?.id}
        open={detailId?.id}
        onClose={() => setDetailId(false)}
        onResevation={onResevation}
      />

      {/* 예약자 현황 */}
      <ProductPlanResevationList
        id={reservationId}
        open={reservationId}
        onClose={() => setReservationId(false)}
        studio={studio}
        lesson={id}
        //
      />
    </React.Fragment>
  );
};

export default OrderStatusCalendarPage;
