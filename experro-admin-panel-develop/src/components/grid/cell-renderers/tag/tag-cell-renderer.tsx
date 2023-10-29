import { Tag } from 'antd';

import { ColumnRendererPropType, RowRecord } from '../../../../types';

const tagCellRenderer = (
  options: ColumnRendererPropType,
  text: string,
  record: object
) => {
  const color = options.getColor ? options.getColor(record as RowRecord) : '';
  const tagText = options.getText ? options.getText(record as RowRecord) : text;

  return <Tag color={color}>{tagText}</Tag>;
};

export default tagCellRenderer;
