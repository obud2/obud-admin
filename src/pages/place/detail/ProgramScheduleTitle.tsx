import React, { useEffect, useState } from 'react';

import { useQuery, useQueryClient } from 'react-query';

import DataTableHeader from '@/components/dataTable/DataTableHeader';

import {
  createProgramTitlePreset,
  deleteProgramTitlePreset,
  getProgramTitlePresets,
  updateProgramTitlePreset,
} from '@/services/ProgramService';

import { ScheduleTitlePreset } from '@/entities/schedule';
import { Button, Input, Modal, Popconfirm, Table, Typography } from 'antd';
import { toast } from 'react-hot-toast';
import TextArea from 'antd/es/input/TextArea';

function RegisterSchedulePresetModal({ programId, open, close }: { programId: string; open: boolean; close: () => void }) {
  const [registerPresetLoading, setRegisterPresetLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const queryClient = useQueryClient();

  const reset = () => {
    setTitle('');
    setDescription('');
  };

  const register = async () => {
    if (!title) {
      return toast.error('회차명을 입력해주세요.');
    }
    setRegisterPresetLoading(true);
    createProgramTitlePreset({ programId, title, description })
      .then(() => {
        toast.success('회차 프리셋을 추가했습니다.');
        queryClient.invalidateQueries('/program/preset');
        reset();
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
          maxLength={30}
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
          maxLength={30}
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

const ProgramScheduleTitle = ({ programId }: { programId: string }) => {
  const [preset, setPreset] = useState<ScheduleTitlePreset>();

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

  const queryClient = useQueryClient();
  const { data: presets } = useQuery(['/program/preset', { programId }], () => getProgramTitlePresets(programId!), {
    enabled: !!programId,
  });

  const onDeletePreset = (presetId: number) => {
    deleteProgramTitlePreset(presetId).then(() => {
      queryClient.invalidateQueries('/program/preset');
      toast.success('삭제가 완료되었습니다.');
    });
  };

  return (
    <React.Fragment>
      <DataTableHeader
        title=""
        subTitle="각 회차별 상세 정보를 입력할 때 사용합니다. 상세정보가 없으면 입력하지 않아도 됩니다."
        register={{ text: '회차 정보 추가', onClick: () => setRegisterPresetOpen(true) }}
        searchDisabled
      />

      <Table
        dataSource={presets ?? []}
        columns={[
          {
            title: '회차명',
            dataIndex: 'title',
            key: 'title',
            width: '15%',
          },
          {
            title: '상세정보',
            dataIndex: 'description',
            key: 'description',
            width: '70%',
          },

          {
            title: '수정',
            dataIndex: 'id',
            key: 'id',
            width: 30,
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
            width: 30,
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
        locale={{
          emptyText: '회차 정보를 등록해주세요',
        }}
      />

      <RegisterSchedulePresetModal programId={programId!} open={registerPresetOpen} close={() => setRegisterPresetOpen(false)} />
      <UpdateSchedulePresetModal preset={preset} open={updatePresetOpen} close={() => setUpdatePresetOpen(false)} />
    </React.Fragment>
  );
};

export default ProgramScheduleTitle;
