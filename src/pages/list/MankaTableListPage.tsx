import React, {useState} from 'react';
import {
    Chip,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from '@mui/material'
import {MankaArchive, MankaArchiveTag} from '../../types';
import _ from 'lodash';
import MankaTagsPanelPopover from './MankaTagsPanelPopover';
import MankaCoverPanelPopover from './MankaCoverPanelPopover';
import {formatLocalTime} from '../../utils/datetime';
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {TableColumn} from "../../types/func";
import Stack from "@mui/material/Stack";

export interface MankaTableListPageProps {

    mankaData: MankaArchive[];

    //onMankaClick?:(event:React.MouseEvent<HTMLTableRowElement, MouseEvent>,manka:MankaArchive) => void

    //onTitleMouseEnter?: (event:React.MouseEvent<HTMLElement>,manka:MankaArchive) => void

    //onTitleMouseLeave?:(event:React.MouseEvent<HTMLElement>,manka:MankaArchive) => void

    clickTagCallback?: (tag: MankaArchiveTag) => void;

    addToFavorite?: (archive: MankaArchive) => void;

    deleteFavorite?: (favoriteId: string) => void;


}

export interface MankaTableRow {
    manka: MankaArchive,
    event: MankaArchiveTag[]
    artist: MankaArchiveTag[]
    group: MankaArchiveTag[]
    series: MankaArchiveTag[]
}

const getTagValuesMap = (tags: MankaArchiveTag[] | undefined) => {
    if (!tags) return {}
    return _.groupBy(tags, tag => tag.tagName)
}

const getMankaTableRow = (mankaData: MankaArchive): MankaTableRow => {
    const tagsMap = getTagValuesMap(mankaData.tags)
    const {event = [], artist = [], group = [], series = []} = tagsMap
    return {
        manka: mankaData,
        event,
        artist,
        group,
        series
    } as MankaTableRow
}

export default function MankaTableListPage(options: MankaTableListPageProps) {

    const {mankaData, clickTagCallback, addToFavorite, deleteFavorite} = options;

    const [mankaTableRows, setMankaTableRows] = useState<MankaTableRow[]>(mankaData.map(manka => getMankaTableRow(manka)));

    // 当前的manka
    const [currentManka, setCurrentManka] = useState<MankaArchive>();
    // tagsPanelPopoverAnchor
    const [tagsPanelPopoverAnchor, setTagsPanelPopoverAnchor] = useState<HTMLElement | null>(null);

    // coverPopoverAnchor
    const [coverPopoverAnchor, setCoverPopoverAnchor] = useState<HTMLElement | null>(null);

    const onTitleMouseEnter = (event: React.MouseEvent<HTMLElement>, manka: MankaArchive) => {
        console.log("onTitleMouseEnter", event.currentTarget)
        if (event.currentTarget) {
            setCurrentManka(manka)
            setCoverPopoverAnchor(event.currentTarget)
        }

    }

    const onTitleMouseLeave = (event: React.MouseEvent<HTMLElement>, manka: MankaArchive) => {
        if (event.currentTarget) {
            setCurrentManka(manka)
            setCoverPopoverAnchor(null)
        }


    }

    const onTagsMouseEnter = (event: React.MouseEvent<HTMLElement>, manka: MankaArchive) => {
        console.log("onTagsMouseEnter", event.currentTarget)
        if (event.currentTarget) {
            setCurrentManka(manka)
            setTagsPanelPopoverAnchor(event.currentTarget)
        }


    }


    const onMankaClick = (manka: MankaArchive) => {
        // setCurrentManka(manka)
        console.log(`你点击了漫画：${manka.archiveName}`);
        //打开漫画
        setTimeout(() => {
            window.location.href = `/manka/${manka.archiveId}`
        }, 100)

    }

    const TagStack: React.FC<{ tags: MankaArchiveTag[] }> = ({tags}) => {

        return <>
            {/*<Stack direction="row" spacing={0.5}>*/}
            {/*    {tags.map(tag => (*/}
            {/*        <Chip key={`${tag.tagName}_${tag.tagValue}`} label={tag.tagValue} size={"small"}*/}
            {/*              onClick={() => clickTagCallback ? clickTagCallback(tag) : null}/>*/}
            {/*    ))}*/}
            {/*</Stack>*/}
            {tags.map(tag => (
                <Chip key={`${tag.tagName}_${tag.tagValue}`} label={tag.tagValue} size={"small"}
                      onClick={() => clickTagCallback ? clickTagCallback(tag) : null}/>
            ))}
        </>
    }


    const columns: TableColumn[] = [
        {
            id: "manka",
            label: "",
            style: {minWidth: 50},
            align: "center",
            format: (manka: MankaArchive, row) => {
                // console.log("manka", manka, "row", row)
                return <>
                    {
                        manka.belongFavoriteId ? <Tooltip title={"取消收藏"}>
                            <IconButton aria-label="settings"
                                        onClick={() => deleteFavorite && manka.belongFavoriteId ? deleteFavorite(manka.belongFavoriteId) : null}>
                                <CloseIcon/>
                            </IconButton>
                        </Tooltip> : <Tooltip title={"加入收藏"}>
                            <IconButton aria-label="settings"
                                        onClick={() => addToFavorite ? addToFavorite(manka) : null}>
                                <AddIcon/>
                            </IconButton>
                        </Tooltip>
                    }
                </>
            }
        },
        {
            id: "manka.archiveName",
            label: "漫画标题",
            style: {minWidth: 120, wordBreak: "break-all"},
            align: "center",
            format: (archiveName: string, row: MankaTableRow) => {
                return <>
                    <Typography
                        onMouseEnter={(e) => onTitleMouseEnter(e, row.manka)}
                        onMouseLeave={(e) => onTitleMouseLeave(e, row.manka)}
                        onClick={(e) => onMankaClick(row.manka)}
                    >
                        {archiveName}
                    </Typography>
                </>
            }
        },
        {
            id: "artist",
            label: "作者组",
            style: {minWidth: 50},
            align: "center",
            format: (artists: MankaArchiveTag[], row: MankaTableRow) => {
                return <>
                    <TagStack tags={artists}/>
                </>
            }
        },
        {
            id: "group",
            label: "团队组",
            style: {minWidth: 50},
            align: "center",
            format: (groups: MankaArchiveTag[], row: MankaTableRow) => {
                return <>
                    <TagStack tags={groups}/>
                </>
            }
        },
        {
            id: "event",
            label: "事件组",
            style: {minWidth: 50},
            align: "center",
            format: (events: MankaArchiveTag[], row: MankaTableRow) => {
                return <>
                    <TagStack tags={events}/>
                </>
            }
        },
        {
            id: "series",
            label: "系列组",
            style: {minWidth: 50},
            align: "center",
            format: (series: MankaArchiveTag[], row: MankaTableRow) => {
                return <>
                    <TagStack tags={series}/>
                </>
            }
        },
        {
            id: "manka.archiveTotalPage",
            label: "阅读情况",
            style: {minWidth: 40},
            align: "center",
            format: (value, row) => {
                return `${row.manka.lastReadPage}/${row.manka.archiveTotalPage}`
            }
        },
        {
            id: "manka.archiveCreatedTime",
            label: "录入时间",
            style: {minWidth: 50},
            align: "center",
            format: (value, row) => {
                return formatLocalTime(value)
            }
        },
        {
            id: "manka.archiveModTime",
            label: "档案时间",
            style: {minWidth: 100},
            align: "center",
            format: (value, row) => {
                return formatLocalTime(value)
            }
        },
        {
            id: "manka.tags",
            label: "标签组",
            style: {minWidth: 100},
            align: "center",
            format: (tags: MankaArchiveTag[], row: MankaTableRow) => {
                // console.log("tags", tags, "row", row)
                let tagsInfo = tags.length > 5 ? tags.slice(0, 5).map(tag => tag.tagValue).join(",") + "..." : tags.map(tag => tag.tagValue).join(",")
                return <>
                    <Typography
                        onMouseEnter={(e) => onTagsMouseEnter(e, row.manka)}
                    >
                        {tagsInfo}
                    </Typography>
                </>
            }
        },
    ];


    return (
        <>
            {currentManka && <MankaTagsPanelPopover
                anchorEl={tagsPanelPopoverAnchor}
                onClose={() => setTagsPanelPopoverAnchor(null)}
                clickTagCallback={clickTagCallback}
                manka={currentManka}
            />}
            {/* coverPopover */}
            {currentManka && <MankaCoverPanelPopover
                anchorEl={coverPopoverAnchor}
                onClose={() => setCoverPopoverAnchor(null)}
                manka={currentManka}
            />}
            <Paper sx={{width: '100%'}}>
                <TableContainer sx={{maxHeight: '75vh'}}>
                    <Table stickyHeader aria-label="sticky table" size="small">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{...column.style}}
                                        {...column.cellProps}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mankaTableRows.map((row, index) => {
                                return (
                                    <TableRow
                                        hover
                                        // role="checkbox"
                                        tabIndex={-1}
                                        key={index}
                                    >
                                        {columns.map((column) => {
                                            // @ts-ignore
                                            const value = _.get(row, column.id);
                                            return (
                                                <TableCell
                                                    key={column.id}
                                                    align={column.align}
                                                    style={{...column.style}}
                                                    {...column.cellProps}
                                                >
                                                    {column.format ? column.format(value, row) : value}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </>
    )
}