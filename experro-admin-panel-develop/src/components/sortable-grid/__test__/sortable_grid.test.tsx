import { render, screen } from '@testing-library/react';

import SortableGrid from '../sortable-grid';
import SortableGridTest from './sortable_grid_test';

const sortableTableWithData = [
  {
    name: 'Gujarati',
    id: 'fdd01e80-8e8f-4afa-b144-2029a945dbc5',
    locale: 'Gu',
  },
  {
    name: 'Hindi',
    id: 'f7e2ad49-e8e5-4547-a2fb-0f5c4cdae540',
    locale: 'Hi',
  },
];

const sortableTableWithoutData = undefined;

const columns = [
  {
    title: 'Sort',
    dataIndex: 'sort',
    width: 30,
    className: 'drag-visible',
  },
  {
    title: 'Label',
    dataIndex: ['display_name', 'locale'],
    className: 'drag-visible',
  },
];

describe('sortable  Grid', () => {
  it('sortable table render properly', async () => {
    render(
      <SortableGrid
        dataSource={sortableTableWithData}
        columns={columns}
        DraggableBodyRow={SortableGridTest}
        DraggableContainer={SortableGridTest}
      />
    );
    const tableElement = screen.getByRole('table');
    expect(tableElement).toBeInTheDocument();
  });

  it('sortable table not render', async () => {
    render(
      <SortableGrid
        dataSource={sortableTableWithoutData}
        columns={columns}
        DraggableBodyRow={SortableGridTest}
        DraggableContainer={SortableGridTest}
      />
    );

    // const spanElement = screen.getByText(
    //   'common.messages.no_data_found_in_table_subtitle'
    // );
    // expect(spanElement).toBeInTheDocument();
  });
});
