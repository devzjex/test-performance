'use client';

import React from 'react';
import { Carousel as AntdCarousel } from 'antd';
import './Carousel.scss';

export const Carousels = ({
  dots = true,
  arrows = true,
  infinite = true,
  slidesToShow = 1,
  slidesToScroll = 1,
  autoplay,
  autoplaySpeed = 5000,
  onDragging,
  children,
}) => {
  const settings = {
    dots,
    arrows,
    infinite,
    autoplay,
    autoplaySpeed,
    slidesToShow,
    slidesToScroll,
    beforeChange: () => onDragging?.(true),
    afterChange: () => onDragging?.(false),
  };

  return (
    <div className="Carousels">
      <AntdCarousel {...settings}>{children}</AntdCarousel>
    </div>
  );
};

export default Carousels;
