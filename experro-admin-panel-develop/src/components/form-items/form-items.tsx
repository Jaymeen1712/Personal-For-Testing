import React from 'react';

import FormItem, { FormItemProps } from './form-item';

interface FormItemsProps {
  items: FormItemProps[];
}

const FormItems: React.FC<FormItemsProps> = ({ items }) => {
  return (
    <>
      {items.map((item) =>
        item.withCustomLabel ? (
          <div key={item.name?.toString()} className="formitem-withtitle">
            <h5 className={item.required ? 'ant-form-item-required' : ''}>
              {item.label}
            </h5>
            <div className="w-480">
              <FormItem {...item} label="" promptText="" />
            </div>
            {item.promptText && <span>{item.promptText}</span>}
          </div>
        ) : (
          <div
            key={item.name?.toString()}
            className={item.promptText ? 'custom-label-input' : ''}>
            <FormItem {...item} />
            {item.promptText && (
              <span className="input-label-text">{item.promptText}</span>
            )}
          </div>
        )
      )}
    </>
  );
};

export default FormItems;
