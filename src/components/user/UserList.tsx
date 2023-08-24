import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Avatar,
  Button,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Delete } from "@mui/icons-material";
import {
  useDeleteUsersMutation,
  useGetUsersQuery,
} from "../../store/slices/userSlice";
import { useDispatch } from "react-redux";
import { openAlert } from "../../store/slices/alertSlice";
import LoadingComponent from "../Loading";

const useStyles = makeStyles((theme) => ({
  container: {
    borderRadius: "8px",
    minHeight: "80vh",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    marginTop: "30px",
  },
}));

const UserList: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState({ id: "", name: "" });
  const dispatch = useDispatch();
  const classes = useStyles();
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
    { field: "email", headerName: "Email", flex: 1, sortable: true },
    {
      field: "delete",
      headerName: "Actions",
      flex: 0.3,
      sortable: false,
      renderCell: (params) => (
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
      <div className={classes.container}>
        {isLoading ? (
          <LoadingComponent />
        ) : isError ? (
          <Typography>Can't fetch users</Typography>
        ) : (
          <DataGrid
            columns={columns}
            rows={data || []}
            pagination
            initialState={{
              pagination: { paginationModel: { pageSize: 25 } },
            }}
            getRowId={(row) => row._id}
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
