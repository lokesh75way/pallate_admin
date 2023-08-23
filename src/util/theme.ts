import { createTheme } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
  palette: {
    primary: {
      main: "#002D62",
      dark: "#002D62",
    },
    common: {
      white: "#ffffff",
    },
  },
});

export default theme;
