import React, { ImgHTMLAttributes, useEffect, useState } from 'react'
import loadImg from '../../assets/images/anime_loading.gif'
import errorImg from '../../assets/images/404.png'
import {
  CardMedia, CardMediaProps
} from '@mui/material'
export interface ImgProps<T> extends ImgHTMLAttributes<T> {
  loadingImg?: string,

  errorImg?: string,

  src: string,

  onImageLoad?: () => void;
}


export default function Img(props: ImgProps<any>) {
  const { src, onImageLoad, loadingImg, errorImg, ...otherProps } = props;

  //刚开始是loading
  const [imageSrc, setImagsrc] = useState<string>(loadingImg as string);

  useEffect(() => {
    const img = new Image();
    img.src = src;

    // loaded的钩子
    img.onload = () => {
      setImagsrc(imageSrc);
      onImageLoad?.();
    };

    img.onerror = () => {
      // Setting to an actual image so CSS styling works consistently
      setImagsrc(errorImg as string);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return (
    <img
      style={{
        height: 'inherit',
      }}
      {...otherProps}
      src={imageSrc}
    />
  )

}

Img.defaultProps = {
  loadingImg: loadImg,
  errorImg: errorImg,
}