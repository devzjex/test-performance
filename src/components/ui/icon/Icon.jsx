'use client';

import React from 'react';
import classNames from 'classnames';
import './Icon.scss';
import ArrowLeft from '../../SVG/ArrowLeft';
import ArrowRight from '../../SVG/ArrowRight';
import Google from '../../SVG/Google';
import Global from '../../SVG/Global';
import { EIconName } from '@/common/enums';

const Icon = ({ name, className, color, onClick }) => {
  const renderIcon = () => {
    switch (name) {
      case EIconName.ArrowLeft:
        return <ArrowLeft color={color} />;
      case EIconName.ArrowRight:
        return <ArrowRight color={color} />;
      case EIconName.Google:
        return <Google color={color} />;
      case EIconName.Global:
        return <Global color={color} />;
      default:
        return <></>;
    }
  };

  return (
    <div className={classNames('Icon', 'flex', 'justify-center', 'items-center', className)} onClick={onClick}>
      {renderIcon()}
    </div>
  );
};

export default Icon;
