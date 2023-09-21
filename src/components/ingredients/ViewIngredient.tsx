import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@mui/material/styles/styled";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import { useGetIngredientQuery } from "../../store/slices/ingredientSlice";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { openAlert } from "../../store/slices/alertSlice";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
} from "@mui/material";
import LoadingComponent from "../Loading";

const Container = styled(Box)({
  minHeight: "400px",
  minWidth: "300px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
});

const Quantity = styled(Typography)({
  color: "#555",
});

const Image = styled("img")({
  maxWidth: "100%",
  height: "200px",
  marginTop: "10px",
});

interface ViewIngredientProps {
  ingredientId: string;
  open: boolean;
  closeModal: () => void;
}

const ViewIngredient = ({
  ingredientId,
  open,
  closeModal,
}: ViewIngredientProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    data: ingredient,
    isLoading,
    isError,
    error,
  } = useGetIngredientQuery(ingredientId);

  const handleEditButton = () => {
    navigate(`/ingredients/edit/${ingredientId}`);
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
      closeModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError]);

  return (
    <>
      <Dialog open={open} onClose={closeModal}>
        <Container>
          {isLoading ? (
            <LoadingComponent />
          ) : (
            <>
              <DialogTitle
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <span>{ingredient?.name}</span>
                <DialogContentText>
                  User: {ingredient?.user.name}
                </DialogContentText>
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={2} style={{ alignItems: "center" }}>
                  <Grid item xs={12} sm={6}>
                    <Image src={ingredient?.image} alt={ingredient?.name} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DialogContentText id="alert-dialog-slide-description">
                      Quantity: {ingredient?.quantity} {ingredient?.type}
                    </DialogContentText>
                    <DialogContentText id="alert-dialog-slide-description">
                      Expiry:{" "}
                      {dayjs(ingredient?.expiry).utc().format("MM-DD-YYYY")}
                    </DialogContentText>
                    <Quantity>Price: ${ingredient?.price}</Quantity>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleEditButton}
                  color="info"
                  startIcon={<EditIcon />}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={closeModal}
                >
                  Close
                </Button>
              </DialogActions>
            </>
          )}
        </Container>
      </Dialog>
    </>
  );
};

export default ViewIngredient;
