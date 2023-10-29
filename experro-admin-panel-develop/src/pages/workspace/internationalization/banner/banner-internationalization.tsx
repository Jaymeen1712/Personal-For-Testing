import React from 'react';

import OnBoardBanner from '../../../../components/on-board-banner';
import internationalizeImage from '../../../../images/Internationalization-banner.png';
import useBannerInternationalization from './banner-internationalization-controller';

const BannerInternationalization: React.FC = () => {
  const { t, onAddLanguage } = useBannerInternationalization();

  return (
    <OnBoardBanner
      header={t('common.labels.internationalize_content')}
      description={t('common.labels.internationalize_homepage_body')}
      buttonName={t('common.labels.add_language')}
      onClickAction={onAddLanguage}
      image={internationalizeImage}
      className="image-large"
      addButtonPermission={true}
    />
  );
};

export default BannerInternationalization;
