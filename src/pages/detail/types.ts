import {ThumbDown} from "@mui/icons-material";

export enum DetailImgMode {
    InfinityMode = "infinityMode",
    PageMode = "pageMode"
}

export enum ImgRankMode {
    ASC = "asc",
    DESC = "desc"
}

export enum ImgRankField {
    ImgIndex = "archiveItemIndex", //默认是 这个
    ImgName = "archiveItemName",
    ImgSize = "archiveItemSize"
}

export enum ImgSpec {
    NormalImg = "normalImg",
    ThumbImg = "thumbImg",
    OriginImg = "originImg"
}