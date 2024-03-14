import { useNavigate, useParams } from 'react-router-dom';

import { Place } from '@/entities/place';
import { PassService } from '@/services/PassService';
import { Button, Checkbox, Tabs } from 'antd';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { Pass } from '@/entities/pass';
import { useState } from 'react';
import swal from 'sweetalert';

const ProgramPassPage = () => {
  const { programId, placeId } = useParams();
  const navigator = useNavigate();

  const [selectedPasses, setSelectedPasses] = useState<Pass['id'][]>([]);

  const { data: passes } = usePasses(placeId || '');

  if (!programId || !placeId || !passes) return null;

  const handleSave = async () => {
    try {
      await PassService.createPassForProgram({ programId, passIds: selectedPasses });
      swal('저장되었습니다');
    } catch (e) {
      swal('저장에 실패했습니다');
    }
  };

  return (
    <>
      <Tabs
        defaultActiveKey="pass"
        items={[
          { label: '프로그램 정보', key: 'program' },
          { label: '스케줄 관리', key: 'schedule' },
          { label: '패스 설정', key: 'pass' },
        ]}
        onChange={(key: string) => {
          if (key === 'program') {
            return navigator(`/pages/places/${placeId}/programs/${programId}`);
          } else if (key === 'schedule') {
            return navigator(`/pages/places/${placeId}/programs/${programId}/schedules`);
          }
        }}
      />

      <Wrapper>
        <Notice>패스 선택 시 선택한 패스로 프로그램을 예약할 수 있습니다.</Notice>
        {passes.length === 0 && (
          <div>
            <RegisterPass>등록된 패스가 없습니다. 패스를 등록하러 가시겠습니까?</RegisterPass>
            <Button type="primary" onClick={() => navigator('/pages/pass-list')}>
              패스 등록
            </Button>
          </div>
        )}
        {passes.length > 0 && (
          <div>
            <Checkbox
              style={{ marginBottom: 4, fontWeight: 'bold' }}
              checked={selectedPasses.length === passes.length}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedPasses(passes.map((pass) => pass.id));
                } else {
                  setSelectedPasses([]);
                }
              }}
            >
              전체선택
            </Checkbox>
            {passes.map((pass) => (
              <div key={pass.id}>
                <Checkbox
                  checked={selectedPasses.includes(pass.id)}
                  value={pass.id}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPasses([...selectedPasses, pass.id]);
                    } else {
                      setSelectedPasses(selectedPasses.filter((id) => id !== pass.id));
                    }
                  }}
                >
                  {pass.title} - ({pass.durationInDays}일)
                </Checkbox>
              </div>
            ))}
            <ButtonWrapper>
              <Button onClick={handleSave}>저장</Button>
            </ButtonWrapper>
          </div>
        )}
      </Wrapper>
    </>
  );
};

export default ProgramPassPage;

const usePasses = (placeId: Place['id']) => {
  return useQuery(['passes', placeId], () => PassService.listPasses({ placeId }), {
    enabled: !!placeId,
    select: (data) => data?.value,
  });
};

const Wrapper = styled.div`
  padding: 20px;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
`;

const RegisterPass = styled.div`
  margin-bottom: 20px;
  font-size: 14px;
  color: #999;
`;

const Notice = styled.div`
  margin-bottom: 20px;
  font-size: 14px;
  color: black;
`;

const ButtonWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;
