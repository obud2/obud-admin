import { useNavigate, useParams } from 'react-router-dom';

import { Place } from '@/entities/place';
import { PassService } from '@/services/PassService';
import { Button, Checkbox } from 'antd';
import { useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';
import { Pass } from '@/entities/pass';
import { useEffect, useState } from 'react';
import swal from 'sweetalert';

const ProgramPass = ({ programId, placeId }: { programId: string; placeId: string }) => {
  const queryClient = useQueryClient();
  const navigator = useNavigate();

  const [selectedPasses, setSelectedPasses] = useState<Pass['id'][]>([]);

  const { data: availablePasses } = useAvailable(placeId || '');
  const { data: registeredPasses } = useRegisteredPasses(programId || '');

  useEffect(() => {
    if (registeredPasses) {
      setSelectedPasses(registeredPasses.map((pass) => pass.id));
    }
  }, [registeredPasses]);

  if (!programId || !placeId || !availablePasses) return null;

  const handleSave = async () => {
    try {
      await PassService.createPassForProgram({ programId, passIds: selectedPasses });
      queryClient.invalidateQueries();
      swal('저장되었습니다');
    } catch (e) {
      swal('저장에 실패했습니다');
    }
  };

  return (
    <>
      <Wrapper>
        <Notice>패스 선택 시 선택한 패스로 프로그램을 예약할 수 있습니다.</Notice>
        {availablePasses.length === 0 && (
          <div>
            <RegisterPass>등록된 패스가 없습니다. 패스를 등록하러 가시겠습니까?</RegisterPass>
            <Button type="primary" onClick={() => navigator('/pages/pass-list')}>
              패스 등록
            </Button>
          </div>
        )}
        {availablePasses.length > 0 && (
          <div>
            <Checkbox
              style={{ marginBottom: 4, fontWeight: 'bold' }}
              checked={selectedPasses.length === availablePasses.length}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedPasses(availablePasses.map((pass) => pass.id));
                } else {
                  setSelectedPasses([]);
                }
              }}
            >
              전체선택
            </Checkbox>
            {availablePasses.map((pass) => (
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

export default ProgramPass;

const useAvailable = (placeId: Place['id']) => {
  return useQuery(['availablePasses', placeId], () => PassService.listPasses({ placeId }), {
    enabled: !!placeId,
    select: (data) => data?.value,
  });
};

const useRegisteredPasses = (programId: string) => {
  return useQuery(['registeredPasses', programId], () => PassService.listPassesForProgram({ programId }), {
    enabled: !!programId,
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
