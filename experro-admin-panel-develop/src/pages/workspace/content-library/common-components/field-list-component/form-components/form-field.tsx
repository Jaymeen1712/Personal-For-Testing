import React from 'react';

import TextComponent from './field-components/text-component';
import SingleMedia from './field-components/single-media';
import BooleanComponent from './field-components/boolean-component';
import RichTextComponent from './field-components/rich-text-component';
import EmailComponent from './field-components/email-component';
import JsonComponent from './field-components/json-component';
import PasswordComponent from './field-components/password-component';
import SelectComponent from './field-components/select-component';
import UidComponent from './field-components/uid-component';
import NumberComponent from './field-components/number-component';
import MultiSelectComponent from './field-components/multi-select-component';
import DateComponent from './field-components/date-component';
import CurrencyComponent from './field-components/currency-component';
import MultiMedia from './field-components/multi-media';
import PageEditorComponent from './field-components/page-editor-component';
import RelationComponent from './field-components/relation-component';
import ColorPicker from './field-components/color-picker';
import Script from './field-components/script';
import StyleComponent from './field-components/style-component';
import useFormFiledController from './form-filed-controller';
import DynamicLink from './field-components/dynamic-link';
import { IContentLibraryFieldPops } from '../../../../../../types';

const FormField: React.FC<{
  contentModalInternalName: string;
  type?: string;
  props: IContentLibraryFieldPops;
  componentName?: string;
  isViewContentInPopupOpen?: boolean;
}> = ({
  contentModalInternalName,
  type,
  props,
  componentName,
  isViewContentInPopupOpen,
}) => {
  const { canReadOrUpdate } = useFormFiledController(
    contentModalInternalName,
    props,
    componentName
  );
  return (
    <>
      {canReadOrUpdate && (
        <>
          {type === 'text' && (
            <TextComponent
              contentModalInternalName={contentModalInternalName}
              data={props}
              componentName={componentName}
            />
          )}
          {type === 'media' &&
            (props.fieldProperties.mediaRadioButton === 'singleMedia' ? (
              <SingleMedia
                contentModalInternalName={contentModalInternalName}
                data={props}
                componentName={componentName}
                isViewContentInPopupOpen={isViewContentInPopupOpen}
              />
            ) : (
              <MultiMedia
                contentModalInternalName={contentModalInternalName}
                data={props}
                componentName={componentName}
                isViewContentInPopupOpen={isViewContentInPopupOpen}
              />
            ))}
          {type === 'email' && (
            <EmailComponent
              contentModalInternalName={contentModalInternalName}
              data={props}
              componentName={componentName}
            />
          )}
          {type === 'boolean' && (
            <BooleanComponent
              contentModalInternalName={contentModalInternalName}
              data={props}
              componentName={componentName}
            />
          )}
          {type === 'rich-text' && (
            <RichTextComponent
              contentModalInternalName={contentModalInternalName}
              data={props}
              componentName={componentName}
            />
          )}
          {type === 'json' && (
            <JsonComponent
              contentModalInternalName={contentModalInternalName}
              data={props}
              componentName={componentName}
            />
          )}
          {type === 'password' && (
            <PasswordComponent
              contentModalInternalName={contentModalInternalName}
              data={props}
              componentName={componentName}
            />
          )}
          {type === 'select' && (
            <SelectComponent
              contentModalInternalName={contentModalInternalName}
              data={props}
              componentName={componentName}
            />
          )}
          {type === 'multi-select' && (
            <MultiSelectComponent
              contentModalInternalName={contentModalInternalName}
              data={props}
              componentName={componentName}
            />
          )}
          {type === 'uid' && (
            <UidComponent
              contentModalInternalName={contentModalInternalName}
              data={props}
              componentName={componentName}
            />
          )}
          {type === 'number' && (
            <NumberComponent
              contentModalInternalName={contentModalInternalName}
              data={props}
              componentName={componentName}
            />
          )}
          {type === 'date' && (
            <DateComponent
              contentModalInternalName={contentModalInternalName}
              data={props}
              componentName={componentName}
            />
          )}
          {type === 'currency' && (
            <CurrencyComponent
              contentModalInternalName={contentModalInternalName}
              data={props}
              componentName={componentName}
            />
          )}
          {type === 'page-editor' && !isViewContentInPopupOpen && (
            <PageEditorComponent
              contentModalInternalName={contentModalInternalName}
              data={props}
              componentName={componentName}
            />
          )}
          {type === 'relation' && (
            <RelationComponent
              contentModalInternalName={contentModalInternalName}
              data={props}
              componentName={componentName}
            />
          )}
          {type === 'json-text' && (
            <JsonComponent
              contentModalInternalName={contentModalInternalName}
              data={props}
              componentName={componentName}
            />
          )}
          {type === 'color-picker' && (
            <div className="color-picker color-picker-240">
              <ColorPicker
                contentModalInternalName={contentModalInternalName}
                data={props}
                componentName={componentName}
              />
            </div>
          )}
          {type === 'script' && (
            <Script
              contentModalInternalName={contentModalInternalName}
              data={props}
              componentName={componentName}
            />
          )}
          {type === 'style' && (
            <StyleComponent
              contentModalInternalName={contentModalInternalName}
              data={props}
              componentName={componentName}
            />
          )}
          {type === 'link-record' && (
            <DynamicLink
              contentModalInternalName={contentModalInternalName}
              data={props}
              componentName={componentName}
            />
          )}
        </>
      )}
    </>
  );
};
export default FormField;
