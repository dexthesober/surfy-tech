import * as React from 'react'
import { Provider } from 'react-redux'
import store from '../store'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Head from 'next/head'

export default function MyApp({ Component, pageProps }) {
  const [mode, setMode] = React.useState('light')
  const theme = React.useMemo(() => createTheme({ palette: { mode } }), [mode])
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Head><meta name='viewport' content='initial-scale=1, width=device-width' /></Head>
        <Component {...pageProps} themeMode={mode} setThemeMode={setMode} />
      </ThemeProvider>
    </Provider>
  )
}