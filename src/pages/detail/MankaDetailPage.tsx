import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    ButtonGroup,
    Card,
    CardHeader,
    CardMedia,
    CircularProgress,
    Container,
    Input,
    MenuItem,
    Pagination,
    Paper,
    Select,
    SelectChangeEvent,
    Typography
} from '@mui/material';
import {useParams} from "react-router";
import API from "../../middleware/api";
import {Response} from "../../types/response";
import {ArchiveItem, Favorite, MankaArchive} from "../../types";
import {sizeToString} from "../../utils/datetime";
import errorImg from "../../assets/images/404.png";
import loadImg from '../../assets/images/anime_loading.gif'
import IconButton from "@mui/material/IconButton";
import {DetailImgMode, ImgRankField, ImgRankMode, ImgSpec} from "./types";
import TextRotationDownIcon from "@mui/icons-material/TextRotationDown";
import TextRotateUpIcon from "@mui/icons-material/TextRotateUp";
import _ from "lodash";
import InfiniteScroll from 'react-infinite-scroller';

const preloadPage = 8



export default function MankaDetailPage() {
    const {mankaId} = useParams();
    const [mankaArchive, setMankaArchive] = useState<MankaArchive | undefined>(undefined)
    const [loading, setLoading] = useState<boolean>(false);
    const [imgItems, setImgItems] = useState<ArchiveItem[]>([]);
    const [imgDisplayMode, setImgDisplayMode] = useState<DetailImgMode>(DetailImgMode.PageMode); // 默认是table
    const [imgRankField, setImgRankField] = useState<ImgRankField>(ImgRankField.ImgIndex);// 默认是按照index升序
    const [imgRankMode, setImgRankMode] = useState<ImgRankMode>(ImgRankMode.ASC); // 默认是asc
    const [imgSpec, setImgSpec] = useState<ImgSpec>(ImgSpec.NormalImg);
    const [favoriteId, setFavoriteId] = useState<string | undefined>(undefined);
    useEffect(() => {
        console.log("mankaId", mankaId)
        fetchMankaDetail()
    }, [])

    useEffect(() => {
        updateImgItems()
    }, [imgRankMode, imgRankField]);

    const updateImgItems = () => {
        setImgItems(_.orderBy(imgItems, [imgRankField], [imgRankMode]))
    }

    const getImgUrl = (archiveItem: ArchiveItem) => {
        switch (imgSpec) {
            case ImgSpec.ThumbImg:
                return archiveItem.archiveItemThumbUrl
            case ImgSpec.NormalImg:
                return archiveItem.archiveItemUrl
            case ImgSpec.OriginImg:
                return archiveItem.archiveItemOriginUrl
        }
    }


    const handleImgRankFieldChange = (e: SelectChangeEvent<ImgRankField>) => {

        setImgRankField(e.target.value as ImgRankField)
    }

    const handleImgDisplayModeChange = (e: SelectChangeEvent<DetailImgMode>) => {

        setImgDisplayMode(e.target.value as DetailImgMode)
    }

    const handleImgSpecChange = (e: SelectChangeEvent<ImgSpec>) => {

        setImgSpec(e.target.value as ImgSpec)
    }

    const handleImgRankModeChange = () => {
        setImgRankMode((prevMode) => (prevMode === ImgRankMode.ASC ? ImgRankMode.DESC : ImgRankMode.ASC));
    };

    /**
     * 获取manka详情
     */
    const fetchMankaDetail = async () => {
        setLoading(true)
        try {
            //
            const {data: {data}} = await API.get<Response<MankaArchive>>(`/manka/${mankaId}/detail`)
            setMankaArchive(data)
            const items = data && data.archiveItems ? data.archiveItems : []
            // setLoadedItems(items.slice(0, preloadPage))
            setImgItems(items)
            setFavoriteId(data.belongFavoriteId)
        } catch (e) {
            console.error("err", e)
            alert(e)
        } finally {
            setLoading(false)
        }
    }


    // 自定义的 ComicItem 组件，包含标题、图片和其他信息
    const ArchiveItemForInfinity: React.FC<{
        archiveItem: ArchiveItem,
        index: number
    }> = ({archiveItem, index}) => {

        const [imageSrc, setImageSrc] = useState<string>(loadImg);
        // const [loadCount, setLoadCount] = useState(0);
        useEffect(() => {
            const img = new Image();
            img.src = getImgUrl(archiveItem);

            // loaded的钩子
            img.onload = () => {
                setImageSrc(getImgUrl(archiveItem));
            };

            img.onerror = () => {
                // Setting to an actual image so CSS styling works consistently
                setImageSrc(errorImg);
            };

            return () => {
                img.onload = null;
                img.onerror = null;
            };
        }, []);
        return (
            <React.Fragment>
                <Box>
                    <Box display="flex" alignItems="center" justifyContent="center">
                        <Typography>{`${archiveItem.archiveItemName}::${sizeToString(archiveItem.archiveItemSize)}::${index + 1}/${mankaArchive?.archiveTotalPage}`}</Typography>
                    </Box>
                    <CardMedia
                        component="img"
                        alt={archiveItem.archiveItemName}
                        image={imageSrc}
                        loading="lazy"
                    />
                </Box>
            </React.Fragment>

        );
    };

    const ArchiveItemForPage: React.FC<{
        archiveItem: ArchiveItem,
        index: number
    }> = ({archiveItem, index}) => {
        const imageUrl = getImgUrl(archiveItem)
        const [imageSrc, setImageSrc] = useState<string>(loadImg);
        // const [loadCount, setLoadCount] = useState(0);
        useEffect(() => {
            const img = new Image();
            img.src = imageUrl;

            // loaded的钩子
            img.onload = () => {
                setImageSrc(imageUrl);
            };

            img.onerror = () => {
                // Setting to an actual image so CSS styling works consistently
                setImageSrc(errorImg);
            };

            return () => {
                img.onload = null;
                img.onerror = null;
            };
        }, [imageUrl]);
        return (
            <React.Fragment>
                <Box>
                    <Box display="flex" alignItems="center" justifyContent="center">
                        <Typography>{`${archiveItem.archiveItemName}::${sizeToString(archiveItem.archiveItemSize)}::${index + 1}/${mankaArchive?.archiveTotalPage}`}</Typography>
                    </Box>
                    <Card
                        key={archiveItem.archiveItemPath}>
                        <CardMedia
                            component="img"
                            alt={archiveItem.archiveItemName}
                            image={imageSrc}
                            loading="lazy"
                        />
                    </Card>
                    <Box display="flex" alignItems="center" justifyContent="center">
                        <Typography>{`${archiveItem.archiveItemName}::${sizeToString(archiveItem.archiveItemSize)}::${index + 1}/${mankaArchive?.archiveTotalPage}`}</Typography>
                    </Box>
                </Box>
            </React.Fragment>

        );
    };

    //addToFavorite
    const addToFavorite = async (manka: MankaArchive) => {
        console.log("addToFavorite", manka)
        try {
            const query = {
                archiveId: manka.archiveId
            }
            const {data: {data}} = await API.post<Response<Favorite>>(`/favorite/add`, query)
            setFavoriteId(data.favoriteId)
        } catch (e) {
            console.error("err", e)
            alert(e)
        } finally {
        }
    }
    //deleteFavorite
    const deleteFavorite = async (favoriteId: string) => {
        console.log("deleteFavorite", favoriteId)
        try {
            await API.get<Response<any>>(`/favorite/remove/${favoriteId}`)
            // await fetchMankaDetail()
            setFavoriteId(undefined)
        } catch (e) {
            console.error("err", e)
            alert(e)
        } finally {
        }
    }


    const InfinityImgViewer: React.FC = () => {
        const [loadedItems, setLoadItems] = useState<ArchiveItem[]>([]);
        const loadMoreItems = (page: number) => {
            console.log("loadMore...", page)
            const moreItems = imgItems.slice(loadedItems.length, loadedItems.length + preloadPage);
            setLoadItems(prevItems => [...prevItems, ...moreItems]);
        };
        //
        // useEffect(() => {
        //     if (!mankaArchive) return;
        //     if (loadedItems.length <= 0) return;
        //     const handleScroll = () => {
        //         if (window.innerHeight + document.documentElement.scrollTop < document.documentElement.offsetHeight - defaultPageSize) return;
        //         if (loadedItems.length === mankaArchive?.archiveTotalPage) return; // 如果所有的图片都已经被加载，就不再加载更多的图片
        //         loadMoreItems();
        //     };
        //     window.addEventListener('scroll', handleScroll);
        //     return () => window.removeEventListener('scroll', handleScroll);
        // }, [loadedItems]);
        return <>
            <Box sx={{
                height: '100vh', // 设置高度为视口的高度
                overflowY: 'auto', // 设置垂直滚动
            }}>
                <InfiniteScroll
                    pageStart={0}
                    loadMore={loadMoreItems} //loadMore
                    initialLoad={true}
                    loader={<CircularProgress key={"loading"}/>}
                    hasMore={loadedItems.length < imgItems.length}
                    threshold={600}
                    useWindow={false}>
                    {loadedItems.map((archiveItem, index) => (
                        <ArchiveItemForInfinity archiveItem={archiveItem} index={index}
                                                key={archiveItem.archiveItemPath}/>
                    ))
                    }
                </InfiniteScroll>
            </Box>
        </>
    }

    const PageImgViewer: React.FC = () => {
        const [page, setPage] = useState<number>(1)
        const onPageChange = (event: React.ChangeEvent<unknown>, page: number) => {
            setPage(page)
        }

        return <>
            <Box>
                <Box display="flex" alignItems="center" justifyContent="center">
                    <Pagination
                        count={mankaArchive?.archiveTotalPage}
                        page={page}
                        onChange={onPageChange}
                        showFirstButton
                        showLastButton/>
                </Box>
                <Box>
                    <ArchiveItemForPage archiveItem={imgItems[page - 1]} index={page - 1}/>
                </Box>
                <Box display="flex" alignItems="center" justifyContent="center">
                    <Pagination
                        count={mankaArchive?.archiveTotalPage}
                        page={page}
                        onChange={onPageChange}
                        showFirstButton
                        showLastButton/>
                </Box>
            </Box>
        </>
    }


    return (
        <Container>

            {/*漫画前*/}
            <Box>
                {/*标题*/}
                <Box display="flex" alignItems="center" justifyContent="center">
                    <Typography>{`标题: ${mankaArchive?.archiveName}`}</Typography>
                </Box>
                {/*整个漫画的操作项目*/}
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        '& > *': {
                            m: 1,
                        },
                    }}>
                        <ButtonGroup variant="outlined" aria-label="outlined button group" size={"small"}>
                            <Button
                                size={"small"}
                                disabled={!!favoriteId && favoriteId !== ""}
                                onClick={async () => mankaArchive ? addToFavorite(mankaArchive) : null}
                            >
                                加入收藏
                            </Button>
                            <Button
                                size={"small"}
                                disabled={!(!!favoriteId && favoriteId !== "")}
                                onClick={async () => favoriteId && favoriteId !== "" ? deleteFavorite(favoriteId) : null}
                            >
                                取消收藏
                            </Button>
                        </ButtonGroup>
                    </Box>
                    <Box>
                        <Select
                            labelId="sort-select"
                            id="sort-select"
                            value={imgRankField}
                            onChange={handleImgRankFieldChange}
                            input={<Input/>}
                            disabled={loading}

                        >
                            <MenuItem value={ImgRankField.ImgIndex}>图片索引
                            </MenuItem>
                            <MenuItem value={ImgRankField.ImgName}>图片名称
                            </MenuItem>
                            <MenuItem value={ImgRankField.ImgSize}>图片大小
                            </MenuItem>
                        </Select>
                        <IconButton
                            title={"sortMethod"}
                            onClick={handleImgRankModeChange}
                            color={"inherit"}
                            disabled={loading}
                        >
                            {imgRankMode === ImgRankMode.DESC ? <TextRotationDownIcon/> : <TextRotateUpIcon/>}
                        </IconButton>
                    </Box>
                    <Box>
                        <Select
                            labelId="sort-select"
                            id="sort-select"
                            value={imgDisplayMode}
                            onChange={handleImgDisplayModeChange}
                            input={<Input/>}
                            disabled={loading}

                        >
                            <MenuItem value={DetailImgMode.InfinityMode}>无限滚动模式
                            </MenuItem>
                            <MenuItem value={DetailImgMode.PageMode}>分页模式
                            </MenuItem>
                        </Select>
                    </Box>
                    <Box>
                        <Select
                            labelId="sort-select"
                            id="sort-select"
                            value={imgSpec}
                            onChange={handleImgSpecChange}
                            input={<Input/>}
                            disabled={loading}

                        >
                            <MenuItem value={ImgSpec.NormalImg}>常规图片
                            </MenuItem>
                            <MenuItem value={ImgSpec.ThumbImg}>缩略图
                            </MenuItem>
                            <MenuItem value={ImgSpec.OriginImg}>原图
                            </MenuItem>
                        </Select>
                    </Box>
                </Box>
            </Box>
            {/*漫画展示区*/}
            <Box>
                {imgItems.length <= 0 || loading ? <CircularProgress/> : (
                    imgDisplayMode === DetailImgMode.PageMode ? <PageImgViewer/> : <InfinityImgViewer/>
                )}
            </Box>
        </Container>
    )
}