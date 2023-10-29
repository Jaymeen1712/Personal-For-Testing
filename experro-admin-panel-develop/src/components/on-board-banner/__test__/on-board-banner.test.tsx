import OnBoardBanner from '../on-board-banner';
import { render, screen } from '@testing-library/react';

const mockbuttonOnClick = jest.fn();

describe('onBoardBanner', () => {
  it('onBoardRender Properly', async () => {
    const { container } = render(
      <OnBoardBanner
        header="internationalize your content"
        onClickAction={mockbuttonOnClick}
        buttonName="Add Languages"
        description="Experro supports content in multiple languages and integrates with various tools to manage translations. These integrations support you in making your content available internationally."
        image="../../../images/internationalize.png"
      />
    );

    const headingElement = screen.getByRole('heading');
    expect(headingElement).toBeInTheDocument();
    expect(headingElement).toHaveTextContent('internationalize your content');

    // eslint-disable-next-line testing-library/no-container,testing-library/no-node-access
    const paragraphElement = container.querySelector('p');
    expect(paragraphElement).toHaveTextContent(
      'Experro supports content in multiple languages and integrates with various tools to manage translations. These integrations support you in making your content available internationally.'
    );

    // const imageElement = screen.getByRole('img');
    // expect(imageElement).toHaveAttribute(
    //   'src',
    //   '../../../images/internationalize.png'
    // );
    // expect(imageElement).toHaveAttribute('alt', 'internationalize');
  });
});
