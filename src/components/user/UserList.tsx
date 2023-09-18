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
  IconButton,
  TextField,
  Typography,
  debounce,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Delete, DeviceUnknown, Edit, RemoveRedEye } from "@mui/icons-material";
import {
  useDeleteUsersMutation,
  useGetUsersQuery,
  useUpdateUsersMutation,
} from "../../store/slices/userSlice";
import { useDispatch } from "react-redux";
import { openAlert } from "../../store/slices/alertSlice";
import LoadingComponent from "../Loading";
import { useNavigate } from "react-router";
import { createSearchParams } from "react-router-dom";
import EmptyTable from "../EmptyTable";
import "./style.css";

const useStyles = makeStyles((theme) => ({
  container: {
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
}));

const initialMacDialog = {
  open: false,
  address: "",
  user: "",
  isEdit: false,
  userId: "",
};

const UserList: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState({ id: "", name: "" });
  const dispatch = useDispatch();
  const classes = useStyles();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetUsersQuery();
  const [deletUser, { isLoading: loadingDelete }] = useDeleteUsersMutation();
  const [macDialog, setMacDialog] = useState(initialMacDialog);
  const [updateUser, { isLoading: loadingUserEdit }] = useUpdateUsersMutation();

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

  const handleUpdateMac = async () => {
    try {
      await updateUser({
        id: macDialog.userId,
        mac_address: macDialog.address,
      }).unwrap();

      dispatch(
        openAlert({
          message: "Device updated successfully",
          varient: "success",
        })
      );
      setMacDialog(initialMacDialog);
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
      flex: 1,
      sortable: true,
    },
    {
      field: "mac_address",
      headerName: "MAC address",
      minWidth: 200,
      flex: 0.7,
      sortable: false,
      renderCell(params) {
        if (params.row.mac_address) return params.row.mac_address;
        return (
          <Button
            size="small"
            variant="text"
            color="primary"
            startIcon={<DeviceUnknown />}
            onClick={(event) => {
              event.stopPropagation();
              setMacDialog({
                open: true,
                address: "",
                isEdit: false,
                user: params.row.name,
                userId: params.id as string,
              });
            }}
          >
            Assign Device
          </Button>
        );
      },
    },
    {
      field: "editMac",
      type: "actions",
      width: 70,
      cellClassName: "editMac",
      getActions: (params) => {
        if (!params.row.mac_address) return [<></>];
        return [
          <IconButton
            onClick={(event) => {
              setMacDialog({
                open: true,
                address: params.row.mac_address,
                user: params.row.name,
                isEdit: true,
                userId: params.id as string,
              });
            }}
          >
            <Edit />
          </IconButton>,
        ];
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 240,
      flex: 0.9,
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

      {/* Add or edit mac address */}
      <Dialog
        open={macDialog.open}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{macDialog.isEdit ? "Edit" : "Add"} Device</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To {macDialog.isEdit ? "Edit" : "Add"} device of the user{" "}
            {macDialog.user} enter the MAC address
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="mac_address"
            label="MAC Address"
            value={macDialog.address}
            onChange={(e) => {
              setMacDialog((prvs) => ({ ...prvs, address: e.target.value }));
            }}
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setMacDialog(initialMacDialog);
            }}
            disabled={loadingUserEdit}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={loadingUserEdit}
            color="primary"
            onClick={handleUpdateMac}
          >
            {loadingUserEdit ? (
              <LoadingComponent size={20} />
            ) : macDialog.isEdit ? (
              "Edit"
            ) : (
              "Add"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserList;
