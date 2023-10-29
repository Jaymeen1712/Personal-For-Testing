import React, { ReactNode } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithClient } from '../../../../../../test';
import ReRanking from '../re-ranking';
import YellowFlower from '../../../../../../images/yellow-flower.png';
import { IReRankingStrategy } from '../../../../../../types';
import { ReRankingCustomStrategyDetailsProps } from '../re-ranking-custom/re-ranking-custom-strategy-details';
import { onSidebarToggle } from '../../../../../../utills';
import NoFlower from '../../../../../../images/no-flower.png';

const monkStrategyProduct1 = {
  image: NoFlower,
  text: 'product1Text',
  value: 'product1Value',
  valueColor: '#2563EB',
};
const monkStrategyProduct2 = {
  image: YellowFlower,
  text: null,
  value: null,
  valueColor: null,
};
const mockStrategies = [
  {
    id: 'default',
    title: 'defaultTitle',
    subTitle: 'defaultSubTitle',
    products: [monkStrategyProduct1],
  },
  {
    id: 'custom',
    title: 'customTitle',
    subTitle: 'customSubTitle',
    products: [monkStrategyProduct2],
  },
];
const mockNewSelectedStrategy: IReRankingStrategy = {
  strategy: '',
  properties: null,
};
const mockOnLearnMoreClick = jest.fn();
const mockUpdateSavedAction = jest.fn();
const mockSavedAction = true;
const mockUpdateStrategy = jest.fn();
const mockOnStrategySelectionChange = jest.fn();
const mockReRankingCustomStrategyDetails = jest.fn();
const mockOnSaveStrategy = jest.fn();
const mockCancel = jest.fn();
const mockUpdateActionEnabled = jest.fn();
const mockStrategyFetching = { isFetching: true };
const mockStoreFound = { isFound: false };
const mockOnBoardBanner = jest.fn();
const mockOnAddStore = jest.fn();
const mockCanReadEcommerceStore = jest.fn();
const mockCanCreateEcommerceStore = jest.fn();

jest.mock(
  '../../../../../../components/on-board-banner',
  () =>
    (props: {
      header: string;
      description: string | ReactNode;
      buttonName?: string;
      onClickAction?: () => void;
      image: string;
      children?: ReactNode;
      className?: string;
      addButtonPermission?: boolean;
    }) => {
      return mockOnBoardBanner(props);
    }
);

jest.mock('../re-ranking-controller', () => () => ({
  t: (name: string) => name,
  isStrategyFetching: mockStrategyFetching.isFetching,
  isStoreFound: mockStoreFound.isFound,
  strategies: mockStrategies,
  isActionEnabled: true,
  newSelectedStrategy: mockNewSelectedStrategy,
  isSavedAction: mockSavedAction,
  permission: {
    canReadEcommerceStore: mockCanReadEcommerceStore,
    canCreateEcommerceStore: mockCanCreateEcommerceStore,
  },
  onAddStore: mockOnAddStore,
  onSaveStrategy: mockOnSaveStrategy,
  onCancel: mockCancel,
  onLearnMoreClick: mockOnLearnMoreClick,
  updateSavedAction: mockUpdateSavedAction,
  updateStrategy: mockUpdateStrategy,
  updateActionEnabled: mockUpdateActionEnabled,
  onStrategySelectionChange: mockOnStrategySelectionChange,
}));

jest.mock(
  '../re-ranking-custom/re-ranking-custom-strategy-details',
  () => (props: ReRankingCustomStrategyDetailsProps) => {
    return mockReRankingCustomStrategyDetails(props);
  }
);

jest.mock('../../../../../../utills', () => ({
  onSidebarToggle: jest.fn(),
}));

describe('re-ranking', () => {
  it('Given parameter When initial strategy fetching Then show loading', () => {
    mockNewSelectedStrategy.strategy = '';
    renderWithClient(<ReRanking />);

    const sideBarToggleElement = screen.getByTestId('sidebar-toggle');
    expect(sideBarToggleElement).toBeInTheDocument();

    const reRankingTitleElement = screen.getByText(
      'common.labels.header_re_ranking'
    );
    expect(reRankingTitleElement).toBeInTheDocument();

    const reRankingSubTitleElement = screen.getByText(
      'common.labels.subtitle_re_ranking'
    );
    expect(reRankingSubTitleElement).toBeInTheDocument();

    const loaderElement = screen.getByTestId('loader');
    expect(loaderElement).toBeInTheDocument();
  });

  it('Given parameter When store found && selected strategy is default Then show default strategy selection with details', () => {
    mockNewSelectedStrategy.strategy = 'default';
    mockStrategyFetching.isFetching = false;
    mockStoreFound.isFound = true;
    renderWithClient(<ReRanking />);

    const sideBarToggleElement = screen.getByTestId('sidebar-toggle');
    expect(sideBarToggleElement).toBeInTheDocument();

    const reRankingTitleElement = screen.getByText(
      'common.labels.header_re_ranking'
    );
    expect(reRankingTitleElement).toBeInTheDocument();

    const reRankingSubTitleElement = screen.getByText(
      'common.labels.subtitle_re_ranking'
    );
    expect(reRankingSubTitleElement).toBeInTheDocument();

    const cardElement = screen.getByTestId('card-default');
    expect(cardElement).toBeInTheDocument();
    expect(cardElement.className).toContain('active');

    const radioElement = screen.getByTestId('radio-default');
    expect(radioElement).toBeInTheDocument();
    expect(radioElement).toBeChecked();

    const strategyTitleElement = screen.getByText('defaultTitle');
    expect(strategyTitleElement).toBeInTheDocument();

    const strategySubTitleElement = screen.getByText('defaultSubTitle');
    expect(strategySubTitleElement).toBeInTheDocument();

    const productElement = screen.getByTestId('default-product-0');
    expect(productElement).toBeInTheDocument();

    const learnMoreBtnElement = screen.getByRole('button', {
      name: 'common.labels.learn_more',
    });
    expect(learnMoreBtnElement).toBeInTheDocument();

    const product1OrderText = screen.getByText('product1Text');
    expect(product1OrderText).toBeInTheDocument();

    const product1OrderValue = screen.getByText('product1Value');
    expect(product1OrderValue).toBeInTheDocument();

    fireEvent.click(sideBarToggleElement);
    expect(onSidebarToggle).toBeCalled();
  });

  it('Given parameter When selected strategy is custom Then show custom strategy selection with details', () => {
    mockNewSelectedStrategy.strategy = 'custom';
    mockStrategyFetching.isFetching = false;
    mockStoreFound.isFound = true;
    renderWithClient(<ReRanking />);
    const cardElement = screen.getByTestId('card-custom');
    expect(cardElement).toBeInTheDocument();
    expect(cardElement.className).toContain('active');

    const radioElement = screen.getByTestId('radio-custom');
    expect(radioElement).toBeInTheDocument();
    expect(radioElement).toBeChecked();

    const strategyTitleElement = screen.getByText('customTitle');
    expect(strategyTitleElement).toBeInTheDocument();

    const strategySubTitleElement = screen.getByText('customSubTitle');
    expect(strategySubTitleElement).toBeInTheDocument();

    const productElement = screen.getByTestId('custom-product-0');
    expect(productElement).toBeInTheDocument();

    expect(mockReRankingCustomStrategyDetails).toHaveBeenCalledWith(
      expect.objectContaining({
        newSelectedStrategy: mockNewSelectedStrategy,
        updateStrategy: mockUpdateStrategy,
        isSavedAction: mockSavedAction,
        updateSavedAction: mockUpdateSavedAction,
        updateActionEnabled: mockUpdateActionEnabled,
      })
    );
  });

  it('Given parameter When strategy change Then enabled action button', () => {
    mockNewSelectedStrategy.strategy = 'default';
    mockStrategyFetching.isFetching = false;
    mockStoreFound.isFound = true;
    renderWithClient(<ReRanking />);
    const cancelBtnElement = screen.getByRole('button', {
      name: 'common.labels.cancel',
    });
    expect(cancelBtnElement).toBeInTheDocument();

    const saveBtnElement = screen.getByRole('button', {
      name: 'common.labels.save',
    });
    expect(saveBtnElement).toBeInTheDocument();

    fireEvent.click(cancelBtnElement);
    expect(mockCancel).toBeCalled();

    fireEvent.click(saveBtnElement);
    expect(mockOnSaveStrategy).toBeCalled();
  });

  it('Given parameter When store not found Then show not found', () => {
    mockNewSelectedStrategy.strategy = 'default';
    mockStrategyFetching.isFetching = false;
    mockStoreFound.isFound = false;
    mockCanReadEcommerceStore.mockReturnValue(true);
    mockCanCreateEcommerceStore.mockReturnValue(true);
    renderWithClient(<ReRanking />);

    const sideBarToggleElement = screen.getByTestId('sidebar-toggle');
    expect(sideBarToggleElement).toBeInTheDocument();

    const reRankingTitleElement = screen.getByText(
      'common.labels.header_re_ranking'
    );
    expect(reRankingTitleElement).toBeInTheDocument();

    const reRankingSubTitleElement = screen.getByText(
      'common.labels.subtitle_re_ranking'
    );
    expect(reRankingSubTitleElement).toBeInTheDocument();
  });
});
