import React, { ReactNode } from 'react';
import { Modal as AntdModel } from 'antd';

interface DeleteModalProps {
  title: string;
  isModalVisibility?: boolean;
  onOK?: () => void;
  hideModal?: () => void;
  children?: ReactNode;
  footer?: ReactNode;
  classname?: string;
  okText?: string;
  confirmLoading?: boolean;
  cancelText?: string;
  closable?: boolean;
  okButtonProps?: { style: { background: string; border: string } };
  closeIcon?:ReactNode
}

const Modal: React.FC<DeleteModalProps> = ({
  title,
  isModalVisibility,
  hideModal,
  onOK,
  children,
  footer,
  classname,
  okText,
  confirmLoading,
  cancelText,
  closable,
  okButtonProps,
  closeIcon
}) => {
  return (
    <div>
      <AntdModel
        title={title}
        centered
        okButtonProps={
          okButtonProps
            ? okButtonProps
            : {
                danger:true,
              }
        }
        open={isModalVisibility}
        onOk={onOK}
        onCancel={hideModal}
        footer={footer}
        className={classname}
        confirmLoading={confirmLoading}
        okText={okText}
        cancelText={cancelText}
        closable={closable}
        closeIcon={closeIcon}>
        {children}
      </AntdModel>
    </div>
  );
};

export default Modal;
