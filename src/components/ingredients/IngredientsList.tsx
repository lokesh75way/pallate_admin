import React, { useState, useEffect, useMemo } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Delete, Edit } from "@mui/icons-material";
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
  Chip,
  Autocomplete,
  TextField,
} from "@mui/material";
import {
  useGetIngredientsQuery,
  useDeleteIngredientsMutation,
  useUpdateCustomLabelMutation,
} from "../../store/slices/ingredientSlice";
import { useDispatch } from "react-redux";
import { openAlert } from "../../store/slices/alertSlice";
import LoadingComponent from "../Loading";
import dayjs from "dayjs";
import { makeStyles } from "@mui/styles";
import ViewIngredient from "./ViewIngredient";
import { useGetUsersQuery } from "../../store/slices/userSlice";
import EmptyTable from "../EmptyTable";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";

const AddBox = styled(Box)({
  display: "flex",
  justifyContent: "flex-end",
  padding: "3px",
});

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  tableWrapper: {
    borderRadius: "8px",
    minHeight: "80vh",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    marginTop: "10px",
  },

  actionContainer: {
    marginTop: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  userSuggestion: {
    display: "flex",
    alignItems: "center",

    "&:hover": {
      "& $userSuggContainer": {
        width: "50%",
      },
      "& $userSuggAction": {
        display: "flex",
        gap: 2,
      },
    },
  },

  userSuggContainer: {
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },

  userSuggAction: {
    display: "none",
  },
  userSuggTyp: {
    fontSize: 13,
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
}));

const IngredientsList = () => {
  const [selectedRows, setSelectedRows] = useState<string[]>();
  const [deleteData, setDeleteData] = useState<string[]>();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [isBulkDeleteVisible, setBulkDeleteVisible] = useState(false);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewIngredient, setViewIngredient] = useState({ id: "", open: false });
  const {
    data: ingredients,
    isLoading,
    isError,
    error,
  } = useGetIngredientsQuery();
  const [deleteIngredients, { isLoading: loadingDelete }] =
    useDeleteIngredientsMutation();
  const { data: users } = useGetUsersQuery();
  const [filteredIngredients, setFilteredIngredients] = useState(ingredients);
  const [approveLabel, { isLoading: isLoadingLabel }] =
    useUpdateCustomLabelMutation();

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      minWidth: 240,
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
          title={
            params.row.customLabels?.["approval_status"] === "APPROVED"
              ? params.row.customLabels?.["name_by_user"]
              : params.value
          }
        />
      ),
    },
    {
      field: "user",
      headerName: "User Assigned",
      minWidth: 170,
      flex: 0.6,
      sortable: true,
      renderCell: (params) => (
        <>
          {params.value.name}
          {!params.value.active && (
            <Chip
              size="small"
              sx={{ marginLeft: "5px" }}
              label="Deleted"
              color="error"
            />
          )}
        </>
      ),
    },
    {
      field: "quantity",
      headerName: "Quantity",
      minWidth: 130,
      flex: 0.3,
      sortable: true,
    },
    {
      field: "type",
      headerName: "Unit",
      minWidth: 110,
      flex: 0.2,
      sortable: true,
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 120,
      flex: 0.3,
      sortable: true,
      renderCell: (params) => `$${params.value}`,
    },
    {
      field: "expiry",
      headerName: "Expiry",
      minWidth: 150,
      flex: 0.5,
      sortable: true,
      valueFormatter: (params) =>
        dayjs(params.value).utc().format("MM-DD-YYYY"),
    },
    {
      field: "customLabels",
      headerName: "User suggestion",
      minWidth: 170,
      flex: 0.7,
      renderCell: (params) =>
        params.value?.["approval_status"] === "PENDING" ? (
          <Box className={classes.userSuggestion}>
            <Box className={classes.userSuggContainer}>
              <Typography className={classes.userSuggTyp}>
                Name: {params.value?.["name_by_user"]}
              </Typography>
              {params.value?.["expiry_by_user"] && (
                <Typography className={classes.userSuggTyp}>
                  Expiry:{" "}
                  {dayjs(params.value?.["expiry_by_user"])
                    .utc()
                    .format("MM-DD-YYYY")}
                </Typography>
              )}
            </Box>{" "}
            {!isLoadingLabel ? (
              <Box className={classes.userSuggAction}>
                <IconButton
                  size="small"
                  onClick={() =>
                    approveLabel({
                      id: params.id as string,
                      status: "approve",
                    }).unwrap()
                  }
                >
                  <DoneIcon color="success" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() =>
                    approveLabel({
                      id: params.id as string,
                      status: "reject",
                    }).unwrap()
                  }
                >
                  <CloseIcon color="error" />
                </IconButton>
              </Box>
            ) : (
              <LoadingComponent size={15} />
            )}
          </Box>
        ) : null,
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 150,
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
        </Box>
      ),
    },
  ];

  // const approveLabel = (status) => {};

  const handleCreateClick = () => {
    navigate("/ingredients/create");
  };

  const handleDeleteOneClick = async () => {
    try {
      const ingredientId = deleteData;
      const response = await deleteIngredients({ ingredientId }).unwrap();
      setOpenDialog(false);
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
    navigate(`/ingredients/edit/${ingredientId}`);
  };

  const handleRowSelectionModelChange = (selectionModel: any) => {
    setSelectedRows(selectionModel);
    setBulkDeleteVisible(selectionModel.length > 0);
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError]);

  const [userFilter, setUserFilter] = useState({ id: "", label: "" });

  const loadOptions = useMemo(() => {
    return (users || []).map((user) => ({
      id: user?._id,
      label: user?.name,
    }));
  }, [users]);

  const filterUser = (value?: string) => {
    setSearchParams((params) => {
      if (value) params.set("user", value);
      else params.delete("user");
      return params;
    });
  };

  useEffect(() => {
    const filterId = searchParams.get("user");
    if (filterId) {
      setUserFilter(() => {
        const item = loadOptions.find((opt) => opt.id === filterId);
        return item || { id: "", label: "" };
      });
      setFilteredIngredients(() =>
        ingredients?.filter((ingredient) => filterId === ingredient.user._id)
      );
    } else {
      setUserFilter({ id: "", label: "" });
      setFilteredIngredients(ingredients);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, ingredients]);

  return (
    <div>
      <div className={classes.container}>
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
      <div className={classes.actionContainer}>
        <Autocomplete
          onChange={(e, value) => {
            filterUser(value?.id);
          }}
          value={userFilter}
          sx={{ maxWidth: "300px" }}
          fullWidth
          options={loadOptions}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField {...params} label="Filter by user" />
          )}
          isOptionEqualToValue={(option, test) => option.id === test.id}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              {option.label}
            </li>
          )}
        />
      </div>
      <div className={classes.tableWrapper}>
        {isLoading ? (
          <LoadingComponent />
        ) : isError ? (
          <Typography>Can't fetch Ingredients</Typography>
        ) : (
          <Box sx={{ maxWidth: "100vw", width: "100%", overflowX: "auto" }}>
            <DataGrid
              columns={columns}
              rows={filteredIngredients || []}
              pagination
              initialState={{
                pagination: { paginationModel: { pageSize: 25 } },
              }}
              slots={{
                noRowsOverlay: EmptyTable,
              }}
              autoHeight
              sx={{ "--DataGrid-overlayHeight": 400 }}
              getRowId={(row) => row._id}
              disableRowSelectionOnClick={true}
              onRowSelectionModelChange={handleRowSelectionModelChange}
              checkboxSelection
            />
          </Box>
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
            {loadingDelete ? <LoadingComponent size={20} /> : "Yes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* view ingredient */}
      <ViewIngredient
        closeModal={() => setViewIngredient({ id: "", open: false })}
        open={viewIngredient.open}
        ingredientId={viewIngredient.id}
      />
    </div>
  );
};

export default IngredientsList;
