import React, {useEffect, useState} from 'react';
import {ImageList, ImageListItem, ImageListItemBar, Paper, styled, Tooltip, Typography} from '@mui/material'
import loadImg from '../../assets/images/anime_loading.gif'
import errorImg from '../../assets/images/404.png'
import {MankaArchive, MankaArchiveTag} from '../../types';
import _ from 'lodash';
import MankaTagsPanelPopover from './MankaTagsPanelPopover';
import IconButton from "@mui/material/IconButton";
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';

export interface MankaImgListPageProps {

    mankaData: MankaArchive[];

    //onMankaClick?:(event:React.MouseEvent<HTMLTableRowElement, MouseEvent>,manka:MankaArchive) => void

    //onTitleMouseEnter?: (event:React.MouseEvent<HTMLElement>,manka:MankaArchive) => void

    //onTitleMouseLeave?:(event:React.MouseEvent<HTMLElement>,manka:MankaArchive) => void

    clickTagCallback?: (tag: MankaArchiveTag) => void;

    addToFavorite?: (archive: MankaArchive) => void;

    deleteFavorite?: (favoriteId: string) => void;

}

const getTagValuesMap = (tags: MankaArchiveTag[] | undefined) => {
    if (!tags) return {}
    return _.groupBy(tags, tag => tag.tagName)
}

export default function MankaImgListPage(options: MankaImgListPageProps) {

    const {mankaData, clickTagCallback, addToFavorite, deleteFavorite} = options


    // 当前的manka
    const [currentManka, setCurrentManka] = useState<MankaArchive>();

    const onCoverClick = (manka: MankaArchive) => {
        // setCurrentManka(manka)
        console.log(`你点击了漫画：${manka.archiveName}`);
        //跳转
        window.location.href = `/manka/${manka.archiveId}`
    }
    const CustomImageListItemBar = styled(ImageListItemBar)({
        '& .MuiImageListItemBar-titleWrap': {
            whiteSpace: 'normal',
        },
    });


    // 自定义的 ComicItem 组件，包含标题、图片和其他信息
    const MankaItem: React.FC<{ manka: MankaArchive }> = ({manka}) => {
        // const tagsInfo = manka.tags ? manka.tags.map(tag => tag.tagValue).join(",") : ""
        // tagsPanelPopoverAnchor
        const [tagsPanelPopoverAnchor, setTagsPanelPopoverAnchor] = useState<HTMLElement | null>(null);


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
                    clickTagCallback={clickTagCallback}
                />}
                <ImageListItem key={manka.archiveId}
                >
                    <img
                        alt={manka.archiveName}
                        src={imageSrc}
                        onClick={() => onCoverClick(manka)}
                        loading="lazy"
                    />
                    <ImageListItemBar
                        title={<Tooltip title={manka.archiveName}>
                            <Typography fontSize={"small"} >
                                {manka.archiveName.length > 30 ? manka.archiveName.slice(0, 30) + "..." : manka.archiveName}
                            </Typography>
                        </Tooltip>}
                        position="top"
                        actionIcon={manka.belongFavoriteId ? <Tooltip title={"取消收藏"}>
                            <IconButton aria-label="settings"
                                        onClick={() => deleteFavorite && manka.belongFavoriteId ? deleteFavorite(manka.belongFavoriteId) : null}>
                                <StarIcon/>
                            </IconButton>
                        </Tooltip> : <Tooltip title={"加入收藏"}>
                            <IconButton aria-label="settings"
                                        onClick={() => addToFavorite ? addToFavorite(manka) : null}>
                                <StarBorderIcon/>
                            </IconButton>
                        </Tooltip>
                        }
                        actionPosition="left"
                    />
                    <ImageListItemBar
                        title={manka.tags && <Typography fontSize={"small"} onMouseEnter={(e) => onTagsMouseEnter(e, manka)}
                        >
                            {manka.tags.length > 3 ? manka.tags.slice(0, 3).map(tag => tag.tagValue).join(",") + "..." : manka.tags.map(tag => tag.tagValue).join(",")}
                        </Typography>}
                    />
                    {/*<Card*/}
                    {/*    sx={{minWidth: 275}}*/}
                    {/*    variant="outlined"*/}
                    {/*    key={manka.archiveId}>*/}
                    {/*    <CardHeader*/}
                    {/*        action= {manka.belongFavoriteId ? <Tooltip title={"取消收藏"}>*/}
                    {/*            <IconButton aria-label="settings"*/}
                    {/*                        onClick={() => deleteFavorite && manka.belongFavoriteId? deleteFavorite(manka.belongFavoriteId) : null}>*/}
                    {/*                <CloseIcon/>*/}
                    {/*            </IconButton>*/}
                    {/*        </Tooltip> : <Tooltip title={"加入收藏"}>*/}
                    {/*            <IconButton aria-label="settings"*/}
                    {/*                        onClick={() => addToFavorite ? addToFavorite(manka) : null}>*/}
                    {/*                <AddIcon/>*/}
                    {/*            </IconButton>*/}
                    {/*        </Tooltip>*/}
                    {/*    }*/}
                    {/*        title={<Tooltip title={manka.archiveName}>*/}
                    {/*            <Typography>*/}
                    {/*                {manka.archiveName.length > 40 ? manka.archiveName.slice(0, 40) + "..." : manka.archiveName}*/}
                    {/*            </Typography>*/}
                    {/*        </Tooltip>}*/}
                    {/*    />*/}
                    {/*    <CardActionArea>*/}
                    {/*        <CardMedia*/}
                    {/*            component="img"*/}
                    {/*            alt={manka.archiveName}*/}
                    {/*            image={imageSrc}*/}
                    {/*            loading="lazy"*/}
                    {/*            // height={350}*/}
                    {/*            onClick={() => onCoverClick(manka)}*/}
                    {/*            // onLoad={handleImageLoad}*/}
                    {/*            // onError={handleImageError}*/}
                    {/*        />*/}
                    {/*    </CardActionArea>*/}
                    {/*    <CardContent>*/}
                    {/*        /!*<div>*!/*/}
                    {/*        /!*    <span>{`p${manka.archiveTotalPage}`}</span>*!/*/}
                    {/*        /!*    <Divider orientation="vertical" flexItem/>*!/*/}
                    {/*        /!*    <span>{formatLocalTime(manka.archiveModTime)}</span>*!/*/}
                    {/*        /!*</div>*!/*/}
                    {/*        /!* @ts-ignore*!/*/}
                    {/*        {manka.tags && <Typography*/}
                    {/*            onMouseEnter={(e) => onTagsMouseEnter(e, manka)}*/}
                    {/*            // onMouseLeave={(e) => onTagsMouseLeave(e, manka)}*/}
                    {/*        >*/}
                    {/*            {manka.tags.length > 3 ? manka.tags.slice(0, 3).map(tag => tag.tagValue).join(",") + "..." : manka.tags.map(tag => tag.tagValue).join(",")}*/}
                    {/*        </Typography>}*/}
                    {/*    </CardContent>*/}
                    {/*</Card>*/}
                </ImageListItem>
            </React.Fragment>

        );
    };


    return (
        <React.Fragment>
            <Paper sx={{width: '100%', overflowY: 'auto', maxHeight: '75vh'}}>
                <ImageList
                    variant="standard"
                    // rowHeight={500}
                    cols={5}
                    gap={10}
                >
                    {mankaData.map((manka) => (
                        <MankaItem manka={manka} key={manka.archiveId}/>
                    ))}
                </ImageList>
            </Paper>

        </React.Fragment>
    )
}