import React, {useState} from 'react';
import MankaListPage from './pages/list/MankaListPage';
import MankaDetailPage from './pages/detail/MankaDetailPage';
import {Breadcrumbs, createTheme, Link, ThemeProvider, useMediaQuery} from '@mui/material';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Login from './pages/login/Login';
import AuthWrapComponent from './AuthWrapComponent';
import FavoriteList from "./pages/list/FavoriteList";
import TaskPage from "./pages/admin/TaskPage";
import TaskLogPage from "./pages/admin/TaskLogPage";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
});


function App() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
    const [open, setOpen] = useState(true);

    return (
        // <ThemeProvider theme={theme}>
        //   <CssBaseline />
        //   <ComicListPage />
        // </ThemeProvider>
        <React.Fragment>
            <ThemeProvider theme={lightTheme}>
                <BrowserRouter>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link underline="hover" color="inherit" href="/">
                            Home
                        </Link>
                        <Link underline="hover" color="inherit" href="/favorite">
                            Favorite
                        </Link>
                        <Link
                            underline="hover"
                            color="inherit"
                            href="/tasks"
                        >
                            Tasks
                        </Link>
                        <Link
                            underline="hover"
                            color="inherit"
                            href="/taskLogs"
                        >
                            TaskLogs
                        </Link>
                    </Breadcrumbs>
                    <Routes>
                        <Route path="/" element={<AuthWrapComponent>
                            <MankaListPage/>
                        </AuthWrapComponent>}/>
                        <Route path="/favorite" element={<AuthWrapComponent>
                            <FavoriteList/>
                        </AuthWrapComponent>}/>
                        <Route path="/tasks" element={<AuthWrapComponent>
                            <TaskPage/>
                        </AuthWrapComponent>}/>
                        <Route path="/taskLogs" element={<AuthWrapComponent>
                            <TaskLogPage/>
                        </AuthWrapComponent>}/>
                        <Route path="/manka/:mankaId" element={<AuthWrapComponent>
                            <MankaDetailPage/>
                        </AuthWrapComponent>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="*" element={<Navigate replace to="/"/>}/>
                    </Routes>
                </BrowserRouter>
                {/*<BrowserRouter>*/}
                {/*    <Box sx={{ display: "flex" }}>*/}
                {/*        <Drawer*/}
                {/*            variant="persistent"*/}
                {/*            open={open}*/}
                {/*            sx={{*/}
                {/*                width: 150,*/}
                {/*                flexShrink: 0,*/}
                {/*                "& .MuiDrawer-paper": {*/}
                {/*                    width: 150,*/}
                {/*                    boxSizing: "border-box",*/}
                {/*                },*/}
                {/*            }}*/}
                {/*        >*/}
                {/*        <List>*/}
                {/*            <ListItem button component={RouterLink as any} to="/">*/}
                {/*                <ListItemText primary="Home"/>*/}
                {/*            </ListItem>*/}
                {/*            <ListItem button component={RouterLink as any} to="/admin">*/}
                {/*                <ListItemText primary="Admin"/>*/}
                {/*            </ListItem>*/}
                {/*        </List>*/}
                {/*    </Drawer>*/}
                {/*    <Box component="main" sx={{ flexGrow: 1, p: 1}}>*/}
                {/*            <Routes>*/}
                {/*                <Route path="/" element={<AuthWrapComponent>*/}
                {/*                    <MankaListPage/>*/}
                {/*                </AuthWrapComponent>}/>*/}
                {/*                <Route path="/manka/:mankaId" element={<AuthWrapComponent>*/}
                {/*                    <MankaDetailPage/>*/}
                {/*                </AuthWrapComponent>}/>*/}
                {/*                <Route path="/login" element={<Login/>}/>*/}
                {/*                <Route path="*" element={<Navigate replace to="/"/>}/>*/}
                {/*            </Routes>*/}

                {/*    </Box>*/}
                {/*</Box>*/}
                {/*</BrowserRouter>*/}
            </ThemeProvider>
        </React.Fragment>

    );
}

export default App;
