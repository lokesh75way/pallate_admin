import { useGenerateRecipesMutation } from "../store/slices/recipeSlice";
import { toast } from "react-toastify";

const useGenerateRecipe = () => {
  const [createRecipes] = useGenerateRecipesMutation();

  const generateRecipes = (userId: string) => {
    toast.promise(createRecipes({ user: userId }).unwrap(), {
      pending: "Generating recipes...",
      success: {
        render({ data }) {
          return `${data} Recipes generated`;
        },
      },
      error: {
        render({ data }) {
          return (data as any)?.message ?? `Can't generate recipes`;
        },
      },
    });
  };

  return {
    generateRecipes,
  };
};

export default useGenerateRecipe;
