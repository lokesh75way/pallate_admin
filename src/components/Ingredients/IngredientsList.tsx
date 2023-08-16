import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { Delete, Edit } from "@mui/icons-material";
import { Button, Box, IconButton, CircularProgress } from "@mui/material";

import { usersApi } from "../../services/userApi";
import { useDeleteIngredientMutation } from "../../services/userApi";
import {IngredientData} from "../../models/IngredientModel";
import { makeStyles } from "@mui/styles";


const AddBox = styled(Box)({
  display: "flex",
  justifyContent: "flex-end",
  marginTop: "50px",
  marginRight: "50px",
});

const StyledButtonCreate = styled(Button)({
  marginTop: "5px",
  color: "black",
  "&:hover": {
    color: "black",
  },
});
const useStyles = makeStyles({
  checkboxFocus: {
    "& .MuiDataGrid-cell:focus-within ": {
      outline: "none",
    },
  },
});

export interface ApiResponse {
  data: {
    ingredients: IngredientData[];
  };
}

const IngredientsList: React.FC = () => {
  const [ingredients, setIngredients] = useState<IngredientData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const navigate = useNavigate();
  const classes = useStyles();

  const [isBulkDeleteVisible, setBulkDeleteVisible] = useState(false);
  const [deleteActionCompleted, setDeleteActionCompleted] = useState(false);

  const { data, error, isLoading, refetch } =
    usersApi.endpoints.getIngredients.useQuery();
  useEffect(() => {
    const fetchData = async () => {
      try {
        await refetch();
        const responseData: ApiResponse = data as ApiResponse;

        if (responseData) {
          setIngredients(responseData.data.ingredients);
          setDeleteActionCompleted(false);
        }
      } catch (error) {
        console.error("Error while fetching ingredient data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (error) {
      console.error("Error while fetching ingredient data:", error);
      setLoading(false);
    } else {
      fetchData();
    }
  }, [refetch, error, deleteActionCompleted, loading]);


  
  const columns: GridColDef[] = [
    { field: "_id", headerName: "ID", width: 120 },
    {
      field: "name",
      headerName: "Name",
      width: 120,
      sortable: true,
      renderHeader: (params) => {
        return (
          <div style={{ cursor: "pointer" }}>{params.colDef.headerName}</div>
        );
      },
    },
    { field: "quantity", headerName: "Quantity", width: 100, sortable: true },
    { field: "type", headerName: "Unit", width: 100, sortable: true },
    { field: "price", headerName: "Price", width: 100, sortable: true },
    {
      field: "expiry",
      headerName: "Expiry",
      width: 100,
      sortable: true,

      valueFormatter: (params) => {
        const originalDateStr = params.value as string;
        const formattedDate = originalDateStr.split("T")[0];
        return formattedDate;
      },
    },

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
  const [deleteIngredientMutation] = useDeleteIngredientMutation();
  

  const handleDeleteOneClick = async (
    ingredientIds: string[],
    clickEvent: React.MouseEvent
  ) => {
    clickEvent.stopPropagation();


    try {
      await deleteIngredientMutation(ingredientIds);

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
    setLoading(true);
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
    <div  >
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
      className={classes.checkboxFocus}
        style={{
          marginLeft: "230px",
          marginTop: "0px",
          height: "70%",
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
              height: "100px",
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
    </div>
  );
};

export default IngredientsList;