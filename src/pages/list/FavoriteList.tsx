import {Favorite} from "../../types";
import React, {useEffect, useState} from "react";
import API from "../../middleware/api";
import {Response} from "../../types/response";
import {CircularProgress, Container, Typography} from "@mui/material";
import FavoriteImgListPage from "./FavoriteImgListPage";


export default function FavoriteList() {

    const [favoriteList, setFavoriteList] = useState<Favorite[]>();
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        fetchFavoriteList()
    }, []);

    const fetchFavoriteList = async () => {
        setLoading(true)
        try {
            const {data: {data}} = await API.get<Response<Favorite[]>>("/favorite/list")
            setFavoriteList(data)
        } catch (e) {
            console.error("err", e)
            alert(e)
        } finally {
            setLoading(false)
        }
    }

    const deleteFavorite = async (favorite: Favorite) => {
        console.log("deleteFavorite", favorite)
        try {
            await API.get<Response<any>>(`/favorite/remove/${favorite.favoriteId}`)
            fetchFavoriteList()
        } catch (e) {
            console.error("err", e)
            alert(e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Container>
                {
                    loading ? <CircularProgress/> :
                        (favoriteList && favoriteList.length > 0 && <>
                            <Typography>{`总收藏数: ${favoriteList.length}`}</Typography>
                            <FavoriteImgListPage
                                favorites={favoriteList}
                                deleteFavorite={deleteFavorite}
                            />
                        </>)
                }
            </Container>
        </>
    )
}