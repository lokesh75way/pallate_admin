import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "@mui/material/styles/styled";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

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
  const navigate = useNavigate();
  const [ingredient, setIngredient] = useState<any | null>(null);

  useEffect(() => {
    const fetchIngredient = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/ingredients/${id}`,
          {
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY0YzFlYjMyNTg0Mjk4YjUxNjI1YWNkZiIsIm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AcGFsbGF0ZS5jb20iLCJhY3RpdmUiOnRydWUsInBhc3N3b3JkIjoiJDJiJDEyJE9sbHBmSmR3akNHV2F3cnNJeHgwSnVqVUxOZ2NsTXpSejUwVjZwN2V3elFJMERiRTR2LjdtIiwicm9sZSI6IkFETUlOIiwiY3JlYXRlZEF0IjoiMjAyMy0wNy0yMFQxMjoyMjozOC42NThaIiwidXBkYXRlZEF0IjoiMjAyMy0wNy0yMVQwOToyNToyNS4yOTdaIiwiX192IjowfSwiaWF0IjoxNjkwODA2OTk0fQ.7vspbw1A1N019ewYYojPHS8AyMlHzlxk134f_c5GlUI`,
              "ngrok-skip-browser-warning": true,
            },
          }
        );

        const data = response.data.data.ingredient;
        setIngredient(data);
      } catch (error) {
        console.error("Error fetching ingredient:", error);
      }
    };
    fetchIngredient();
  }, [id]);

  const handleAddButton = () => {
    navigate("/ingredients/create");
  };
  const handleEditButton = () => {
    navigate("/ingredients/editForm");
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
        <Title variant="h2">{ingredient.name}</Title>
        <Quantity>
          Quantity: {ingredient.quantity} {ingredient.unit}
        </Quantity>
        <Date>Expiry: {ingredient.expiry.split("T")[0]}</Date>

        <Image src={ingredient.picture} alt={ingredient.name} />
      </Container>
    </>
  );
};

export default IngredientShowPage;