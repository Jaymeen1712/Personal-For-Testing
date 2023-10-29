import { screen } from '@testing-library/react';

import BannerContentModelField from '../banner-content-model-field';
import { renderWithClient } from '../../../../../../test';

const mockOnAddContentField = jest.fn();

describe('Banner Content Modal Field', () => {
  it('component Render', () => {
    renderWithClient(
      <BannerContentModelField onAddContentField={mockOnAddContentField} />
    );

    const title = screen.getByText('common.labels.new_field_banner_title');
    expect(title).toBeInTheDocument();

    const subtitle = screen.getByText(
      'common.labels.new_field_banner_subtitle'
    );
    expect(subtitle).toBeInTheDocument();
  });
});
