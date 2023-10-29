import React from 'react';
import { Button, Form } from 'antd';

import { IContentLibraryFieldPops } from '../../../../../../../types';
import { useFieldPermission, usePageEditor } from './controllers';
import EditerImage from '../../../../../../../images/editer-thumbnail.jpg';

interface FieldProps {
  contentModalInternalName: string;

  data: IContentLibraryFieldPops;
  componentName?: string;
}

const PageEditorComponent: React.FC<FieldProps> = ({
  contentModalInternalName,
  data,
  componentName,
}) => {
  const { onPageEditorClick, t } = usePageEditor();

  const { canEditField } = useFieldPermission(
    contentModalInternalName,
    data,
    componentName
  );

  return (
    <>
      <Form.Item
        label={data.title}
        initialValue={data.editValue}
        name={data.name}>
        <div className="library-upload single-media">
          <div className="ant-row ant-row-middle">
            <div className="ant-upload-drag-icon">
              <>
                <img src={EditerImage} alt="internationalize" />
              </>
            </div>
            <div className="">
              <p className="m-0 w-100 m-b-16">
                <small>{t('common.labels.page_editor_display_text')}</small>
              </p>
              <div className="ant-upload-hint w-100">
                <Button
                  size="small"
                  disabled={!data.isDataEditable || !canEditField}
                  type="primary"
                  onClick={() => {
                    onPageEditorClick();
                  }}>
                  {t('common.labels.visual_builder')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Form.Item>
    </>
  );
};

export default PageEditorComponent;
