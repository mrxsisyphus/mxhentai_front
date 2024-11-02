import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { SnackbarProvider } from 'notistack';
import { ConfirmProvider } from "material-ui-confirm";


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <ConfirmProvider>
    <SnackbarProvider autoHideDuration={6000} maxSnack={3}>
      <App />
    </SnackbarProvider>
  </ConfirmProvider>
);

