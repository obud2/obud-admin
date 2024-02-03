// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useEffect, useState } from 'react';

import moment from 'moment';

import { useParams } from 'react-router-dom';

import { useQuery } from 'react-query';

import ProductShellTitle from './ProductStudio';
import ProductPlanDetail from './detail/ProductPlanDetail';

import { SDataDetailBody } from '@/components/detailTable/DataDetailBody.styled';

import Calendar from '../../components/caledar/Calendar';

import ProductPlanList from './detail/ProductPlanList';
import ProductPlanResevationList from './detail/ProductPlanResevationList';
import ProductPlanMultiDetail from './detail/ProductPlanMultiDetail';

import DataTableHeader from '../../components/dataTable/DataTableHeader';
import { getLesson, getMonthPlans, getStudio } from '@/services/PlaceService';

const ProgramDetailPage = () => {
  const { id, studioId } = useParams();

  const dateFormat = 'YYYY-MM';

  const [isOpen, setIsOpen] = useState(false);
  const [isMultiOpen, setIsMultiOpen] = useState(false);

  const [detailId, setDetailId] = useState('');
  const [reservationId, setReservationId] = useState('');

  const [month, setMonth] = useState(moment().format(dateFormat));

  const [notiMessage, setNotiMessage] = useState('');

  useEffect(() => {
    if (notiMessage) {
      setTimeout(() => {
        setNotiMessage('');
      }, 2000);
    }
  }, [notiMessage]);

  const fetchData = async () => {
    if (!studioId) return;
    const res = await getMonthPlans(studioId, month);
    const list = res?.value || [];

    list.forEach((a) => {
      const start = moment(a.startDate).format('YYYY-MM-DD');
      const end = moment(a.endDate).format('YYYY-MM-DD');
      const startTime = moment(a.startDate).format('HH:mm');
      const endTime = moment(a.endDate).format('HH:mm');

      const currentMember = a?.currentMember || 0;
      const maxMember = a?.maxMember || 0;

      a.start = start;
      a.end = end;
      a.allDay = true;
      a.title = `${startTime}-${endTime} :: ${currentMember} / ${maxMember}`;
      a.numberOfPeople = `${currentMember} / ${maxMember}`;
    });

    return list;
  };

  const { data: studio, isLoading: isStudioLoading } = useQuery(['product-studio-detail', id], () => getStudio(id));
  const { data: lesson, isLoading: isLessonLoading } = useQuery(['product-lesson-detail', studioId], () => getLesson(studioId));
  const { data: plan, isLoading: isPlanLoading, refetch } = useQuery([`product-paln-list-${studioId}`, month], () => fetchData());

  const onChangeDate = async (e) => {
    const currentDate = e.view.getCurrentData().currentDate;
    const formatDate = moment(currentDate).format(dateFormat);

    await setMonth(formatDate);
    refetch();
  };

  const onClickMultiOpen = () => {
    setIsMultiOpen(true);
  };

  const onDetail = (_, info) => {
    setDetailId({ id: info || 'new' });
  };

  const onList = () => {
    setIsOpen(true);
  };

  const onDetailClose = (refresh) => {
    if (refresh) refetch();

    setDetailId('');
  };

  const onMultiPlanClose = (refresh) => {
    if (refresh) refetch();

    setIsMultiOpen(false);
  };

  const eventContent = (eventInfo) => {
    return <div style={{ padding: 3, fontSize: 11 }}>{eventInfo?.event?.title}</div>;
  };

  const isAllLoading = isStudioLoading || isLessonLoading || isPlanLoading;

  return (
    <React.Fragment>
      <DataTableHeader
        addResister={{ text: '반복등록', onClick: () => onClickMultiOpen() }}
        resister={{ text: '스케줄 등록', onClick: () => onDetail() }}
        title={<ProductShellTitle title={studio?.title || ''} subTitle={lesson?.title || ''} />}
        isLoading={isAllLoading}
        notiMessage={notiMessage}
      />

      <SDataDetailBody padding>
        <div className="calendar-wrapper">
          <Calendar
            list={plan || []}
            resister={{ text: '일정보기', onClick: () => onList() }}
            eventContent={eventContent}
            onClick={onDetail}
            onChangeDate={onChangeDate}
            isLoading={isAllLoading}
          />
        </div>
      </SDataDetailBody>

      {/* 일정보기 리스트 */}
      <ProductPlanList
        lessonId={lesson?.id || ''}
        data={plan}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        month={month}
        onDetail={onDetail}
        setNotiMessage={setNotiMessage}
        refetch={refetch}
      />

      {/* 플랜 상세 */}
      <ProductPlanDetail
        id={detailId?.id || ''}
        lessonId={lesson?.id || ''}
        open={detailId}
        onClose={() => onDetailClose(false)}
        refetch={() => onDetailClose(true)}
      />

      {/* 플랜 반복 등록 */}
      <ProductPlanMultiDetail
        open={isMultiOpen}
        onClose={() => onMultiPlanClose(false)}
        refetch={() => onMultiPlanClose(true)}
        lessonId={lesson?.id || ''}
      />

      {/* 예약자 현황 */}
      <ProductPlanResevationList
        id={reservationId}
        open={reservationId}
        onClose={() => setReservationId()}
        studio={studio}
        lesson={lesson}
        //
      />
    </React.Fragment>
  );
};

export default ProgramDetailPage;
