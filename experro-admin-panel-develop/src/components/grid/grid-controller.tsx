/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from 'react-query';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

import apiClient from '../../apis/api-client';
import menuCellRenderer from './cell-renderers/menu';
import tagCellRenderer from './cell-renderers/tag';
import popoverCellRenderer from './cell-renderers/popover';
import customCellRenderer from './cell-renderers/custom';
import actionCellRenderer from './cell-renderers/action';
import sortableCellRenderer from './cell-renderers/sortable';
import {
  GridColumnType,
  GridParams,
  IAxiosResponse,
  RowRecord,
} from '../../types';
import { GRID_RENDERER_TYPE, PAGE_SIZE } from '../../utills';
import redirectCellRender from './cell-renderers/redirect';

interface SortableItemProps {
  children: ReactNode | ReactNode[];
  'data-row-key'?: string;
  onClick?: () => void;
}

interface DraggableBodyRowProps {
  className: string;
  style: object;
  children: ReactNode;
  'data-row-key'?: string;
}

const getGridData = async (
  page: number,
  pageSize: number,
  url?: string,
  params?: GridParams
) => {
  if (!url) return [];
  const result = await apiClient.get<null, IAxiosResponse<any>>(url, {
    params: { ...params, skip: (page - 1) * pageSize, limit: pageSize },
  });

  return result.response.Data;
};

const useGrid = (
  page: number,
  pageSize: number,
  url?: string,
  params?: GridParams
) =>
  useQuery(['grid', url], () => getGridData(page, pageSize, url, params), {
    cacheTime: 0,
  });

const useGridController = (
  columns: GridColumnType[],
  url?: string,
  params?: GridParams,
  sortable?: boolean,
  rows?: unknown[],
  filterText?: string
) => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({});
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const grid = useGrid(page, pageSize, url, params);

  const columnsWithCellRenderer = useMemo(
    () =>
      columns.map((column) => {
        const { rendererType, rendererProps, ...rest } = column;
        if (rendererType && rendererProps) {
          let renderer = customCellRenderer;
          if (rendererType === GRID_RENDERER_TYPE.TAG)
            renderer = tagCellRenderer;
          if (rendererType === GRID_RENDERER_TYPE.POPOVER)
            renderer = popoverCellRenderer;
          if (rendererType === GRID_RENDERER_TYPE.MENU)
            renderer = menuCellRenderer;
          if (rendererType === GRID_RENDERER_TYPE.ACTION)
            renderer = actionCellRenderer;
          if (rendererType === GRID_RENDERER_TYPE.SORTABLE)
            renderer = sortableCellRenderer;
          if (rendererType === GRID_RENDERER_TYPE.REDIRECT)
            renderer = redirectCellRender;

          return { ...rest, render: renderer.bind(this, rendererProps) };
        } else return rest;
      }),
    [columns]
  );

  useEffect(() => {
    setPage(1);
  }, [filterText]);

  const pagination = useMemo(
    () => ({
      total: grid.data?.totalCount || rows?.length,
      pageSize: pageSize,
      showSizeChanger: true,
      current: page,
      hideOnSinglePage: !!(
        (grid.data &&
          grid.data.totalCount &&
          grid.data.totalCount < PAGE_SIZE) ||
        (rows && rows?.length < PAGE_SIZE)
      ),
      pageSizeOptions: [5, 10, 20, 50, 100],
      locale: { items_per_page: ' per page' },
      onChange: (page: number, pageSize: number) => {
        setPageSize(pageSize);
        setPage(page);
        grid.remove();
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [grid.data, setPage, page, rows, pageSize, setPageSize]
  );

  const components = useMemo(() => {
    if (sortable) {
      const SortableItem = SortableElement((props: SortableItemProps) => (
        <tr {...props} />
      ));
      const SortableBody = SortableContainer((props: SortableItemProps) => (
        <tbody {...props} />
      ));

      const onSortEnd = ({
        oldIndex,
        newIndex,
      }: {
        oldIndex: number;
        newIndex: number;
      }) => {
        if (oldIndex !== newIndex) {
          // const newData = arrayMoveImmutable(
          //   dataSource.slice(),
          //   oldIndex,
          //   newIndex
          // ).filter((el) => !!el);
          // setDataSource(newData);
        }
      };

      const DraggableContainer = (props: SortableItemProps) => (
        <SortableBody
          useDragHandle
          disableAutoscroll
          helperClass="row-dragging"
          onSortEnd={onSortEnd}
          {...props}
        />
      );

      const DraggableBodyRow = ({
        className,
        style,
        ...restProps
      }: DraggableBodyRowProps) => {
        // function findIndex base on Table rowKey props and should always be a right array index
        const index = (rows || [])?.findIndex(
          (row) => (row as RowRecord).id === restProps['data-row-key']
        );
        return <SortableItem index={index} {...restProps} />;
      };

      return {
        body: {
          wrapper: DraggableContainer,
          row: DraggableBodyRow,
        },
      };
    } else return {};
  }, [rows, sortable]);

  useEffect(() => {
    grid.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (
      Object.keys(params || {}).length === 0 &&
      Object.keys(filter).length === 0
    ) {
      return;
    }

    if (JSON.stringify(params) !== JSON.stringify(filter)) {
      setFilter(params || {});
      if (page === 1) {
        grid.refetch();
      } else {
        setPage(1);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Object.values(params || {})]);

  return {
    isSuccess: grid.isSuccess,
    data: grid.data?.items || [],
    columnsWithCellRenderer,
    pagination,
    components,
  };
};

export default useGridController;
