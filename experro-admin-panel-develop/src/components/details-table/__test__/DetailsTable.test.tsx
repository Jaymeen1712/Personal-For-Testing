import React from 'react';
import { render, screen } from '@testing-library/react';
import DetailsTable from '../details-table';

describe('Detail Table', () => {
  it('DetailTable render', () => {
    render(
      <DetailsTable
        rows={[
          {
            label: 'firstName',
            value: 'nishit',
          },
          {
            label: 'lastName',
            value: 'Joshi',
          },
          {
            label: 'email',
            value: 'nj@gmail.com',
          },
          {
            label: 'status',
            value: 'Active',
          },
        ]}
      />
    );
    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
  });
});
