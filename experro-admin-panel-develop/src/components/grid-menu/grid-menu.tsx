import React, { ReactNode } from 'react';
import { Button, Menu, Dropdown } from 'antd';
import EllipsisIcon from '../../images/icons/ellipsis-icon';

interface MenuItem {
  key: string;
  onClick?: (id: string, e: React.MouseEvent<HTMLElement>) => void;
  onHref?: (id: string) => string | undefined;
  label: string | ReactNode;
  disable?: boolean;
  className?: string;
}

interface GridMenuProps {
  menuList: MenuItem[];
  id: string;
  placement?:
    | 'bottom'
    | 'bottomRight'
    | 'bottomLeft'
    | 'bottomCenter'
    | 'top'
    | 'topRight'
    | 'topLeft'
    | 'topCenter';
}

const GridMenu: React.FC<GridMenuProps> = ({
  menuList,
  id,
  placement = 'bottomRight',
}) => {
  return (
    <div className="ant-row ant-row-middle ant-row-no-wrap ant-row-space-between">
      <Dropdown
        placement={placement}
        trigger={['click']}
        overlay={
          <div className="table-dropdown">
            <Menu>
              {menuList?.map((item) => (
                <Menu.Item key={item.key}>
                  {item.onHref ? (
                    <Button
                      className={item.className ? item.className : ''}
                      disabled={item.disable}
                      htmlType="button"
                      type="link"
                      target="_self"
                      key={item.key}
                      href={item.onHref(id)}>
                      {item.label}
                    </Button>
                  ) : (
                    <Button
                      className={item.className ? item.className : ''}
                      disabled={item.disable}
                      type="text"
                      key={item.key}
                      onClick={item.onClick?.bind(this, id)}>
                      {item.label}
                    </Button>
                  )}
                </Menu.Item>
              ))}
            </Menu>
          </div>
        }>
        <Button
          type="text"
          size="small"
          onClick={(event) => event.stopPropagation()}
          className="on-hover"
          icon={<EllipsisIcon />}
          style={{ float: 'right' }}
        />
      </Dropdown>
    </div>
  );
};

export default GridMenu;
