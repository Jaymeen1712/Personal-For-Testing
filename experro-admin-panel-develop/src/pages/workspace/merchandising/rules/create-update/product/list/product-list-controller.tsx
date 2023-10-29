import React from 'react';
import { Checkbox } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { useTranslation } from 'react-i18next';

import { IListProductItems } from '../../../../../../../types';
import { useSearchAutocomplete } from '../../../../services';

const useProductListController = ({
  listRuleProducts,
  setSkipCount,
  setSelectedPage,
  setCheckedProduct,
  checkedProduct,
  workspaceId,
}: {
  listRuleProducts?: IListProductItems[];
  setSkipCount: (skipCount: number) => void;
  setSelectedPage: (selectedPage: number) => void;
  setCheckedProduct: (checkedProduct: CheckboxValueType[]) => void;
  checkedProduct: CheckboxValueType[];
  workspaceId: string;
}) => {
  const { t } = useTranslation();

  const onSelectCheckBox = (checkedValues: CheckboxValueType[]) => {
    setCheckedProduct(checkedValues);
  };

  const searchAutoComplete = useSearchAutocomplete(workspaceId);

  const menu = (
    <>
      <Checkbox.Group defaultValue={checkedProduct} onChange={onSelectCheckBox}>
        {listRuleProducts &&
          listRuleProducts.length > 0 &&
          Object.keys(listRuleProducts[0]).map(
            (productKey) =>
              productKey !== 'id' &&
              productKey !== 'urlThumbnail' &&
              productKey !== 'nameEti' &&
              productKey !== 'pin' &&
              productKey !== 'slot' &&
              productKey !== 'calculatedPriceEfi' &&
              productKey !== 'pageSlugEsi' && (
                <Checkbox
                  disabled={
                    productKey === 'skuEsi' ||
                    productKey === 'clickRateEfi' ||
                    productKey === 'revenueEfi'
                      ? true
                      : false
                  }
                  value={productKey}
                  className={productKey === 'skuEsi' ? '' : 'text-capitalize'}>
                  {productKey === 'skuEsi'
                    ? productKey
                        .replace(/([A-Z])/g, ' $1')
                        .split(' ')
                        .join('_')
                        .toLowerCase()
                        .slice(
                          0,
                          productKey
                            .replace(/([A-Z])/g, ' $1')
                            .split(' ')
                            .join('_')
                            .toLowerCase()
                            .lastIndexOf('_')
                        )
                        .split('_')
                        .join(' ')
                        .replace(
                          /\w\s*/g,
                          (m) =>
                            m.charAt(0).toUpperCase() +
                            m.substring(1).toLowerCase()
                        )
                    : productKey === 'profitPercentageEfi'
                    ? t('common.labels.profit_margin')
                    : productKey
                        .replace(/([A-Z])/g, ' $1')
                        .split(' ')
                        .join('_')
                        .toLowerCase()
                        .slice(
                          0,
                          productKey
                            .replace(/([A-Z])/g, ' $1')
                            .split(' ')
                            .join('_')
                            .toLowerCase()
                            .lastIndexOf('_')
                        )
                        .split('_')
                        .join(' ')}
                </Checkbox>
              )
          )}
      </Checkbox.Group>
    </>
  );

  const onPageChange = (page: number, pageSize: number) => {
    setSkipCount((page - 1) * pageSize);
    setSelectedPage(page);
  };

  const onInputChange = (inputValue: string) => {
    searchAutoComplete.mutate(inputValue);
  };

  return {
    checkedProduct,
    menu,
    onPageChange,
    t,
    onInputChange,
    autoCompleteData: searchAutoComplete.data,
  };
};

export default useProductListController;
