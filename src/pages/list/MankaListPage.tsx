import React, {useEffect, useState} from 'react';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ListIcon from '@mui/icons-material/List';
import GridViewIcon from '@mui/icons-material/GridView';
import IconButton from '@mui/material/IconButton';
import TextRotateUpIcon from '@mui/icons-material/TextRotateUp';
import TextRotationDownIcon from '@mui/icons-material/TextRotationDown';
import {MankaArchive, MankaArchiveTag, PageMankaArchive, SearchGroup} from '../../types';
import {DisplayMode, RankField, RankMode} from './types'
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import StarIcon from '@mui/icons-material/Star';
import {
    Box,
    ButtonGroup,
    CircularProgress,
    Container,
    Input,
    MenuItem,
    Pagination,
    Select,
    SelectChangeEvent,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import MankaImgListPage from './MankaImgListPage';
import MankaTableListPage from './MankaTableListPage';
import API from '../../middleware/api';
import {Response} from '../../types/response';

import {useLocation} from "react-router";

function useQueryParams() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    // 将URLSearchParams对象转换为普通对象
    let params: any = {};
    searchParams.forEach((value, name, searchParams) => {
        params[name] = value
    })

    return params;
}

const MankaListPage: React.FC = () => {
    const {queryText = ""} = useQueryParams()

    // searchText
    const [searchText, setSearchText] = useState<string>(queryText);
    // displayMode
    const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.TableList); // 默认是table 
    // rankMode
    const [rankMode, setRankMode] = useState<RankMode>(RankMode.DESC); // 默认是desc

    const [rankField, setRankField] = useState<RankField>(RankField.ArchiveUpdatedTime);// 默认是按照更新时间降序

    //页数
    const [page, setPage] = useState<number>(1);

    const [pageSize, setPageSize] = useState<number>(25);

    const [pageTotal, setPageTotal] = useState<number>(0);

    const [loading, setLoading] = useState<boolean>(false);

    const [pageData, setPageData] = useState<MankaArchive[]>([]);
    const [searchGroups, setSearchGroups] = useState<SearchGroup[]>([]);
    const [searchResultText, setSearchResultText] = useState<string>("");

    useEffect(() => {
        handleSearch()
    }, [page, pageSize, rankMode, rankField])

    useEffect(() => {
        fetchSearchGroups()
    }, []);

    /**
     * 清理searchText
     */
    const handleClearSearch = () => {
        setPage(1);
        setSearchText('');
        handleSearch("")
    };

    const fetchSearchGroups = async () => {
        console.log("fetchSearchGroups...")
        try {
            const {data: {data}} = await API.get<Response<SearchGroup[]>>(`/searchGroup/list`)
            console.log("queryRes", data)
            setSearchGroups(data)
        } catch (e) {
            console.error("err", e)
            alert(e)
        } finally {
        }

    }

    /**
     * 改变displayMode
     */
    const handleDisplayModeChange = () => {
        setDisplayMode((prevMode) => (prevMode === DisplayMode.TableList ? DisplayMode.ImageList : DisplayMode.TableList));
    };


    const handleRankFieldChange = (e: SelectChangeEvent<RankField>) => {

        setRankField(e.target.value as RankField)
    }

    const handlePageSizeChange = (e: SelectChangeEvent<number>) => {
        setPageSize(e.target.value as number)
    }

    /**
     * 改变rankMode
     */
    const handleRankModeChange = () => {
        setRankMode((prevMode) => (prevMode === RankMode.ASC ? RankMode.DESC : RankMode.ASC));
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setSearchText(event.target.value)
    }

    // const handleRankFieldChange = (field: RankField) => {
    //     unstable_batchedUpdates(()=>{
    //         setRankField(field)
    //         setSortMenuAnchor(null)
    //     })
    // }


    const handleSearch = async (queryText?: string): Promise<void> => {
        console.log("handleSearch...")
        setLoading(true)
        queryText = queryText === undefined ? searchText : queryText
        const query = {
            query: queryText,
            page: {
                pageNo: page,
                pageSize: pageSize
            },
            order: [
                {
                    field: rankField,
                    Asc: rankMode === RankMode.ASC
                }
            ]
        }
        console.log("query", query)
        try {
            const {data: {data}} = await API.post<Response<PageMankaArchive>>("/manka/search", query)
            console.log("queryRes", data)
            setPageTotal(data.pageTotal);
            setPageData(data.pageData);
            if (queryText !== "") {
                setSearchResultText(`搜索: ${queryText} 结果数: ${data.pageTotal}`)
            } else {
                setSearchResultText("")
            }
        } catch (e) {
            console.error("err", e)
            alert(e)
        } finally {
            setLoading(false)
        }
    }

    const appendSearchText = (addSearchText: string) => {

        const searchSegs = searchText.length <= 0 ? [] : searchText.split(",")
        const addSegs = addSearchText.split(",")
        console.log("searchSegs", searchSegs)
        console.log("addSegs", addSegs)
        const result = [...searchSegs]
        addSegs.forEach(addSeg => {
            if (result.indexOf(addSeg) === -1) {
                result.push(addSeg)
            }
        })
        console.log("result", addSegs)
        const newSearchText = result.join(",")
        setSearchText(newSearchText)
        handleSearch(newSearchText)


    }


    const handleSearchGroupRemove = async (searchGroupId: string) => {
        console.log(`will to remove searchGroup[${searchGroupId}]`)
        try {
            await API.get<Response<any>>(`/searchGroup/remove/${searchGroupId}`)
            //refetch
            fetchSearchGroups()
        } catch (e) {
            console.error("err", e)
            alert(e)
        } finally {
        }
    }

    const addQueryToSearchGroup = async (query: string) => {
        console.log(`will add ${query} to addQueryToSearchGroup`)
        try {
            const data = {
                searchGroupName: query,
                searchQuery: query,
            }
            await API.post<Response<any>>("/searchGroup/add", data)
            //refetch
            fetchSearchGroups()
        } catch (e) {
            console.error("err", e)
            alert(e)
        } finally {
        }
    }

    const clickTagCallback = (tag: MankaArchiveTag) => {
        console.log("clickTagCallback", tag)
        appendSearchText(`${tag.tagName}:${tag.tagValue}`)
    }

    const SearchGroupStack: React.FC = () => {

        return (
            <React.Fragment>
                <Stack direction="row" spacing={1}>
                    {
                        searchGroups && searchGroups.length > 0 && searchGroups.map((sg) =>
                            <Chip label={sg.searchGroupName}
                                  icon={<StarIcon fontSize={"small"}/>}
                                  variant="outlined"
                                  key={sg.searchGroupId}
                                  size={"small"}
                                  onClick={() => appendSearchText(sg.searchQuery)}
                                  onDelete={async () => handleSearchGroupRemove(sg.searchGroupId)}
                            />
                        )
                    }
                </Stack>
            </React.Fragment>

        );
    };

    const addToFavorite = async (manka: MankaArchive) => {
        console.log("addToFavorite", manka)
        try {
            const data = {
                archiveId: manka.archiveId
            }
            await API.post<Response<any>>(`/favorite/add`, data)
            handleSearch()
        } catch (e) {
            console.error("err", e)
            alert(e)
        } finally {
            setLoading(false)
        }
    }

    const deleteFavorite = async (favoriteId: string) => {
        console.log("deleteFavorite", favoriteId)
        try {
            await API.get<Response<any>>(`/favorite/remove/${favoriteId}`)
            handleSearch()
        } catch (e) {
            console.error("err", e)
            alert(e)
        } finally {
            setLoading(false)
        }
    }


    return (
        <Box>
            <Box display="flex" alignItems="center" justifyContent="center">
                <Typography variant="h4" align="center">welcome!</Typography>
            </Box>
            <Box>
                <Container maxWidth={"xl"}>
                    <Box>
                        <SearchGroupStack/>
                    </Box>
                    <Box>
                        <TextField
                            size={"small"}
                            fullWidth
                            variant="outlined"
                            placeholder="search..."
                            value={searchText}
                            disabled={loading}
                            onChange={handleSearchChange}
                            InputProps={{
                                endAdornment: (
                                    <ButtonGroup>
                                        <IconButton onClick={() => handleSearch()}>
                                            <SearchIcon/>
                                        </IconButton>
                                        <IconButton onClick={handleClearSearch} disabled={searchText === ""}>
                                            <ClearIcon/>
                                        </IconButton>
                                    </ButtonGroup>
                                ),
                            }}/>
                    </Box>
                    {searchResultText != "" &&
                        (
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Typography align="center">{searchResultText}</Typography>
                                <Tooltip title={"加入搜索组"}>
                                    <IconButton onClick={() => addQueryToSearchGroup(searchText)}>
                                        <AddIcon/>
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )
                    }
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box>
                            <Select
                                labelId="sort-select"
                                id="sort-select"
                                value={rankField}
                                onChange={handleRankFieldChange}
                                input={<Input/>}
                                disabled={loading}

                            >

                                <MenuItem value={RankField.ArchiveName}>名称
                                </MenuItem>
                                <MenuItem value={RankField.ArchiveSize}>大小
                                </MenuItem>
                                <MenuItem value={RankField.ArchiveTotalPage}>页数
                                </MenuItem>
                                <MenuItem value={RankField.ArchiveCreatedTime}>系统录入时间
                                </MenuItem>
                                <MenuItem value={RankField.ArchiveUpdatedTime}>系统更新时间
                                </MenuItem>
                                <MenuItem value={RankField.ArchiveModTime}>档案修改时间
                                </MenuItem>
                                <MenuItem value={RankField.ArchiveLastReadAt}>最后阅读时间
                                </MenuItem>
                            </Select>
                            <IconButton
                                title={"sortMethod"}
                                onClick={handleRankModeChange}
                                color={"inherit"}
                                disabled={loading}
                            >
                                {rankMode === RankMode.DESC ? <TextRotationDownIcon/> : <TextRotateUpIcon/>}
                            </IconButton>
                        </Box>
                        <Box>
                            <Pagination
                                disabled={loading}
                                count={Math.ceil(pageTotal / pageSize)}
                                page={page}
                                onChange={(e, page) => setPage(page)}
                                variant="outlined"
                                shape="rounded"
                                size="small"
                                siblingCount={1}
                                boundaryCount={1}
                                showFirstButton
                                showLastButton/>

                        </Box>
                        <Box>
                            <Select
                                labelId="pageSize-select"
                                id="pageSize-select"
                                value={pageSize}
                                onChange={handlePageSizeChange}
                                input={<Input/>}
                                disabled={loading}
                                size='small'
                            >
                                <MenuItem value={10}>10
                                </MenuItem>
                                <MenuItem value={25}>25
                                </MenuItem>
                                <MenuItem value={35}>35
                                </MenuItem>
                                <MenuItem value={50}>50
                                </MenuItem>
                                <MenuItem value={100}>100
                                </MenuItem>
                            </Select>
                            <IconButton disabled={loading} onClick={handleDisplayModeChange}>
                                {displayMode === DisplayMode.TableList ? <GridViewIcon/> : <ListIcon/>}
                            </IconButton>
                        </Box>
                    </Box>
                    {
                        loading ? <CircularProgress/> :
                            (displayMode === DisplayMode.ImageList ? (
                                <MankaImgListPage
                                    mankaData={pageData}
                                    clickTagCallback={clickTagCallback}
                                    addToFavorite={addToFavorite}
                                    deleteFavorite={deleteFavorite}
                                />
                            ) : (
                                <MankaTableListPage
                                    mankaData={pageData}
                                    clickTagCallback={clickTagCallback}
                                    addToFavorite={addToFavorite}
                                    deleteFavorite={deleteFavorite}
                                />
                            ))
                    }
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box>
                            <Select
                                labelId="sort-select"
                                id="sort-select"
                                value={rankField}
                                onChange={handleRankFieldChange}
                                input={<Input/>}
                                disabled={loading}

                            >

                                <MenuItem value={RankField.ArchiveName}>名称
                                </MenuItem>
                                <MenuItem value={RankField.ArchiveSize}>大小
                                </MenuItem>
                                <MenuItem value={RankField.ArchiveTotalPage}>页数
                                </MenuItem>
                                <MenuItem value={RankField.ArchiveCreatedTime}>系统录入时间
                                </MenuItem>
                                <MenuItem value={RankField.ArchiveUpdatedTime}>系统更新时间
                                </MenuItem>
                                <MenuItem value={RankField.ArchiveModTime}>档案修改时间
                                </MenuItem>
                                <MenuItem value={RankField.ArchiveLastReadAt}>最后阅读时间
                                </MenuItem>
                            </Select>
                            <IconButton
                                title={"sortMethod"}
                                onClick={handleRankModeChange}
                                color={"inherit"}
                                disabled={loading}
                            >
                                {rankMode === RankMode.DESC ? <TextRotationDownIcon/> : <TextRotateUpIcon/>}
                            </IconButton>
                        </Box>
                        <Box>
                            <Pagination
                                disabled={loading}
                                count={Math.ceil(pageTotal / pageSize)}
                                page={page}
                                onChange={(e, page) => setPage(page)}
                                variant="outlined"
                                shape="rounded"
                                size="small"
                                siblingCount={1}
                                boundaryCount={1}
                                showFirstButton
                                showLastButton/>

                        </Box>
                        <Box>
                            <Select
                                labelId="pageSize-select"
                                id="pageSize-select"
                                value={pageSize}
                                onChange={handlePageSizeChange}
                                input={<Input/>}
                                disabled={loading}
                                size='small'
                            >
                                <MenuItem value={10}>10
                                </MenuItem>
                                <MenuItem value={25}>25
                                </MenuItem>
                                <MenuItem value={35}>35
                                </MenuItem>
                                <MenuItem value={50}>50
                                </MenuItem>
                                <MenuItem value={100}>100
                                </MenuItem>
                            </Select>
                            <IconButton disabled={loading} onClick={handleDisplayModeChange}>
                                {displayMode === DisplayMode.TableList ? <GridViewIcon/> : <ListIcon/>}
                            </IconButton>
                        </Box>
                    </Box>
                </Container>
            </Box>
        </Box>

    );
};

export default MankaListPage;
