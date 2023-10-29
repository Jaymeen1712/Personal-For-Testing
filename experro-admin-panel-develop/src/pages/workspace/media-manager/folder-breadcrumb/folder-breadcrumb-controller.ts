import { useHistory, useParams } from 'react-router-dom';
import {
  IFolderBreadcrumb,
  IFolderBreadcrumbItem,
  IWorkspaceParams,
} from '../../../../types';
import { useMemo } from 'react';

const useFolderBreadcrumbController = (
  folders: IFolderBreadcrumb[],
  isNavigation: boolean | undefined
) => {
  const { workspaceId } = useParams<IWorkspaceParams>();
  const history = useHistory();
  const onFolderClick = (item: { isClickable: boolean; id: string }) => {
    if (
      (item) &&
      item.id.length > 0 &&
      isNavigation &&
      item.isClickable
    ) {
      history.push(
        `/workspaces/${workspaceId}/media-manager?folder=${item.id}`
      );
    }
  };

  const ellipsisBreadcrumbItems = useMemo(() => {
    let ellipsisBreadcrumbList: IFolderBreadcrumbItem[] = [];
    if (folders.length > 4) {
      ellipsisBreadcrumbList.push({
        id: folders[0].key,
        title: folders[0].label,
        type: folders[0].type,
        isClickable: true,
      });
      ellipsisBreadcrumbList.push({
        id: folders[1].key,
        title: folders[1].label,
        type: folders[1].type,
        isClickable: true,
      });
      const menuItems: { key: string; label: string }[] = [];
      for (let index = 2; index < folders.length - 2; index++) {
        menuItems.push({
          key: folders[index].key,
          label: folders[index].label,
        });
      }
      ellipsisBreadcrumbList.push({
        id: '',
        title: '...',
        type: 'ellipsis',
        isClickable: true,
        menu: menuItems,
      });
      ellipsisBreadcrumbList.push({
        id: folders[folders.length - 2].key,
        title: folders[folders.length - 2].label,
        type: folders[folders.length - 2].type,
        isClickable: true,
      });
      ellipsisBreadcrumbList.push({
        id: folders[folders.length - 1].key,
        title: folders[folders.length - 1].label,
        type: folders[folders.length - 1].type,
        isClickable: false,
      });
    } else {
      ellipsisBreadcrumbList = folders.map((folder, index) => ({
        id: folder.key,
        title: folder.label,
        type: folder.type,
        isClickable: folder.type === 'folder' && index !== folders.length - 1,
      }));
    }
    return ellipsisBreadcrumbList;
  }, [folders]);

  return {
    ellipsisBreadcrumbItems,
    onFolderClick,
  };
};

export default useFolderBreadcrumbController;
