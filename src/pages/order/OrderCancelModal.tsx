import { DataDetailItem } from '@/components/detailTable/DataDetailBody';
import { Reservation } from '@/entities/reservation';
import { PassService } from '@/services/PassService';
import PaymentService from '@/services/PaymentService';
import { Button, InputNumber, Modal } from 'antd';
import { useState } from 'react';
import { useQueryClient } from 'react-query';
import swal from 'sweetalert';

type Props = {
  open: boolean;
  onClose: () => void;
  reservation?: Reservation;
};

const OrderCancelModal = ({ open, onClose, reservation }: Props) => {
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refundAmount, setRefundAmount] = useState<number>(0);

  const handleClose = () => {
    onClose();
  };

  const handleRefund = async () => {
    if (!reservation) return;

    setIsLoading(true);

    if (reservation.payment.merchandiseType === 'PASS' && reservation.payment.pass?.userPassId) {
      // 페스 예약 취소
      try {
        await PassService.cancelUserPass({ userPassId: reservation.payment.pass.userPassId });
        swal('패스 예약이 취소되었습니다.');
        queryClient.invalidateQueries();
        handleClose();
      } catch (err) {
        const error = err as { data: { message: string } };
        swal(error.data.message || '패스 예약 취소에 실패했습니다.');
      }
    } else {
      // 단건 예약 취소
      try {
        await PaymentService.refundPayment({ paymentKey: reservation.payment.key, refundAmount });
        swal('단건 결제 예약이 취소되었습니다. (환불 완료).');
        queryClient.invalidateQueries();
        handleClose();
      } catch (err) {
        const error = err as { data: { message: string } };
        swal(error.data.message || '단건 결제 예약 취소에 실패했습니다.');
      }
    }
    setIsLoading(false);
  };

  if (!reservation) return null;

  return (
    <Modal
      title={reservation.payment.merchandiseType === 'PASS' ? '패스 예약 취소' : '단건 결제 예약 취소(환불)'}
      open={open && !!reservation}
      onCancel={handleClose}
      destroyOnClose
      footer={[
        <Button disabled={isLoading} key="refund" type="primary" onClick={handleRefund}>
          예약 취소
        </Button>,
        <Button disabled={isLoading} key="cancel" onClick={handleClose}>
          닫기
        </Button>,
      ]}
    >
      <div>
        {reservation.payment.merchandiseType !== 'PASS' && (
          <>
            <DataDetailItem label="결제금액">
              <InputNumber
                addonAfter="원"
                placeholder="숫자만 입력하세요."
                value={reservation.payment.payAmount}
                formatter={(value) => `${value}`.toLocaleString()}
                disabled
              />
            </DataDetailItem>
            <DataDetailItem label="환불금액">
              <InputNumber
                addonAfter="원"
                placeholder="숫자만 입력하세요."
                min={1}
                max={reservation.payment.payAmount}
                value={refundAmount}
                formatter={(value) => `${value}`.toLocaleString()}
                onChange={(e) => setRefundAmount(e ?? 0)}
              />
            </DataDetailItem>
          </>
        )}
        <div style={{ padding: '12px' }}>
          <div>정말로 예약을 취소하시겠습니까?</div>
          <ul>
            <li>취소 후 복구가 불가합니다.</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default OrderCancelModal;
