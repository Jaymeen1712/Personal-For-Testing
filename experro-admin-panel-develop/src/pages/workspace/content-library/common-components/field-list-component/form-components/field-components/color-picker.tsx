import React from 'react';
import { Form, Typography } from 'antd';
// import { InfoCircleOutlined } from '@ant-design/icons';
// ColorPickerValue
import { Colorpicker } from 'antd-colorpicker';

import { IContentLibraryFieldPops } from '../../../../../../../types';
import useColorPickerController from './controllers/color-picker-controller';
import CloneIcon from '../../../../../../../images/icons/clone-icon';
import { useFieldPermission } from './controllers';

interface FieldProps {
  contentModalInternalName: string;
  data: IContentLibraryFieldPops;
  componentName?: string;
}

const ColorPicker: React.FC<FieldProps> = ({
  contentModalInternalName,
  data,
  componentName,
}) => {
  const { canEditField } = useFieldPermission(
    contentModalInternalName,
    data,
    componentName
  );
  const { Paragraph } = Typography;
  const { color, onChangeComplete } = useColorPickerController(data);
  return (
    <>
      <div
        className={`color-picker-inner ${
          !data.isDataEditable || !canEditField
            ? 'table-section table-disable'
            : ''
        }`}>
        <Form.Item
          label={data.title}
          name={data.name}
          initialValue={
            data.editValue ? data.editValue : data.fieldProperties.defaultValue
          }>
          <Colorpicker
            onChangeComplete={(color) => onChangeComplete(color)}
            picker="ChromePicker"
            popup
            popoverProps={{
              overlayClassName: 'color-picker-popover',
            }}
          />
        </Form.Item>
        <p className="m-0">{color}</p>
      </div>
      <Paragraph
        className={`${
          !data.isDataEditable || !canEditField
            ? 'table-section table-disable'
            : ''
        }`}
        copyable={{
          text: color,
          tooltips: false,
          icon: <CloneIcon />,
        }}></Paragraph>
    </>
  );
};
export default ColorPicker;
