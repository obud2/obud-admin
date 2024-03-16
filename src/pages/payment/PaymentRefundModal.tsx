import { DataDetailItem } from '@/components/detailTable/DataDetailBody';
import { Payment } from '@/entities/payment';
import PaymentService from '@/services/PaymentService';
import ReservationService from '@/services/ReservationService';
import { Button, InputNumber, Modal } from 'antd';
import { useState } from 'react';
import swal from 'sweetalert';

type Props = {
  open: boolean;
  onClose: () => void;
  payment?: Payment;
};

const PaymentRefundModal = ({ open, onClose, payment }: Props) => {
  const [refundAmount, setRefundAmount] = useState<number>(0);

  const handleClose = () => {
    onClose();
  };

  const handleRefund = async () => {
    if (!payment) return;

    if (payment.pass) {
      // 패스 환불
      // TODO: fix payment.pass.id to payment.userPassId
      try {
        await PaymentService.refundUserPassPayment({ userPassId: payment.pass.id, refundAmount });
        swal('패스가 환불되었습니다.');
      } catch (err) {
        swal('패스 환불에 실패하였습니다.');
      }
    } else {
      // 단건 결제 환불
      try {
        await ReservationService.orderCancelCheck({
          orderItemId: payment.key,
          cancelAmount: refundAmount,
        });
        swal('단건 결제가 환불되었습니다.');
      } catch (err) {
        swal('단건 결제 환불에 실패하였습니다.');
      }
    }
  };

  if (!payment) return null;

  return (
    <Modal
      title={payment.pass ? '패스 환불' : '단건 결제 환불'}
      open={open && !!payment}
      onCancel={handleClose}
      destroyOnClose
      footer={[
        <Button key="refund" onClick={handleRefund}>
          환불
        </Button>,
        <Button key="cancel" onClick={handleClose}>
          취소
        </Button>,
      ]}
    >
      <div>
        <DataDetailItem label="결제금액">
          <InputNumber
            addonAfter="원"
            placeholder="숫자만 입력하세요."
            value={payment.payAmount}
            formatter={(value) => `${value}`.toLocaleString()}
            disabled
          />
        </DataDetailItem>
        <DataDetailItem label="환불금액">
          <InputNumber
            addonAfter="원"
            placeholder="숫자만 입력하세요."
            min={1}
            max={payment.payAmount}
            value={refundAmount}
            formatter={(value) => `${value}`.toLocaleString()}
            onChange={(e) => setRefundAmount(e ?? 0)}
          />
        </DataDetailItem>
      </div>
    </Modal>
  );
};

export default PaymentRefundModal;
