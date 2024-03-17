import { DataDetailItem } from '@/components/detailTable/DataDetailBody';
import { Payment } from '@/entities/payment';
import PaymentService from '@/services/PaymentService';
import { Button, InputNumber, Modal } from 'antd';
import { useState } from 'react';
import { useQueryClient } from 'react-query';
import swal from 'sweetalert';

type Props = {
  open: boolean;
  onClose: () => void;
  payment?: Payment;
};

const PaymentRefundModal = ({ open, onClose, payment }: Props) => {
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refundAmount, setRefundAmount] = useState<number>(0);

  const handleClose = () => {
    onClose();
  };

  const handleRefund = async () => {
    if (!payment) return;

    try {
      setIsLoading(true);
      await PaymentService.refundPayment({ paymentKey: payment.key, refundAmount });
      swal('환불되었습니다.');

      queryClient.invalidateQueries();
      handleClose();
    } catch (err) {
      const error = err as { data: { message: string } };

      if (payment.pass) {
        swal(error.data.message || '패스 환불에 실패하였습니다.');
      } else {
        swal(error.data.message || '단건 결제 환불에 실패하였습니다.');
      }
    } finally {
      setIsLoading(false);
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
        <Button disabled={isLoading} key="refund" type="primary" onClick={handleRefund}>
          환불
        </Button>,
        <Button disabled={isLoading} key="cancel" onClick={handleClose}>
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
            min={0}
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
