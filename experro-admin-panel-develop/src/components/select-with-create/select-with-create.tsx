import { Button, Select, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import React, { useEffect, useState } from 'react';
import PlusIcon from "../../images/icons/plus-icon";

const SelectWithCreate: React.FC<SelectProps> = (props) => {
  const { options, value, onChange } = props;
  const [searchText, setSearchText] = useState('');
  const [items, setItems] = useState<DefaultOptionType[] | undefined>(options);
  const [isOpen, setIsOpen] = useState(false);
  const parentNameRxjs = new RegExp(/^[ A-Za-z0-9]*$/i);
  const [isAddButtonVisible, setIsAddButtonVisible] = useState(false);

  const addItem = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (options?.length === items?.length) {
      items?.push({
        label: searchText,
        value: searchText,
      });
    } else {
      items?.splice(items.length - 1, 1, {
        label: searchText,
        value: searchText,
      });
    }
    setItems(items);
    setSearchText('');
    onChange && onChange(searchText, { label: searchText, value: searchText });
    setIsOpen(false);
  };

  useEffect(() => {
    setIsOpen(false);
  }, [value]);

  useEffect(() => {
    setSearchText('');
  }, [props.options]);

  return (
    <Select
      {...props}
      options={items}
      style={{ minWidth: '100px' }}
      open={isOpen}
      value={value}
      onDropdownVisibleChange={(visible) => setIsOpen(visible)}
      onSelect={(selValue: string) => {
        onChange && onChange(selValue, { label: selValue, value: selValue });
      }}
      showSearch={true}
      optionFilterProp={'label'}
      notFoundContent={
        <>
          <Button
            type="link"
            className="text-blue"
            icon={<PlusIcon />}
            onClick={addItem}
            disabled={isAddButtonVisible}>
            Add item
          </Button>
        </>
      }
      onSearch={(value) => {
        if (!parentNameRxjs.test(value)) {
          setIsAddButtonVisible(true);
        } else {
          setIsAddButtonVisible(false);
          setSearchText(value);
        }
      }}
    />
  );
};

export default SelectWithCreate;
