import { useEffect, useState } from 'react';

const useSubSidebarController = () => {
  const [isSidebarClose, setIsSidebarClose] = useState(false);

  useEffect(() => {
    const openCloseSidebar = () => {
      setIsSidebarClose(!isSidebarClose);
    };

    document.addEventListener('toggleSidebar', openCloseSidebar);

    return () => {
      document.removeEventListener('toggleSidebar', openCloseSidebar);
    };
  }, [isSidebarClose]);

  useEffect(() => {
    //@ts-ignore
    const onSubSideBarCollapsed = (e) => {
      setIsSidebarClose(e.detail);
    };

    document.addEventListener('onSubSideBarCollapse', onSubSideBarCollapsed);

    return () => {
      document.removeEventListener(
        'onSubSideBarCollapse',
        onSubSideBarCollapsed
      );
    };
  }, [isSidebarClose]);

  return { isSidebarClose };
};
export default useSubSidebarController;
