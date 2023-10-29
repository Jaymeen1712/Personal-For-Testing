import React from 'react';
import { ColumnRendererPropType, RowRecord } from '../../../../types';
import { Popover } from 'antd';

const popoverCellRenderer = (
  options: ColumnRendererPropType,
  text: string,
  record: object
) => {
  const { key, popoverContent, onPopoverButtonClick, getText, showPopover } =
    options;
  const popoverVisible = showPopover ? showPopover(record as RowRecord) : true;
  const cellText = getText ? getText(record as RowRecord) : text;

  if (!popoverVisible) return <div className="gray-text">{cellText}</div>;

  return (
    <div
      className="cursor-pointer"
      onMouseOver={() => {
        onPopoverButtonClick &&
          onPopoverButtonClick((record as RowRecord)[key || 'id']);
      }}>
      <Popover placement="bottomRight" content={popoverContent}>
        {cellText}
      </Popover>
    </div>
  );
};

export default popoverCellRenderer;
