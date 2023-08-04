import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "@mui/material/styles/styled";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { useGetIngredientByIdQuery } from "../../services/userApi";

const Container = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  boxShadow: "0 2px 5px rgba(1, 1, 1, 0.1)",
  maxWidth: "400px",
  marginLeft: "40%",
  backgroundColor: "#fff",
});
const AddBox = styled(Box)({
  maxWidth: "400px",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",

  marginTop: "80px",
  marginLeft: "43%",
});

const Title = styled(Typography)({
  color: "#333",
  marginBottom: "10px",
});

const Quantity = styled(Typography)({
  color: "#555",
});

const Date = styled(Typography)({
  color: "#555",
});

const Unit = styled(Typography)({
  color: "#555",
});

const Image = styled("img")({
  maxWidth: "100%",
  height: "200px",
  marginTop: "10px",
});

const StyledButton = styled(Button)({
  margin: "10px",
  backgroundColor: "white",
  color: "black",

  "&:hover": {
    backgroundColor: "white",
    color: "black",
  },
});

const IngredientShowPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const ingredientId = id || "";

  const navigate = useNavigate();
  const { data: ingredient } = useGetIngredientByIdQuery(ingredientId);
  console.log(ingredient)
  
  const handleAddButton = () => {
    navigate("/ingredients/create");
  };
  const handleEditButton = () => {

    navigate(`/ingredients/${id}/editForm`);

  };

  if (!ingredient) {
    return <div>Ingredient not found</div>;
  }

  return (
    <>
      <AddBox>
        <StyledButton onClick={handleAddButton} startIcon={<AddIcon />}>
          Add Item
        </StyledButton>
        <StyledButton onClick={handleEditButton} startIcon={<EditIcon />}>
          Edit Item
        </StyledButton>
      </AddBox>
      <Container>
        <Title variant="h2">{ingredient.data.ingredient.name}</Title>
        <Quantity>
          Quantity: {ingredient.data.ingredient.quantity} {ingredient.unit}
        </Quantity>
        <Quantity>
          Price: {ingredient.data.ingredient.price}
        </Quantity>

        <Date>Expiry: {ingredient.data.ingredient.expiry.split("T")[0]}</Date>


        <Image src={ingredient.data.ingredient.image} alt={ingredient.name} />
      </Container>
    </>
  );
};

export default IngredientShowPage;