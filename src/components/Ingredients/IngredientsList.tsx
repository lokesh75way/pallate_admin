import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Delete, Edit } from "@mui/icons-material";
import { Button, Box, IconButton, CircularProgress } from "@mui/material";

import { usersApi } from "../../services/userApi";
import { useDeleteIngredientMutation } from "../../services/userApi";

const AddBox = styled(Box)({
  display: "flex",
  justifyContent: "flex-end",
  marginTop: "38px",
  marginRight: "50px",
});

const StyledButtonCreate = styled(Button)({
  marginTop: "5px",
  color: "black",
  "&:hover": {
    color: "black",
  },
});
interface Ingredient {
  _id: string;
  name: string;
  quantity: number;
  expiry: string;
  type: string;
  image: string;
}

interface ApiData {
  ingredients: Ingredient[];
}

const IngredientsList: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const navigate = useNavigate();
  const [isBulkDeleteVisible, setBulkDeleteVisible] = useState(false);

  const { data, error, isLoading, refetch } =
    usersApi.endpoints.getIngredients.useQuery();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await refetch();
        const responseData = data?.data?.ingredients;
        if (responseData) {
          setIngredients(responseData);
        }
      } catch (error) {
        console.error("Error while fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refetch]);
  console.log("data", data);

  const columns: GridColDef[] = [
    { field: "_id", headerName: "ID", width: 150 },
    {
      field: "name",
      headerName: "Name",
      width: 150,
      sortable: true,
      renderHeader: (params) => {
        return (
          <div style={{ cursor: "pointer" }}>{params.colDef.headerName}</div>
        );
      },
    },
    { field: "quantity", headerName: "Quantity", width: 100, sortable: true },
    {
      field: "expiry",
      headerName: "Date",
      width: 140,
      sortable: true,

      valueFormatter: (params) => {
        const originalDateStr = params.value as string;
        const formattedDate = originalDateStr.split("T")[0];
        return formattedDate;
      },
    },
    { field: "type", headerName: "Unit", width: 100, sortable: true },
    { field: "image", headerName: "Picture", width: 200 },
    {
      field: "delete",
      headerName: "Actions",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton
            onClick={(event) => handleEditClick(params.id as string, event)}
          >
            <Edit />
          </IconButton>
          <IconButton
            onClick={(event) =>
              handleDeleteOneClick([params.id as string], event)
            }
          >
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleDeleteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleDeleteOneClick(selectedRows, event);
    setSelectedRows([]);
    setBulkDeleteVisible(false);
  };

  const handleCreateClick = () => {
    navigate("/ingredients/create");
  };
  // const { mutateAsync } = usersApi.endpoints.deleteIngredient;
  const [deleteIngredientMutation] = useDeleteIngredientMutation();

  const handleDeleteOneClick = async (
    ingredientIds: string[],
    clickEvent: React.MouseEvent
  ) => {
    clickEvent.stopPropagation();

    try {
      await deleteIngredientMutation.mutateAsync(ingredientIds);

      setIngredients((prevIngredients) =>
        prevIngredients.filter(
          (ingredient) => !ingredientIds.includes(ingredient._id)
        )
      );
    } catch (error) {
      console.error("Error while deleting ingredients:", error);
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

  const handleRowClick = (params: any) => {
    const ingredientId = params.id;
    navigate(`/ingredients/${ingredientId}/show`);
  };

  return (
    <>
      <AddBox>
        {isBulkDeleteVisible && (
          <IconButton onClick={handleDeleteClick}>
            <Delete />
          </IconButton>
        )}
        <StyledButtonCreate startIcon={<AddIcon />} onClick={handleCreateClick}>
          Create
        </StyledButtonCreate>
      </AddBox>

      <div
        style={{
          marginLeft: "230px",
          marginTop: "0px",
          height: "470px",
          width: "82%",
          boxShadow: "0px 2px 4px rgba(4, 4, 1, 0.4)",
          borderRadius: "8px",
        }}
      >
        {loading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <DataGrid
            columns={columns}
            rows={ingredients}
            checkboxSelection
            pagination
            onRowClick={handleRowClick}
            onRowSelectionModelChange={handleRowSelectionModelChange}
            getRowId={(row) => row._id}
          />
        )}
      </div>
    </>
  );
};

export default IngredientsList;
