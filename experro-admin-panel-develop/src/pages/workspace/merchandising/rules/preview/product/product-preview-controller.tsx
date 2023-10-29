import React from 'react';
import { Checkbox } from 'antd';
import { CheckboxValueType } from 'antd/es/checkbox/Group';

import { IListProductItems } from '../../../../../../types';
import { useTranslation } from 'react-i18next';
import { useSearchAutocomplete } from '../../../services';

interface IProductPreviewController {
  setCheckedProduct: (checkedProduct: CheckboxValueType[]) => void;
  checkedProduct: CheckboxValueType[];
  listPreviewProduct?: IListProductItems[];
  workspaceId: string;
}

const useProductPreviewController = ({
  setCheckedProduct,
  checkedProduct,
  listPreviewProduct,
  workspaceId,
}: IProductPreviewController) => {
  const { t } = useTranslation();
  const onSelectCheckBox = (checkedValues: CheckboxValueType[]) => {
    setCheckedProduct(checkedValues);
  };

  const searchAutoComplete = useSearchAutocomplete(workspaceId);

  const menu = (
    <>
      <Checkbox.Group defaultValue={checkedProduct} onChange={onSelectCheckBox}>
        {listPreviewProduct &&
          listPreviewProduct.length > 0 &&
          Object.keys(listPreviewProduct[0]).map(
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

  const onInputChange = (inputValue: string) => {
    searchAutoComplete.mutate(inputValue);
  };

  return { menu, t, onInputChange, autoCompleteData: searchAutoComplete.data };
};

export default useProductPreviewController;
