import React from 'react';
import { Button, Modal, Tag } from 'antd';
import Nestable from 'react-nestable';
import 'react-nestable/dist/styles/index.css';
import { Collapse } from 'antd';

import { ContentModelList } from '../../../../types';
import useReorderModalController from './reorder-modal-controller';
import DragIcon from '../../../../images/icons/drag-icon';
import ArrowRightIcon from "../../../../images/icons/arrow-right-icon";

const ReorderModal: React.FC<{
  reorderType: string;
  data: {
    id: string;
    label: string;
    position: number;
    children: ContentModelList[];
  }[];
  onReorderModalCancelClick: () => void;
}> = ({ reorderType, data, onReorderModalCancelClick }) => {
  const { Panel } = Collapse;

  const {
    t,
    reorderArrayData,
    reorderChildren,
    folderReorder,
    onSaveClick,
    collapseActiveKey,
    onCollapseActiveKeyChange,
  } = useReorderModalController(data, reorderType, onReorderModalCancelClick);
  return (
    <>
      <Modal
        visible
        centered
        title={t('common.labels.model_configure')}
        className="CustomModal CustomModal-small"
        onCancel={onReorderModalCancelClick}
        footer={[
          <div>
            <Button key="cancel" onClick={onReorderModalCancelClick}>
              {t('common.labels.cancel')}
            </Button>
            <Button key="save" type="primary" onClick={onSaveClick}>
              {t('common.labels.save')}
            </Button>
          </div>,
        ]}>
        <div className="nestable-drag-popup">
          <Nestable
            childrenProp="childrenProp"
            maxDepth={0}
            onChange={(dragItem) => {
              folderReorder(dragItem.items);
            }}
            items={reorderArrayData}
            renderItem={(renderData) => (
              <>
                <Collapse
                  activeKey={collapseActiveKey}
                  defaultActiveKey={renderData.item.id}
                  expandIcon={({ isActive }) =>
                    isActive ? (
                      <span className="anticon">
                        <ArrowRightIcon />
                      </span>
                    ) : (
                      <span className="anticon">
                        <ArrowRightIcon />
                      </span>
                    )
                  }
                  onChange={(key) => {
                    onCollapseActiveKeyChange(key);
                  }}>
                  <Panel
                    header={
                      <p className="drag-items">
                        <i>{renderData.item.label}</i>
                        <Tag color="blue">{t('common.labels.folder')}</Tag>
                        <DragIcon />
                      </p>
                    }
                    key={renderData.item.id}>
                    <Nestable
                      className="drag-items-child"
                      maxDepth={0}
                      onChange={(dragItem) => {
                        reorderChildren(dragItem.items, renderData.index);
                      }}
                      items={renderData.item.children}
                      renderItem={(data) => (
                        <>
                          <p className="drag-items">
                            <i>{data.item.name}</i>
                            <Tag color="default">
                              {!data.item.type ? 'Component' : data.item.type}
                            </Tag>
                            <DragIcon />
                          </p>
                        </>
                      )}
                    />
                  </Panel>
                </Collapse>
              </>
            )}
          />
        </div>
      </Modal>
    </>
  );
};
export default ReorderModal;
