import React from "react";
import { Divider, Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Link } from "react-router-dom";
import { useGetIngredientsQuery } from "../store/slices/ingredientSlice";
import { useGetUsersQuery } from "../store/slices/userSlice";

const useStyles = makeStyles({
  paper: {
    width: "300px",
    height: "100px",
    padding: 10,
    backgroundColor: "white",
  },

  paperHead: {
    fontSize: 20,
    fontWeight: "normal",
    color: "black",
  },

  paperSubCount: {
    fontSize: 15,
    fontWeight: "normal",
    color: "rgb(173, 173, 173)",
  },

  paperCount: {
    fontSize: 40,
    padding: 0,
    marginLeft: "10px",
    fontWeight: "bold",
    color: "#002D62",
  },

  link: {
    textDecoration: "none",
    fontSize: 15,
  },
});

const DashBoard = () => {
  const classes = useStyles();
  const {
    data: users,
    isLoading: usersLoading,
    isError: usersError,
  } = useGetUsersQuery();
  const {
    data: ingredients,
    isLoading: ingredientsLoading,
    isError: ingredientsError,
  } = useGetIngredientsQuery();

  return (
    <div>
      <Typography
        sx={{
          margin: "10px",
          fontSize: 30,
        }}
      >
        Hi, Welcome!
      </Typography>
      <Divider />

      <div
        style={{
          display: "flex",
          gap: 20,
          marginTop: "10px",
        }}
      >
        <Paper elevation={2} className={classes.paper}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography className={classes.paperCount}>
              {usersLoading || usersError ? "00,00" : users?.length}
            </Typography>
            <Link className={classes.link} to="/users">
              View All
            </Link>
          </div>
          <Typography className={classes.paperHead}>Users</Typography>
        </Paper>
        <Paper elevation={2} className={classes.paper}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography className={classes.paperCount}>
              {ingredientsLoading || ingredientsError
                ? "00,00"
                : ingredients?.length}
            </Typography>
            <Link className={classes.link} to="/ingredients">
              View All
            </Link>
          </div>
          <Typography className={classes.paperHead}>Ingredients</Typography>
        </Paper>
      </div>
    </div>
  );
};

export default DashBoard;
