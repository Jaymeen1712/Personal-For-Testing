import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Dropdown, Menu } from 'antd';

import { ColumnRendererPropType, RowRecord } from '../../../../types';
import EllipsisIcon from '../../../../images/icons/ellipsis-icon';

const menuCellRenderer = (
  options: ColumnRendererPropType,
  text: string,
  record: object
) => {
  const { key, menuList, getText, getLink, className = '' } = options;

  const cellText = getText ? getText(record as RowRecord) : text;

  const link = getLink ? getLink(record as RowRecord) : '';

  return (
    <div
      className={`ant-row ant-row-middle ant-row-no-wrap ant-row-space-between`}>
      <div className={`${className}`}>
        {link ? <Link to={link}>{cellText}</Link> : cellText}
      </div>
      {menuList && menuList?.length > 0 && (
        <Dropdown
          placement="bottomRight"
          trigger={['click']}
          overlay={
            <div className="table-dropdown">
              <Menu>
                {menuList?.map((item) => (
                  <Menu.Item key={item.key}>
                    <Button
                      className={item.className}
                      type="text"
                      key={item.key}
                      onClick={() =>
                        item.onClick(
                          (record as RowRecord)[key || 'id'],
                          record as RowRecord
                        )
                      }>
                      {item.getLabel
                        ? item.getLabel(record as RowRecord)
                        : item.label}
                    </Button>
                  </Menu.Item>
                ))}
              </Menu>
            </div>
          }>
          <Button
            type="text"
            size="small"
            className="on-hover"
            icon={<EllipsisIcon />}
            style={{ float: 'right' }}
          />
        </Dropdown>
      )}
    </div>
  );
};

export default menuCellRenderer;
