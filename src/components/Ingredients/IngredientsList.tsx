import React, { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import {
  Button,
  Box,
  IconButton,
  CardHeader,
  Avatar,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
} from "@mui/material";
import { IngredientData } from "../../models/IngredientModel";
import {
  useGetIngredientsQuery,
  useDeleteIngredientsMutation,
} from "../../store/slices/ingredientSlice";
import { useDispatch } from "react-redux";
import { openAlert } from "../../store/slices/alertSlice";
import LoadingComponent from "../Loading";
import dayjs from "dayjs";

const AddBox = styled(Box)({
  display: "flex",
  justifyContent: "flex-end",
  padding: "3px",
});

export interface ApiResponse {
  data: {
    ingredients: IngredientData[];
  };
}

const IngredientsList = () => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [deleteData, setDeleteData] = useState<string[]>();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [isBulkDeleteVisible, setBulkDeleteVisible] = useState(false);
  const dispatch = useDispatch();
  const {
    data: ingredients,
    isLoading,
    isError,
    error,
  } = useGetIngredientsQuery();
  const [deleteIngredients, { isLoading: loadingDelete }] =
    useDeleteIngredientsMutation();

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      sortable: true,
      renderHeader: (params) => (
        <div style={{ cursor: "pointer" }}>{params.colDef.headerName}</div>
      ),
      renderCell: (params) => (
        <CardHeader
          avatar={
            <Avatar alt={params.value.toUpperCase()} src={params.row.image} />
          }
          title={params.value}
        />
      ),
    },
    {
      field: "user",
      headerName: "User Assigned",
      flex: 0.6,
      sortable: true,
      renderCell: (params) => params.value.name,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      flex: 0.3,
      sortable: true,
    },
    {
      field: "type",
      headerName: "Unit",
      flex: 0.2,
      sortable: true,
    },
    {
      field: "price",
      headerName: "Price",
      flex: 0.3,
      sortable: true,
      renderCell: (params) => `$${params.value}`,
    },
    {
      field: "expiry",
      headerName: "Expiry",
      flex: 0.5,
      sortable: true,
      valueFormatter: (params) =>
        dayjs(params.value).utc().format("MM-DD-YYYY"),
    },
    {
      field: "delete",
      headerName: "Actions",
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton
            onClick={(event) => handleEditClick(params.id as string, event)}
          >
            <Edit />
          </IconButton>
          <IconButton
            onClick={(event) => {
              event.stopPropagation();
              setDeleteData([params.id as string]);
              setOpenDialog(true);
            }}
          >
            <Delete />
          </IconButton>
          <IconButton onClick={(event) => handleOpenIngredient(params)}>
            <Visibility />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleCreateClick = () => {
    navigate("/ingredients/create");
  };

  const handleDeleteOneClick = async () => {
    try {
      const ingredientIds = deleteData;
      const response = await deleteIngredients(ingredientIds).unwrap();
      dispatch(openAlert({ message: response, varient: "success" }));
    } catch (err) {
      const error = err as ErrorResponse;
      const message =
        error?.message === "Validation error!"
          ? error.data?.errors[0].msg ?? "Something went wrong"
          : error?.message ?? "Something went wrong";

      dispatch(openAlert({ message, varient: "error" }));
    }
  };

  const handleEditClick = (
    ingredientId: string,
    clickEvent: React.MouseEvent
  ) => {
    clickEvent.stopPropagation();
    navigate(`/ingredients/${ingredientId}/editForm`);
  };

  const handleRowSelectionModelChange = (selectionModel: any) => {
    setSelectedRows(selectionModel);
    setBulkDeleteVisible(selectionModel.length > 0);
  };

  const handleOpenIngredient = (params: any) => {
    const ingredientId = params.id;
    navigate(`/ingredients/${ingredientId}`);
  };

  if (isError) {
    const err = error as ErrorResponse;
    dispatch(
      openAlert({
        message: err?.message ?? "Something went wrong",
        varient: "error",
      })
    );
  }

  return (
    <div style={{ marginLeft: "250px", marginTop: "70px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            margin: "10px",
            fontSize: 30,
          }}
        >
          Ingredients
        </Typography>

        <AddBox>
          {isBulkDeleteVisible && (
            <Button
              size="medium"
              variant="contained"
              sx={{ marginRight: "5px", height: "40px" }}
              color="error"
              startIcon={<Delete />}
              onClick={(event) => {
                event.stopPropagation();
                setDeleteData(selectedRows);
                setOpenDialog(true);
              }}
            >
              Delete
            </Button>
          )}
          <Button
            size="medium"
            variant="contained"
            sx={{ bgcolor: "#002D62", height: "40px" }}
            startIcon={<AddIcon />}
            onClick={handleCreateClick}
          >
            Create
          </Button>
        </AddBox>
      </div>
      <Divider />
      <div
        style={{
          borderRadius: "8px",
          minHeight: "80vh",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          marginTop: "30px",
        }}
      >
        {isLoading ? (
          <LoadingComponent />
        ) : isError ? (
          <Typography>Can't fetch users</Typography>
        ) : (
          <DataGrid
            columns={columns}
            rows={ingredients || []}
            pagination
            initialState={{
              pagination: { paginationModel: { pageSize: 25 } },
            }}
            getRowId={(row) => row._id}
            disableRowSelectionOnClick={true}
            onRowSelectionModelChange={handleRowSelectionModelChange}
            checkboxSelection
          />
        )}
      </div>

      {/* Delete dialoge box */}
      <Dialog
        open={openDialog}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to delete ingredients
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDialog(false);
            }}
            disabled={loadingDelete}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={loadingDelete}
            color="error"
            onClick={handleDeleteOneClick}
          >
            {loadingDelete ? <LoadingComponent size={20} /> : "Yes!"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default IngredientsList;
