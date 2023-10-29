import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { Progress } from 'antd';
import { useTranslation } from 'react-i18next';

import './loader.scss';

const Loader = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="loadermain">
        <Player
          autoplay
          loop
          src="https://assets3.lottiefiles.com/packages/lf20_urik0sv0.json"
          style={{ height: '160px', width: '160px' }}></Player>
        <div className="progressbarmain">
          <Progress
            strokeColor={{
              '0%': '#aaa6f2',
              '100%': '#ffffff',
            }}
            percent={100}
            showInfo={false}
            status="active"
          />
        </div>
        <span>{t('common.messages.today_great_day_to_make_impact')}</span>
      </div>
    </>
  );
};
export default Loader;
