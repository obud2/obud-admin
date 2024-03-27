import React from 'react';

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';

import { Tabs } from 'antd';
import EditProgram from '@/pages/place/detail/EditProgram';
import ProgramSchedule from '@/pages/place/detail/ProgramSchedule';

import DataTableHeader from '../../components/dataTable/DataTableHeader';

import { getProgram } from '@/services/ProgramService';

import ProductShellTitle from './ProductShellTitle';
import { Program } from '@/entities/program';
import ProgramPass from './detail/ProgramPass';
import ProgramScheduleTitle from './detail/ProgramScheduleTitle';

const ProgramDetailPage = () => {
  const { programId, placeId } = useParams();
  const [currentTab, setCurrentTab] = useState('schedule');

  const { data: program } = useQuery(['product-lesson-detail', programId], () => getProgram(programId!), {
    enabled: !!programId,
  });

  const navigator = useNavigate();

  if (!programId || !placeId) {
    return null;
  }

  const onClickTitle = (data: Program) => {
    navigator(`/pages/places/${data?.studiosId}`);
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case 'program':
        return <EditProgram programId={programId} placeId={placeId} />;
      case 'pass':
        return <ProgramPass programId={programId} placeId={placeId} />;
      case 'schedule-title':
        return <ProgramScheduleTitle programId={programId} />;
      default:
        return <ProgramSchedule programId={programId} />;
    }
  };

  return (
    <React.Fragment>
      <DataTableHeader
        title={
          <ProductShellTitle
            title={program?.studios?.title || ''}
            subTitle={program?.title || ''}
            onClickTitle={() => onClickTitle(program)}
          />
        }
        searchDisabled
      />

      <Tabs
        defaultActiveKey="schedule"
        onChange={(key: string) => setCurrentTab(key)} // 탭 변경 시 currentTab 상태 업데이트
        items={[
          { label: '프로그램 정보', key: 'program' },
          { label: '회차명 관리', key: 'schedule-title' },
          { label: '스케줄 관리', key: 'schedule' },
          { label: '패스 설정', key: 'pass' },
        ]}
      />

      {/* 플랜 상세 */}
      {renderTabContent()}
    </React.Fragment>
  );
};

export default ProgramDetailPage;
