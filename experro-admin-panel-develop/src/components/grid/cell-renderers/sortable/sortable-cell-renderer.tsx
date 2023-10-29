import React from 'react';
import { SortableHandle } from 'react-sortable-hoc';
import { HolderOutlined } from '@ant-design/icons';

import { ColumnRendererPropType, RowRecord } from '../../../../types';

const sortableCellRenderer = (
  options: ColumnRendererPropType,
  text: string,
  record: object
) => {
  const { canSort } = options;

  const DragHandle = SortableHandle(() => (
    <HolderOutlined style={{ cursor: 'grab', color: '#999' }} />
  ));

  return canSort && canSort(record as RowRecord) ? <DragHandle /> : <></>;
};
export default sortableCellRenderer;
