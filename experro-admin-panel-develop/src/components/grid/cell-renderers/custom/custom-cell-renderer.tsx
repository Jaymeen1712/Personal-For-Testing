import { ColumnRendererPropType, RowRecord } from '../../../../types';

const CustomCellRenderer = (
  options: ColumnRendererPropType,
  text: string,
  record: object
) => {
  const {
    getText,
    getClassName,
    getIcon,
    className: optionClassName = '',
  } = options;

  const cellText = getText ? getText(record as RowRecord) : text;
  const className = getClassName ? getClassName(record as RowRecord) : '';
  const icon = getIcon ? getIcon(record as RowRecord) : null;

  return (
    <div className={`${className} ${optionClassName}`}>
      {icon && <span className="m-r-16">{icon}</span>}
      {cellText}
    </div>
  );
};

export default CustomCellRenderer;
