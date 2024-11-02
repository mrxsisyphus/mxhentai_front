import React, {useEffect, useState} from 'react';
import {Card, CardMedia, Popover, PopoverProps} from '@mui/material';
import {MankaArchive} from '../types';
import loadImg from "../assets/images/anime_loading.gif";
import errorImg from "../assets/images/404.png";

export interface MankaPopoverProps {

    //锚点
    anchorEl: HTMLElement | null;

    onClose: () => void;

    manka: MankaArchive;

    //属性
    props?: PopoverProps;
}

export default function MankaCoverPanelPopover(options: MankaPopoverProps) {

    const {anchorEl, props, onClose, manka} = options

    const onCoverClick = (manka: MankaArchive) => {
        // setCurrentManka(manka)
        console.log(`你点击了漫画：${manka.archiveName}`);
        //打开漫画
        setTimeout(() => {
            window.location.href = `/manka/${manka.archiveId}`
        }, 100)
    }

    const CoverPanel: React.FC = () => {

        const [imageSrc, setImageSrc] = useState<string>(loadImg);
        useEffect(() => {
            const img = new Image();
            img.src = manka.archiveCoverUrl;

            // loaded的钩子
            img.onload = () => {
                setImageSrc(manka.archiveCoverUrl);
            };

            img.onerror = () => {
                // Setting to an actual image so CSS styling works consistently
                setImageSrc(errorImg);
            };

            return () => {
                img.onload = null;
                img.onerror = null;
            };
        }, [manka.archiveCoverUrl]);

        //利用tagGroups 进行渲染
        return (
            <Card
                key={manka.archiveId}>
                <CardMedia
                    component="img"
                    alt={manka.archiveName}
                    image={imageSrc}
                    height={350}
                    onClick={(e) => onCoverClick(manka)}
                />
            </Card>
        )
    }

    return (
        <Popover
            id="cover_papover"
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            disableRestoreFocus
            //很重要
            sx={{
                pointerEvents: 'none',
            }}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'center',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'center',
                horizontal: 'center',
            }}
            {...props}
        >
            <CoverPanel/>
        </Popover>
    )
}