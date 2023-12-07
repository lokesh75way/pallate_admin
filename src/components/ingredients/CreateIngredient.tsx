import React from "react";
import { Typography, Divider } from "@mui/material";
import { useCreateIngredientsMutation } from "../../store/slices/ingredientSlice";
import IngredientForm, { IngredientFormType } from "./IngredientForm";
import useGenerateRecipe from "../../hooks/useGenerateRecipe";

const CreateIngredient: React.FC = () => {
  const [createIngredient, { isLoading }] = useCreateIngredientsMutation();
  const { generateRecipes } = useGenerateRecipe();

  const submit = async (data: IngredientFormType) => {
    const {
      user: { id: userId },
      image,
      ...formData
    } = data;
    await createIngredient({ user: userId, image, ...formData }).unwrap();
    generateRecipes(userId);
  };

  return (
    <div>
      <div>
        <Typography
          sx={{
            margin: "10px",
            fontSize: 30,
          }}
        >
          Create Ingredients
        </Typography>
      </div>
      <Divider />
      <IngredientForm
        type="create"
        formLoading={isLoading}
        saveIngredient={submit}
        initialValues={{
          name: "",
          quantity: 0,
          expiry: new Date().toISOString().slice(0, 10),
          type: "KG",
          price: 0,
          image: "",
          user: { id: "", label: "" },
        }}
      />
    </div>
  );
};

export default CreateIngredient;
