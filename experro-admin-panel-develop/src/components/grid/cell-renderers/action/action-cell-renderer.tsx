import { Button } from 'antd';

import EditIcon from '../../../../images/icons/edit-icon';
import DeleteIcon from '../../../../images/icons/delete-icon';
import { ColumnRendererPropType, RowRecord } from '../../../../types';

const ActionCellRenderer = (
  options: ColumnRendererPropType,
  text: string,
  record: object
) => {
  const {
    onEdit,
    onDelete,
    getClassName,
    isEditable,
    isRemovable,
    className: propClassName = '',
  } = options;

  const className = getClassName
    ? getClassName(record as RowRecord)
    : propClassName;

  const editable = isEditable && isEditable(record as RowRecord);
  const removable = isRemovable && isRemovable(record as RowRecord);
  return (
    //TODO Change in is_editable and is_removeble condition after flush data
    <div className={`ant-row ${className}`}>
      {onEdit && (
        <Button
          className={`onlyIcon ${
            editable || editable === undefined || editable === true
              ? ''
              : 'display-none'
          }`}
          onClick={() => onEdit(record as RowRecord)}
          icon={<EditIcon />}
        />
      )}
      {onDelete && (
        <Button
          className={`onlyIcon ${
            removable || removable === undefined || removable === true
              ? ''
              : 'display-none'
          }`}
          onClick={() => onDelete(record as RowRecord)}
          icon={<DeleteIcon />}
        />
      )}
    </div>
  );
};

export default ActionCellRenderer;
