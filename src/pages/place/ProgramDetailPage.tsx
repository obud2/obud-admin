import React from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { Tabs } from 'antd';
import EditProgram from '@/pages/place/detail/EditProgram';

const ProgramDetailPage = () => {
  const { programId, placeId } = useParams();
  const navigator = useNavigate();

  if (!programId || !placeId) {
    return null;
  }

  return (
    <React.Fragment>
      <Tabs
        defaultActiveKey="program"
        items={[
          { label: '프로그램 정보', key: 'program' },
          { label: '스케줄 관리', key: 'schedule' },
        ]}
        onChange={(key: string) => {
          if (key === 'schedule') {
            return navigator(`/pages/places/${placeId}/programs/${programId}/schedules`);
          }
        }}
      />

      {/* 플랜 상세 */}
      <EditProgram programId={programId} placeId={placeId} />
    </React.Fragment>
  );
};

export default ProgramDetailPage;
