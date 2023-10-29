import React from 'react';
import { Breadcrumb, Dropdown } from 'antd';

import { IFolderBreadcrumb, IFolderBreadcrumbItem } from '../../../../types';
import useFolderBreadcrumbController from './folder-breadcrumb-controller';
import ArrowRightIcon from '../../../../images/icons/arrow-right-icon';
import EllipsisIcon from '../../../../images/icons/ellipsis-icon';

interface FolderBreadcrumbProps {
  folders: IFolderBreadcrumb[];
  isNavigation?: boolean;
}

const FolderBreadcrumb: React.FC<FolderBreadcrumbProps> = ({
  folders,
  isNavigation,
}) => {
  const { ellipsisBreadcrumbItems, onFolderClick } =
    useFolderBreadcrumbController(folders, isNavigation);
  return (
    <Breadcrumb separator={<ArrowRightIcon />}>
      {ellipsisBreadcrumbItems.map((item: IFolderBreadcrumbItem) => (
        <Breadcrumb.Item
          onClick={() => onFolderClick({ isClickable: item.isClickable, id: item.id })}
          key={item.id}>
          {item.type === 'ellipsis' ? (
            isNavigation ? (
              <Dropdown
                placement="bottomRight"
                menu={{
                  items: item.menu,
                  onClick: (e) => {
                    e.domEvent.stopPropagation();
                    onFolderClick({ isClickable: item.isClickable, id: e.key });
                  },
                }}>
                <div>
                  <EllipsisIcon />
                </div>
              </Dropdown>
            ) : (
              <div>
                <EllipsisIcon />
              </div>
            )
          ) : (
            item.title
          )}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default FolderBreadcrumb;
