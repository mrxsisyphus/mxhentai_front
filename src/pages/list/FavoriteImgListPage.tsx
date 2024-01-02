import React, {useEffect, useState} from 'react';
import {
    Card,
    CardActionArea,
    CardContent,
    CardHeader,
    CardMedia,
    ImageList,
    ImageListItem,
    Tooltip,
    Typography
} from '@mui/material'
import loadImg from '../../assets/images/anime_loading.gif'
import errorImg from '../../assets/images/404.png'
import {Favorite, MankaArchive} from '../../types';
import MankaTagsPanelPopover from './MankaTagsPanelPopover';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from "@mui/material/IconButton";

export interface FavoriteImgListPageProps {

    favorites: Favorite[];

    deleteFavorite?: (favorite: Favorite) => void;


}


export default function FavoriteImgListPage(options: FavoriteImgListPageProps) {

    const {favorites, deleteFavorite} = options


    // 当前的manka
    const [currentManka, setCurrentManka] = useState<MankaArchive>();

    const onCoverClick = (manka: MankaArchive) => {
        // setCurrentManka(manka)
        console.log(`你点击了漫画：${manka.archiveName}`);
        //跳转
        window.location.href = `/manka/${manka.archiveId}`
    }


    // 自定义的 ComicItem 组件，包含标题、图片和其他信息
    const FavoriteView: React.FC<{ favorite: Favorite }> = ({favorite}) => {
        // const tagsInfo = manka.tags ? manka.tags.map(tag => tag.tagValue).join(",") : ""
        // tagsPanelPopoverAnchor
        const [tagsPanelPopoverAnchor, setTagsPanelPopoverAnchor] = useState<HTMLElement | null>(null);


        const [imageSrc, setImageSrc] = useState<string>(loadImg);
        useEffect(() => {
            const img = new Image();
            img.src = favorite.archive.archiveCoverUrl;

            // loaded的钩子
            img.onload = () => {
                setImageSrc(favorite.archive.archiveCoverUrl);
            };

            img.onerror = () => {
                // Setting to an actual image so CSS styling works consistently
                setImageSrc(errorImg);
            };

            return () => {
                img.onload = null;
                img.onerror = null;
            };
        }, [favorite.archive.archiveCoverUrl]);

        const onTagsMouseEnter = (event: React.MouseEvent<HTMLElement>, manka: MankaArchive) => {
            setCurrentManka(manka)
            setTagsPanelPopoverAnchor(event.currentTarget)
        }

        const onTagsMouseLeave = (event: React.MouseEvent<HTMLElement>, manka: MankaArchive) => {
            setCurrentManka(manka)
            setTagsPanelPopoverAnchor(null)
        }


        return (
            <React.Fragment>
                {/* tagsPanel */}
                {currentManka && <MankaTagsPanelPopover
                    anchorEl={tagsPanelPopoverAnchor}
                    onClose={() => setTagsPanelPopoverAnchor(null)}
                    manka={currentManka}
                />}
                <ImageListItem key={favorite.favoriteId}
                >
                    <Card
                        sx={{minWidth: 275}}
                        variant="outlined"
                        key={favorite.favoriteId}>
                        <CardHeader
                            // title={<Tooltip title={favorite.archive.archiveName}>
                            //     <Typography>
                            //         {favorite.archive.archiveName.length > 40 ? favorite.archive.archiveName.slice(0, 40) + "..." : favorite.archive.archiveName}
                            //     </Typography>
                            // </Tooltip>}
                            action={
                                <Tooltip title={"取消收藏"}>
                                    <IconButton aria-label="settings"
                                                onClick={() => deleteFavorite ? deleteFavorite(favorite) : null}>
                                        <CloseIcon/>
                                    </IconButton>
                                </Tooltip>
                            }
                        />
                        <CardActionArea>
                            <CardMedia
                                component="img"
                                alt={favorite.archive.archiveName}
                                image={imageSrc}
                                loading="lazy"
                                // height={350}
                                onClick={() => onCoverClick(favorite.archive)}
                                // onLoad={handleImageLoad}
                                // onError={handleImageError}
                            />
                        </CardActionArea>
                        <CardContent>
                            <Tooltip title={favorite.archive.archiveName}>
                                <Typography>
                                    {favorite.archive.archiveName.length > 40 ? favorite.archive.archiveName.slice(0, 40) + "..." : favorite.archive.archiveName}
                                </Typography>
                            </Tooltip>
                        </CardContent>
                    </Card>
                </ImageListItem>
            </React.Fragment>

        );
    };


    return (
        <React.Fragment>
            <ImageList
                variant="standard"
                // rowHeight={500}
                cols={5}
                gap={10}>
                {favorites.map((favorite) => (
                    <FavoriteView favorite={favorite} key={favorite.favoriteId}/>
                ))}
            </ImageList>
        </React.Fragment>
    )
}