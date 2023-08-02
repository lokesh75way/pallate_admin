import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';

const dummyUsers = [
  {
    id: "1",
    name: "John Doe",
    age: 30,
    email: "john.doe@example.com",
  },
  {
    id: "2",
    name: "Jane Smith",
    age: 25,
    email: "jane.smith@example.com",
  },
  {
    id: "3",
    name: "Michael Johnson",
    age: 28,
    email: "michael.johnson@example.com",
  },
];

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    boxShadow: "0 2px 5px rgba(1, 1, 1, 0.1)",
    width:'25%',
    marginLeft: "37.5%",
    height: "200px",
    backgroundColor: "#fff",
  },
  title: {
    color: "#333",
    marginBottom: "10px",
  },
  age: {
    color: "#555",
  },
  email: {
    color: "#555",
  },
  image: {
    maxWidth: "100%",
    height: "300px",
    marginTop: "10px",
  },
  addBox: {
    margin:'100px -180px 0 0px',
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginLeft: "100px",
    backgroundColor: "white",
    color: "black",
    "&:hover": {
      backgroundColor: "white",
      color: "black",
    },
  },
}));

const UserShowPage = () => {
  const classes = useStyles();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const handleEditButton = () => {
    navigate(`/ingredients/create`);
  };

  const user = dummyUsers.find((item) => item.id === id);

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <>
      <Box className={classes.addBox}>
        <Button
          onClick={handleEditButton}
          startIcon={<AddIcon />}
          className={classes.button}
        >
          Add Item
        </Button>
      </Box>
      <Box className={classes.container}>
        <Typography variant="h3" className={classes.title}>
          {user.name}
        </Typography>
        <Typography className={classes.age}>Age: {user.age}</Typography>
        <Typography className={classes.email}>Email: {user.email}</Typography>

      </Box>
    </>
  );
};

export default UserShowPage;