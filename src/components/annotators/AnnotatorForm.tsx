import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Grid,
  Dialog,
  Button,
  CircularProgress,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { openAlert } from "../../store/slices/alertSlice";
import { useNavigate } from "react-router";
import SaveIcon from "@mui/icons-material/Save";
import { makeStyles } from "@mui/styles";
import {
  useCreateAnnotatorsMutation,
  useUpdateAnnotatorsMutation,
} from "../../store/slices/annotatorSlice";

export interface AnnotatorFormType {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
}

interface AnnotatorFormProps {
  type: "edit" | "create";
  initialValues?: AnnotatorFormType;
  open: boolean;
  annotatorId?: string;
  cancel: () => void;
}

const useStyles = makeStyles((theme) => ({
  button: {
    backgroundColor: "#002D62 !important",
    color: "white !important",
    "&:hover": {
      backgroundColor: "#002D62 !important",
      color: "white !important",
    },
  },
}));

const AnnotatorForm = ({
  type,
  initialValues,
  open,
  annotatorId,
  cancel,
}: AnnotatorFormProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const classes = useStyles();
  const [createAnnotator, { isLoading: creationLoading }] =
    useCreateAnnotatorsMutation();
  const [updateAnnotator, { isLoading: updationLoading }] =
    useUpdateAnnotatorsMutation();

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<AnnotatorFormType>({ defaultValues: initialValues });

  const saveAnnotator = type === "edit" ? updateAnnotator : createAnnotator;
  const formLoading = type === "edit" ? updationLoading : creationLoading;

  const onSubmit = async (data: AnnotatorFormType) => {
    try {
      let credentials: any = { ...data };
      if (type === "edit") credentials = { id: annotatorId, ...data };
      await saveAnnotator(credentials).unwrap();
      dispatch(
        openAlert({
          message: "Annotator saved successfully",
          varient: "success",
        })
      );
      cancel();
      navigate("/annotators");
    } catch (err) {
      const error = err as ErrorResponse;
      const message =
        error?.message === "Validation error!"
          ? error.data?.errors[0].msg ?? "Something went wrong"
          : error?.message ?? "Something went wrong";
      dispatch(openAlert({ message, varient: "error" }));
    }
  };

  return (
    <Dialog maxWidth="md" fullWidth keepMounted={false} open={open}>
      <DialogTitle>
        {type === "edit" ? "Edit" : "Create"} Annotators
      </DialogTitle>
      <DialogContent>
        <Grid
          container
          spacing={2}
          sx={{ marginBottom: "10px", marginTop: "10px" }}
        >
          <Grid item xs={12} sm={6}>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  size="medium"
                  label="Name"
                  {...field}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="email"
              control={control}
              rules={{ required: "Email is required" }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  size="medium"
                  label="Email"
                  type="email"
                  disabled={type === "edit"}
                  {...field}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ marginBottom: "10px" }}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="password"
              control={control}
              rules={{
                required: type === "edit" ? false : "Password is required",
              }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  size="medium"
                  label="Password"
                  type="password"
                  {...field}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="confirm_password"
              control={control}
              rules={{
                required: type === "edit" ? false : "Retype your password",
                validate: (value) =>
                  value === watch("password")
                    ? true
                    : "Passwords must be matching",
              }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  size="medium"
                  label="Confirm Password"
                  type="password"
                  {...field}
                  error={!!errors.confirm_password}
                  helperText={errors.confirm_password?.message}
                />
              )}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          size="large"
          style={{ paddingLeft: "20px", paddingRight: "20px" }}
          onClick={cancel}
          disabled={formLoading}
          variant="text"
        >
          Cancel
        </Button>
        <Button
          size="large"
          style={{ paddingLeft: "20px", paddingRight: "20px" }}
          className={classes.button}
          onClick={handleSubmit(onSubmit)}
          startIcon={<SaveIcon />}
          disabled={formLoading}
        >
          {formLoading ? (
            <CircularProgress sx={{ color: "white" }} size={24} />
          ) : (
            "Save Annotator"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AnnotatorForm;
