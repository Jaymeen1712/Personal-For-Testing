import React from 'react';
import { screen } from '@testing-library/react';

import LanguageSelect from '../language-select';
import { renderWithClient } from '../../../../../test';

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

jest.mock('../language-select-controller', () => () => ({
  t: (name: string) => name,
  listLanguage: {
    data: [
      {
        id: 'a4d53ad8-ba8e-478a-aba7-9dccc5f2ddc7',
        locale: 'Gu',
        display_name: 'Gujarati',
      },
      {
        id: 'e46e5ec5-3330-4bc9-ad9f-b5412d1e32ec',
        locale: 'Hi',
        display_name: 'Hindi',
      },
      {
        id: 'ed9db0af-f653-4856-82c9-97acc43fa949',
        locale: 'Eng',
        display_name: 'English',
      },
    ],
  },
  languages: [
    {
      displayName: 'Gujarati',
      id: 'fdd01e80-8e8f-4afa-b144-2029a945dbc5',
      locale: 'Gu',
    },
    {
      displayName: 'Hindi',
      id: 'f7e2ad49-e8e5-4547-a2fb-0f5c4cdae540',
      locale: 'Hi',
    },
  ],
}));

describe('internationalization Select', () => {
  it('internationalization Select render', () => {
    const onChangeFn = jest.fn();
    const value = '22ece62b-0e46-4171-9767-fb04ef9606fe';

    const { container } = renderWithClient(
      <LanguageSelect
        value={value}
        onChange={onChangeFn}
        selectedLanguages={sortableTableWithData}
      />
    );

    const comboboxElement = screen.getByRole('combobox');
    expect(comboboxElement).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-container,testing-library/no-node-access
    const selectedValueElement = container.getElementsByClassName(
      'ant-select-selection-item'
    );

    expect(selectedValueElement.length).toBe(1);
    expect(selectedValueElement.item(0)).toHaveTextContent(
      '22ece62b-0e46-4171-9767-fb04ef9606fe'
    );
  });
});
