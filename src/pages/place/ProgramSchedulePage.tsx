import React, { useEffect, useState } from 'react';

import moment from 'moment';

import { useNavigate, useParams } from 'react-router-dom';

import { useQuery, useQueryClient } from 'react-query';

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
import {
  createProgramTitlePreset,
  deleteProgramTitlePreset,
  getProgram,
  getProgramTitlePresets,
  updateProgramTitlePreset,
} from '@/services/ProgramService';
import { Schedule, ScheduleTitlePreset } from '@/entities/schedule';
import { DatesSetArg } from '@fullcalendar/core';
import { Button, Input, Modal, Popconfirm, Table, Tabs, Typography } from 'antd';
import { toast } from 'react-hot-toast';
import TextArea from 'antd/es/input/TextArea';

function RegisterSchedulePresetModal({ programId, open, close }: { programId: string; open: boolean; close: () => void }) {
  const [registerPresetLoading, setRegisterPresetLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const queryClient = useQueryClient();

  const register = async () => {
    if (!title) {
      return toast.error('회차명을 입력해주세요.');
    }
    setRegisterPresetLoading(true);
    createProgramTitlePreset({ programId, title, description })
      .then(() => {
        toast.success('회차 프리셋을 추가했습니다.');
        queryClient.invalidateQueries('/program/preset');
        close();
      })
      .catch((e) => {
        toast.error(`회차 프리셋을 추가하는데 실패했습니다: ${e}`);
      })
      .finally(() => {
        setRegisterPresetLoading(false);
      });
  };

  return (
    <Modal title="회차 정보 등록" open={open} confirmLoading={registerPresetLoading} onOk={register} onCancel={close}>
      <div>
        <Typography.Title level={5}>회차명</Typography.Title>
        <Input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          showCount
          maxLength={15}
        />
      </div>
      <div style={{ paddingBottom: '12px' }}>
        <Typography.Title level={5}>회차 설명</Typography.Title>
        <TextArea
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          rows={6}
          showCount
          maxLength={200}
        />
      </div>
    </Modal>
  );
}

function UpdateSchedulePresetModal({ preset, open, close }: { preset?: ScheduleTitlePreset; open: boolean; close: () => void }) {
  const [updatePresetLoading, setUpdatePresetLoading] = useState(false);
  const [title, setTitle] = useState(preset?.title ?? '');
  const [description, setDescription] = useState(preset?.description ?? '');
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!preset) return;
    setTitle(preset.title);
    setDescription(preset.description);
  }, [preset]);

  const register = async () => {
    if (!preset) {
      return;
    }
    if (!title) {
      return toast.error('회차명을 입력해주세요.');
    }
    setUpdatePresetLoading(true);
    updateProgramTitlePreset(preset.id, { title, description })
      .then(() => {
        toast.success('회차 프리셋을 수정했습니다.');
        queryClient.invalidateQueries('/program/preset');
        close();
      })
      .catch((e) => {
        toast.error(`회차 프리셋을 수정하는데 실패했습니다: ${e}`);
      })
      .finally(() => {
        setUpdatePresetLoading(false);
      });
  };

  return (
    <Modal title="회차 정보 수정" open={open} confirmLoading={updatePresetLoading} onOk={register} onCancel={close}>
      <div>
        <Typography.Title level={5}>회차명</Typography.Title>
        <Input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          showCount
          maxLength={15}
        />
      </div>
      <div style={{ paddingBottom: '12px' }}>
        <Typography.Title level={5}>회차 설명</Typography.Title>
        <TextArea
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          rows={6}
          showCount
          maxLength={200}
        />
      </div>
    </Modal>
  );
}

const ProgramSchedulePage = () => {
  const { programId, placeId } = useParams();
  const navigator = useNavigate();

  const dateFormat = 'YYYY-MM';

  const [isOpen, setIsOpen] = useState(false);
  const [isMultiOpen, setIsMultiOpen] = useState(false);

  const [detailId, setDetailId] = useState('');
  const [reservationId, setReservationId] = useState('');
  const [preset, setPreset] = useState<ScheduleTitlePreset>();

  const [month, setMonth] = useState(moment().format(dateFormat));

  const [notiMessage, setNotiMessage] = useState('');
  const [registerPresetOpen, setRegisterPresetOpen] = useState(false);
  const [updatePresetOpen, setUpdatePresetOpen] = useState(false);

  useEffect(() => {
    if (notiMessage) {
      setTimeout(() => {
        setNotiMessage('');
      }, 2000);
    }
  }, [notiMessage]);

  const fetchData = async (id: string) => {
    const schedules = await getMonthPlans(id, month);
    return schedules.map((a) => {
      const start = moment(a.startDate).format('YYYY-MM-DD');
      const end = moment(a.endDate).format('YYYY-MM-DD');
      const startTime = moment(a.startDate).format('HH:mm');
      const endTime = moment(a.endDate).format('HH:mm');

      const currentMember = a?.currentMember || 0;
      const maxMember = a?.maxMember || 0;

      return {
        ...a,
        start,
        end,
        allDay: true,
        title: `${startTime}-${endTime} :: ${currentMember} / ${maxMember}`,
        numberOfPeople: `${currentMember} / ${maxMember}`,
      };
    });
  };

  const queryClient = useQueryClient();
  const { data: presets } = useQuery(['/program/preset', { programId }], () => getProgramTitlePresets(programId!), {
    enabled: !!programId,
  });

  const { data: studio, isLoading: isStudioLoading } = useQuery(['product-studio-detail', placeId], () => getStudio(placeId!), {
    enabled: !!placeId,
  });
  const { data: lesson, isLoading: isLessonLoading } = useQuery(['product-lesson-detail', programId], () => getProgram(programId!), {
    enabled: !!programId,
  });
  const {
    data: plan,
    isLoading: isPlanLoading,
    refetch,
  } = useQuery([`product-paln-list-${programId}`, month], () => fetchData(programId!), {
    enabled: !!programId,
  });

  const onChangeDate: (arg: DatesSetArg & { view: { getCurrentData: () => { currentDate: Date } } }) => void = (args) => {
    const currentDate = args.view.getCurrentData().currentDate;
    const formatDate = moment(currentDate).format(dateFormat);

    setMonth(formatDate);
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

  const eventContent = (eventInfo?: { event?: { title: string } }) => {
    return <div style={{ padding: 3, fontSize: 11 }}>{eventInfo?.event?.title}</div>;
  };

  const isAllLoading = isStudioLoading || isLessonLoading || isPlanLoading;

  const onDeletePreset = (presetId: number) => {
    deleteProgramTitlePreset(presetId).then(() => {
      queryClient.invalidateQueries('/program/preset');
      toast.success('삭제가 완료되었습니다.');
    });
  };

  return (
    <React.Fragment>
      <Tabs
        defaultActiveKey="schedule"
        items={[
          { label: '프로그램 정보', key: 'program' },
          { label: '스케줄 관리', key: 'schedule' },
        ]}
        onChange={(key: string) => {
          if (key === 'program') {
            return navigator(`/pages/places/${placeId}/programs/${programId}`);
          }
        }}
      />

      <DataTableHeader
        title="회차별 상세 정보 등록"
        subTitle="각 회차별 상세 정보를 입력할 때 사용합니다. 상세정보가 없으면 입력하지 않아도 됩니다."
        register={{ text: '회차 정보 추가', onClick: () => setRegisterPresetOpen(true) }}
        doSearch={() => {}}
        searchDisabled
      />

      <Table
        dataSource={presets ?? []}
        columns={[
          {
            title: '회차명',
            dataIndex: 'title',
            key: 'title',
          },
          {
            title: '상세정보',
            dataIndex: 'description',
            key: 'description',
          },
          {
            title: '등록일',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt: string) => moment(createdAt).format('YYYY-MM-DD HH:mm'),
          },
          {
            title: '수정일',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (updatedAt: string) => moment(updatedAt).format('YYYY-MM-DD HH:mm'),
          },
          {
            title: '수정',
            dataIndex: 'id',
            key: 'id',
            render: (_: number, record: ScheduleTitlePreset) => (
              <Button
                onClick={() => {
                  setPreset(record);
                  setUpdatePresetOpen(true);
                }}
              >
                수정
              </Button>
            ),
          },
          {
            title: '삭제',
            dataIndex: 'id',
            key: 'id',
            render: (id: number) => (
              <Popconfirm
                title="회차 정보를 삭제하시겠습니까?"
                description={
                  <p className="whitespace-pre-wrap">
                    - 삭제하면 회차정보를 사용하고있는 내용이 모두 삭제됩니다.
                    <br />- 삭제 후 복구가 불가합니다.
                  </p>
                }
                onConfirm={() => onDeletePreset(id)}
                okText="확인"
                cancelText="취소"
              >
                <Button>삭제</Button>
              </Popconfirm>
            ),
          },
        ]}
        rowKey="id"
        style={{ marginBottom: 20 }}
        pagination={{
          size: 'small',
          pageSize: 5,
          total: presets?.length,
        }}
      />

      <RegisterSchedulePresetModal programId={programId!} open={registerPresetOpen} close={() => setRegisterPresetOpen(false)} />
      <UpdateSchedulePresetModal preset={preset} open={updatePresetOpen} close={() => setUpdatePresetOpen(false)} />

      <DataTableHeader
        addResister={{ text: '반복등록', onClick: () => onClickMultiOpen() }}
        register={{ text: '스케줄 등록', onClick: () => setDetailId('new') }}
        title={<ProductShellTitle title={studio?.title || ''} subTitle={lesson?.title || ''} link={undefined} />}
        isLoading={isAllLoading}
        notiMessage={notiMessage}
        doSearch={() => {}}
        searchDisabled
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
        id={detailId || ''}
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
      <ProductPlanResevationList id={reservationId} open={reservationId} onClose={() => setReservationId('')} lesson={lesson} />
    </React.Fragment>
  );
};

export default ProgramSchedulePage;
