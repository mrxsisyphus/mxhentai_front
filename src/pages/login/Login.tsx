import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import API from '../../middleware/api';
import { Response } from '../../types/response';
import Auth from '../../middleware/auth';

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [loading,setLoading] = useState<boolean>(false)

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  };

  const paperStyle: React.CSSProperties = {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const formStyle: React.CSSProperties = {
    width: '100%',
    marginTop: '16px',
  };

  const submitStyle: React.CSSProperties = {
    margin: '24px 0 16px',
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    // 在这里添加处理登录的逻辑
    try{
        const data = await API.post<Response<any>>("/user/login",{
            userName:username,
            password:password
        })
        console.log("data",data)
        Auth.login()
        window.location.href="/"
    }catch(e){
        console.error("err",e)
      alert(e)
    }finally{
        setLoading(false)
    }
  };

  return (
    <Container component="main" maxWidth="xs" style={containerStyle}>
      <CssBaseline />
      <Paper elevation={3} style={paperStyle}>
        <Typography variant="h5">Login</Typography>
        <form style={formStyle} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Username"
            name="username"
            value={username}
            onChange={handleUsernameChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={submitStyle}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
