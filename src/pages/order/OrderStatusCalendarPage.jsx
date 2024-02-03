import moment from 'moment';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import Calendar from '../../components/caledar/Calendar';
import DataTableHeader from '../../components/dataTable/DataTableHeader';
import { SDataDetailBody } from '../../components/detailTable/DataDetailBody.styled.tsx';
import ProductPlanResevationList from '../place/detail/ProductPlanResevationList';
import { getStudio } from '@/services/PlaceService';
import { getPlanCaledar, getPlanCaledarDayInfo } from '@/services/ScheduleService';

/**
 * @brief 일정(Plan) 페이지
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
    return await getStudio(id);
  };

  const fetchLessonData = async () => {
    const res = await getPlanCaledar(id, month, searchFilter?.filter);

    if (!res) return;

    const lessonList = [{ id: '', label: '전체' }];
    const sortDate = [];

    // 클래스 필터
    res.lessonList.map((a) => {
      lessonList.push({
        id: a?.id,
        label: a?.title,
      });
    });

    const dayDetails = await Promise.all(Object.entries(res.sortDate).map((a) => getPlanCaledarDayInfo(id, a?.[0])));

    dayDetails.forEach((details) => {
      details.forEach((detail) => {
        // detail에 planList가 없는 경우도 있음.
        detail.planList?.forEach((plan) => {
          sortDate.push({
            id: `${plan.id}`,
            date: moment(plan.startDate).format('YYYY-MM-DD'),
            start: moment(plan.startDate).format('YYYY-MM-DD'),
            startDate: plan.startDate,
            end: moment(plan.endDate).format('YYYY-MM-DD'),
            endDate: plan.endDate,
            title: `${moment(plan.startDate).format('HH:mm')} ${detail.title?.substring(0, 10)} ${plan.currentMember}/${plan.maxMember}`,
            numberOfPeople: `${plan.currentMember}/${plan.maxMember}`,
            mobileTitle: `${detail.title}`,
          });
        });
      });
    });

    return {
      lessonList,
      sortDate,
    };
  };

  const { data: studio, isLoading: isStudioLoading } = useQuery(['order-status-studio-item', id], fetchStudioData);
  const { data, isLoading, refetch, isRefetching } = useQuery(['status-lesson-items', id, month], fetchLessonData);

  const doSearch = (type, e) => {
    setSearchFilter((prev) => ({ ...prev, [type]: e }));
    refetch();
  };

  const onChangeDate = (e) => {
    const currentDate = e.view.getCurrentData().currentDate;
    const formatDate = moment(currentDate).format(dateFormat);

    setMonth(formatDate);
    refetch();
  };

  const onDetail = (data) => {
    setDetailId({ id: data?.date || 'new' });
    setReservationId(data?.id);
  };

  const eventContent = (eventInfo) => {
    return <div style={{ padding: 3, fontSize: 11, whiteSpace: 'normal' }}>{eventInfo?.event?.title}</div>;
  };

  // const onResevation = (data) => {
  //   setReservationId(data?.id);
  // };

  const isAllLoading = isStudioLoading || isLoading || isRefetching;

  return (
    <>
      <DataTableHeader
        title="예약현황"
        subTitle={studio?.title || ''}
        doFilter={(e) => doSearch('filter', e)}
        isLoading={isAllLoading}
        notiMessage={notiMessage}
      />

      <SDataDetailBody padding>
        <div className="calendar-wrapper">
          <Calendar
            list={data?.sortDate || []}
            onClick={onDetail}
            onChangeDate={onChangeDate}
            eventContent={eventContent}
            isLoading={isAllLoading}
            statusHide
          />
        </div>
      </SDataDetailBody>

      {/* 예약목록 */}
      {/* <OrderStatusCalendarPalnList
        lessonId={id}
        month={detailId?.id}
        open={detailId?.id}
        onClose={() => setDetailId(false)}
        onResevation={onResevation}
      /> */}

      {/* 예약자 현황 */}
      <ProductPlanResevationList id={reservationId} open={reservationId} onClose={() => setReservationId()} studio={studio} lesson={id} />
    </>
  );
};

export default OrderStatusCalendarPage;
