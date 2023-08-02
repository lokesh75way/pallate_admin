import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Delete, Edit } from "@mui/icons-material";
import {
  Button,
  Box,
  IconButton,
  CircularProgress, 
} from "@mui/material";


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

const IngredientsList: React.FC = () => {
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true); 
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const navigate = useNavigate();
  const [isBulkDeleteVisible, setBulkDeleteVisible] = useState(false);
  
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/ingredients",
          {
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY0YmZkZDg0Y2E0YzM1NTFjOTU2ZTEzZSIsIm5hbWUiOiJzaGEiLCJlbWFpbCI6InNoYW1pbGtvdHRhOTlAZ21haWwuY29tIiwiYWN0aXZlIjp0cnVlLCJwYXNzd29yZCI6IiQyYiQxMiRXTmtLdll3eGxKdkNHRC5lSi5WNFBlY0FqeWR4SVphZmV1VWtNLjlURmNud3RCcXZrckRSNiIsInJvbGUiOiJVU0VSIiwiY3JlYXRlZEF0IjoiMjAyMy0wNy0yNVQxNDozNDo0NC4yMjFaIiwidXBkYXRlZEF0IjoiMjAyMy0wNy0yNVQxNDozNDo0NC4yMjFaIiwiX192IjowfSwiaWF0IjoxNjkwMjk2MzU3fQ.xZn1KSQ6prK6v39xs5iVFgDUAKC1ipHmCmZ6b7K-b6o`,
              "ngrok-skip-browser-warning": true,
            },
          }
        );

        const data = response.data.data.ingredients;
        setIngredients(data);
        setLoading(false);
  
      } catch (error) {
        console.error("Error fetching ingredients:", error);
        setLoading(false); 
      }
    };
    fetchIngredients();
  }, []);

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
          <IconButton onClick={(event) => handleEditClick(params.id as string, event)}>
            <Edit />
          </IconButton>
          <IconButton onClick={(event) => handleDeleteOneClick([params.id as string], event)}>
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

  const handleDeleteOneClick = (ingredientIds: string[], clickEvent: React.MouseEvent) => {
    clickEvent.stopPropagation();
    axios
      .delete(`https://38ef-150-129-102-218.ngrok-free.app/api/ingredients`, {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY0YzFlYjMyNTg0Mjk4YjUxNjI1YWNkZiIsIm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AcGFsbGF0ZS5jb20iLCJhY3RpdmUiOnRydWUsInBhc3N3b3JkIjoiJDJiJDEyJE9sbHBmSmR3akNHV2F3cnNJeHgwSnVqVUxOZ2NsTXpSejUwVjZwN2V3elFJMERiRTR2LjdtIiwicm9sZSI6IkFETUlOIiwiY3JlYXRlZEF0IjoiMjAyMy0wNy0yMFQxMjoyMjozOC42NThaIiwidXBkYXRlZEF0IjoiMjAyMy0wNy0yMVQwOToyNToyNS4yOTdaIiwiX192IjowfSwiaWF0IjoxNjkwODA2OTk0fQ.7vspbw1A1N019ewYYojPHS8AyMlHzlxk134f_c5GlUI`,
          "ngrok-skip-browser-warning": true,
        },
        data:{
          ingredientId: ingredientIds,
        }
      })
      .then((response) => {
        setIngredients((prevIngredients) =>
          prevIngredients.filter(
            (ingredient) => !ingredientIds.includes(ingredient._id)
          )
        );
      })
      .catch((error) => {
        console.error("Error while deleting ingredients:", error);
      });
  };

  const handleEditClick = (ingredientId:string,clickEvent: React.MouseEvent) => {
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