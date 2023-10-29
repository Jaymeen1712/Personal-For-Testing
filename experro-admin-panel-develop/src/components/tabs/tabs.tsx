import { Tabs, TabsProps } from 'antd';
import React, { ReactNode } from 'react';

interface CustomTabPaneProps {
  label?: string | JSX.Element;
  children?: ReactNode;
  tabIcon?: ReactNode;
}

const TabPaneHeader: React.FC<{
  data?: CustomTabPaneProps;
}> = ({ data }) => {
  return (
    <>
      {data?.tabIcon} <br></br> {data?.label}
    </>
  );
};

const TabsWrapper: React.FC<TabsProps & { items?: CustomTabPaneProps[] }> = (
  props
) => {
  const { items, id } = props;
  return (
    <Tabs {...props}>
      {items?.map(
        (
          tab: {
            label?: string | JSX.Element;
            children?: ReactNode;
            tabIcon?: ReactNode;
          },
          index: number
        ) => {
          return (
            <Tabs.TabPane
              tab={<TabPaneHeader data={tab} />}
              key={`${id}-${index + 1}`}>
              {tab.children}
            </Tabs.TabPane>
          );
        }
      )}
    </Tabs>
  );
};

export default TabsWrapper;
