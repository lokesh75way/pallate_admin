import React, { useState, useEffect, ChangeEvent, useMemo } from "react";
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
import { makeStyles, styled } from "@mui/styles";
import { Delete, Edit } from "@mui/icons-material";
import { useDeleteUsersMutation } from "../../store/slices/userSlice";
import { useDispatch } from "react-redux";
import { openAlert } from "../../store/slices/alertSlice";
import LoadingComponent from "../Loading";
import EmptyTable from "../EmptyTable";
import AddIcon from "@mui/icons-material/Add";
import "../style.css";
import AnnotatorForm from "./AnnotatorForm";
import { useGetAnnotatorsQuery } from "../../store/slices/annotatorSlice";

const AddBox = styled(Box)({
  display: "flex",
  justifyContent: "flex-end",
  padding: "3px",
});

const useStyles = makeStyles((theme) => ({
  tableWrapper: {
    borderRadius: "8px",
    minHeight: "80vh",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    marginTop: "10px",
  },

  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  actionContainer: {
    marginTop: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
}));

const initialDataDialog = {
  open: false,
  type: "create",
  name: "",
  email: "",
  id: "",
};

const AnnotatorsList: React.FC = () => {
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState({ id: "", name: "" });
  const dispatch = useDispatch();
  const classes = useStyles();
  const { data, isLoading, isError, error } = useGetAnnotatorsQuery();
  const [deletUser, { isLoading: loadingDelete }] = useDeleteUsersMutation();
  const [updateDataDialog, setUpdateDataDialog] = useState(initialDataDialog);

  const handleCreateClick = () => {
    setUpdateDataDialog({ ...initialDataDialog, open: true });
  };

  const handleDeleteOneClick = async () => {
    try {
      await deletUser({
        id: deleteId.id,
      }).unwrap();
      setDeleteDialog(false);
      dispatch(
        openAlert({
          message: "Annotator deleted successfully!",
          varient: "success",
        })
      );
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
      field: "actions",
      headerName: "Actions",
      minWidth: 150,
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton
            onClick={(event) => {
              setUpdateDataDialog({
                open: true,
                type: "edit",
                id: params.id as string,
                name: params.row.name,
                email: params.row.email,
              });
            }}
          >
            <Edit />
          </IconButton>
          <IconButton
            onClick={(event) => {
              event.stopPropagation();
              setDeleteId({ id: params.id as string, name: params.row.name });
              setDeleteDialog(true);
            }}
          >
            <Delete />
          </IconButton>
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
  const [searchValue, setSearchValue] = useState("");
  const updateSearchValue = useMemo(() => {
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
      <div className={classes.container}>
        <Typography
          sx={{
            margin: "10px",
            fontSize: 30,
          }}
        >
          Annotators
        </Typography>

        <AddBox>
          <Button
            size="medium"
            variant="contained"
            sx={{ bgcolor: "#002D62", height: "40px" }}
            startIcon={<AddIcon />}
            onClick={handleCreateClick}
          >
            Add new
          </Button>
        </AddBox>
      </div>
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
      <div className={classes.tableWrapper}>
        {isLoading ? (
          <LoadingComponent />
        ) : isError ? (
          <Typography>Can't fetch annotators</Typography>
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
        open={deleteDialog}
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
              setDeleteDialog(false);
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

      {/* create form  */}
      {updateDataDialog.open && (
        <AnnotatorForm
          type={updateDataDialog.type as "create" | "edit"}
          open={updateDataDialog.open}
          initialValues={{
            name: updateDataDialog.name,
            email: updateDataDialog.email,
            password: "",
            confirm_password: "",
          }}
          annotatorId={updateDataDialog.id}
          cancel={() => setUpdateDataDialog(initialDataDialog)}
        />
      )}
    </div>
  );
};

export default AnnotatorsList;
