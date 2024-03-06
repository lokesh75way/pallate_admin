import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Divider, Typography } from "@mui/material";
import {
  useGetIngredientQuery,
  useUpdateIngredientsMutation,
} from "../../store/slices/ingredientSlice";
import IngredientForm, { IngredientFormType } from "./IngredientForm";
import { useDispatch } from "react-redux";
import { openAlert } from "../../store/slices/alertSlice";
import LoadingComponent from "../Loading";
import dayjs from "dayjs";
import useGenerateRecipe from "../../hooks/useGenerateRecipe";

const EditIngredient: React.FC = () => {
  const { ingredientId } = useParams<{ ingredientId: string }>();
  const dispatch = useDispatch();
  const {
    data: ingredientData,
    isLoading: loadingIngredient,
    isError,
    error,
  } = useGetIngredientQuery(ingredientId ?? "");
  const [updateIngredient, { isLoading }] = useUpdateIngredientsMutation();
  const navigate = useNavigate();
  const { generateRecipes } = useGenerateRecipe();

  const submit = async (data: IngredientFormType) => {
    const updatedIngredient = {
      id: ingredientId,
      name: data.name,
      // quantity: data.quantity,
      expiry: data.expiry,
      // type: data.type,
      price: data.price,
      image: data.image,
      user: data.user.id,
    };
    await updateIngredient(updatedIngredient).unwrap();
    generateRecipes(data.user.id);
  };

  useEffect(() => {
    if (isError) {
      const err = error as ErrorResponse;
      dispatch(
        openAlert({
          message: err?.message ?? "Something went wrong",
          varient: "error",
        })
      );
      navigate("/ingredients");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError]);

  return (
    <div>
      <div>
        <Typography
          sx={{
            margin: "10px",
            fontSize: 30,
          }}
        >
          Edit Ingredients
        </Typography>
      </div>
      <Divider />

      {loadingIngredient ? (
        <div style={{ minHeight: "80vh", marginTop: "30px" }}>
          <LoadingComponent />
        </div>
      ) : (
        <IngredientForm
          type="edit"
          formLoading={isLoading}
          saveIngredient={submit}
          initialValues={
            {
              ...ingredientData,
              expiry: dayjs(ingredientData?.expiry).utc().format("YYYY-MM-DD"),
              user: {
                id: ingredientData?.user._id,
                label: ingredientData?.user.name,
              },
            } as unknown as IngredientFormType
          }
        />
      )}
    </div>
  );
};

export default EditIngredient;
