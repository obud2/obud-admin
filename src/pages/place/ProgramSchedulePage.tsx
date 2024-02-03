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
import { getStudio } from '@/services/PlaceService';
import { getMonthPlans } from '@/services/ScheduleService';
import { getProgram } from '@/services/ProgramService';
import { Schedule } from '@/entities/schedule';
import { DatesSetArg } from '@fullcalendar/core';

const ProgramSchedulePage = () => {
  const { id, studioId } = useParams();

  const dateFormat = 'YYYY-MM';

  const [isOpen, setIsOpen] = useState(false);
  const [isMultiOpen, setIsMultiOpen] = useState(false);

  const [detailId, setDetailId] = useState<string>('');
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

  const fetchData = async (placeId: string) => {
    const list = await getMonthPlans(placeId, month);
    return list.map((it) => {
      const start = moment(it.startDate).format('YYYY-MM-DD');
      const end = moment(it.endDate).format('YYYY-MM-DD');
      const startTime = moment(it.startDate).format('HH:mm');
      const endTime = moment(it.endDate).format('HH:mm');

      const currentMember = it?.currentMember || 0;
      const maxMember = it?.maxMember || 0;
      return {
        ...it,
        start,
        end,
        allDay: true,
        title: `${startTime}-${endTime} :: ${currentMember} / ${maxMember}`,
        numberOfPeople: `${currentMember} / ${maxMember}`,
      };
    });
  };

  const { data: studio, isLoading: isStudioLoading } = useQuery(['product-studio-detail', id], () => getStudio(id!), {
    enabled: !!id,
  });
  const { data: lesson, isLoading: isLessonLoading } = useQuery(['product-lesson-detail', studioId], () => getProgram(studioId!), {
    enabled: !!studioId,
  });
  const {
    data: plans,
    isLoading: isPlanLoading,
    refetch,
  } = useQuery([`product-paln-list-${studioId}`, month], () => fetchData(studioId!), {
    enabled: !!studioId,
  });

  const onChangeDate = async (e: DatesSetArg & { view: { getCurrentData: () => { currentDate: string } } }) => {
    const currentDate = e.view.getCurrentData().currentDate;
    const formatDate = moment(currentDate).format(dateFormat);

    await setMonth(formatDate);
    refetch();
  };

  const onClickMultiOpen = () => {
    setIsMultiOpen(true);
  };

  const onDetail = (schedule: Schedule, id: string) => {
    setDetailId(id || 'new');
  };

  const onList = () => {
    setIsOpen(true);
  };

  const onDetailClose = (refresh: boolean) => {
    if (refresh) refetch();

    setDetailId('');
  };

  const onMultiPlanClose = (refresh: boolean) => {
    if (refresh) refetch();

    setIsMultiOpen(false);
  };

  const eventContent = (eventInfo?: {
    event?: {
      title: string;
    };
  }) => {
    return <div style={{ padding: 3, fontSize: 11 }}>{eventInfo?.event?.title}</div>;
  };

  const isAllLoading = isStudioLoading || isLessonLoading || isPlanLoading;

  return (
    <React.Fragment>
      <DataTableHeader
        addResister={{ text: '반복등록', onClick: () => onClickMultiOpen() }}
        resister={{ text: '스케줄 등록', onClick: () => setDetailId('new') }}
        title={<ProductShellTitle title={studio?.title || ''} subTitle={lesson?.title || ''} link={undefined} />}
        isLoading={isAllLoading}
        notiMessage={notiMessage}
        doSearch={() => {}}
      />

      <SDataDetailBody padding>
        <div className="calendar-wrapper">
          <Calendar
            list={plans || []}
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
        data={plans}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        month={month}
        onDetail={onDetail}
        setNotiMessage={setNotiMessage}
        refetch={refetch}
      />

      {/* 플랜 상세 */}
      <ProductPlanDetail
        id={detailId}
        lessonId={lesson?.id || ''}
        open={!!detailId}
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
      <ProductPlanResevationList id={reservationId} open={!!reservationId} onClose={() => setReservationId('')} lesson={lesson} />
    </React.Fragment>
  );
};

export default ProgramSchedulePage;
