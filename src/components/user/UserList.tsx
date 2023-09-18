import React, { useState, useEffect, ChangeEvent } from "react";
import { DataGrid, GridColDef, useGridApiRef } from "@mui/x-data-grid";
import {
  Avatar,
  Box,
  Button,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  TextField,
  Typography,
  debounce,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Delete, RemoveRedEye } from "@mui/icons-material";
import {
  useDeleteUsersMutation,
  useGetUsersQuery,
} from "../../store/slices/userSlice";
import { useDispatch } from "react-redux";
import { openAlert } from "../../store/slices/alertSlice";
import LoadingComponent from "../Loading";
import { useNavigate } from "react-router";
import { createSearchParams } from "react-router-dom";
import EmptyTable from "../EmptyTable";

const useStyles = makeStyles((theme) => ({
  container: {
    borderRadius: "8px",
    minHeight: "80vh",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    marginTop: "30px",
  },

  actionContainer: {
    marginTop: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
}));

const UserList: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState({ id: "", name: "" });
  const dispatch = useDispatch();
  const classes = useStyles();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetUsersQuery();
  const [deletUser, { isLoading: loadingDelete }] = useDeleteUsersMutation();

  const handleDeleteOneClick = async () => {
    try {
      const response = await deletUser({
        id: deleteId.id,
      }).unwrap();
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

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      minWidth: 240,
      flex: 1,
      sortable: true,
      renderCell: (params) => (
        <CardHeader
          avatar={
            <Avatar
              alt={params.value.toUpperCase()}
              src="/static/images/avatar/1.jpg"
            />
          }
          title={params.value}
        />
      ),
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 250,
      flex: 0.8,
      sortable: true,
    },
    {
      field: "delete",
      headerName: "Actions",
      minWidth: 250,
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            gap: 3,
          }}
        >
          <Button
            size="small"
            variant="text"
            color="primary"
            startIcon={<RemoveRedEye />}
            onClick={(event) => {
              event.stopPropagation();
              navigate("/ingredients", {});
              navigate({
                pathname: "/ingredients",
                search: `?${createSearchParams({
                  user: params.id as string,
                })}`,
              });
            }}
          >
            Ingredients
          </Button>
          <Button
            size="small"
            variant="contained"
            color="error"
            startIcon={<Delete />}
            onClick={(event) => {
              event.stopPropagation();
              setDeleteId({ id: params.id as string, name: params.row.name });
              setOpenDialog(true);
            }}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

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

  const apiRef = useGridApiRef();
  const [searchValue, setSearchValue] = React.useState("");
  const updateSearchValue = React.useMemo(() => {
    return debounce((newValue) => {
      apiRef.current.setQuickFilterValues(
        newValue.split(" ").filter((word: string) => word !== "")
      );
    }, 500);
  }, [apiRef]);

  function handleSearchValueChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const newValue = event.target.value;
    setSearchValue(newValue);
    updateSearchValue(newValue);
  }

  return (
    <div>
      <Typography
        sx={{
          margin: "10px",
          fontSize: 30,
        }}
      >
        Users
      </Typography>
      <Divider />
      <div className={classes.actionContainer}>
        <TextField
          sx={{ maxWidth: "300px" }}
          value={searchValue}
          onChange={handleSearchValueChange}
          fullWidth
          size="medium"
          label="Search"
          type="search"
        />
      </div>
      <div className={classes.container}>
        {isLoading ? (
          <LoadingComponent />
        ) : isError ? (
          <Typography>Can't fetch users</Typography>
        ) : (
          <Box sx={{ maxWidth: "100vw", width: "100%", overflowX: "auto" }}>
            <DataGrid
              columns={columns}
              apiRef={apiRef}
              rows={data || []}
              pagination
              initialState={{
                pagination: { paginationModel: { pageSize: 25 } },
              }}
              getRowId={(row) => row._id}
              slots={{
                noRowsOverlay: EmptyTable,
              }}
              autoHeight
              sx={{ "--DataGrid-overlayHeight": "300px" }}
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
            Are you sure you want to delete <b>{deleteId.name}</b>
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
    </div>
  );
};

export default UserList;
