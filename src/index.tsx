import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import theme from './util/theme';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@emotion/react';
import store from '../src/store/store'


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
     <Provider store={store}>

    <App />
    </Provider>
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();