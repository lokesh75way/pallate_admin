import React, { useState, useRef, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import SaveIcon from "@mui/icons-material/Save";
import { makeStyles } from "@mui/styles";
import {
  Button,
  TextField,
  MenuItem,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import { useGetUsersQuery } from "../../store/slices/userSlice";
import { useDispatch } from "react-redux";
import { openAlert } from "../../store/slices/alertSlice";
import cameraIcon from "../../assets/camera.svg";
import { useUploadImageMutation } from "../../store/slices/imageSlice";
import LoadingComponent from "../Loading";
import { useNavigate } from "react-router";

const useStyles = makeStyles((theme) => ({
  imageInput: {
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "contain",
    position: "relative",
    width: "100%",
    height: "100%",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    "&::after": {
      content: "",
      backgroundColor: "black",
      position: "absolute",
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
    },
  },

  formControl: {
    width: "50%",
  },

  button: {
    backgroundColor: "#002D62 !important",
    color: "white !important",
    "&:hover": {
      backgroundColor: "#002D62 !important",
      color: "white !important",
    },
  },

  uploadButton: {
    position: "relative",
    width: "200px",
    height: "180px",
    borderRadius: "8px",
    border: "2px",
    cursor: "pointer",
  },

  users: {
    zIndex: 100,
  },

  placeHolder: {
    position: "absolute",
    top: 0,
    bottom: 0,
    margin: "auto",
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
}));

export interface IngredientFormType {
  user: {
    id: string;
    label: string;
  };
  name: string;
  quantity: number;
  type: Quantity_Type;
  expiry: string;
  image: string;
  price: number;
}

interface IngredientFormProps {
  type: "edit" | "create";
  saveIngredient: (data: IngredientFormType) => Promise<void>;
  formLoading: boolean;
  initialValues?: IngredientFormType;
}

const IngredientForm = ({
  type,
  saveIngredient,
  formLoading,
  initialValues,
}: IngredientFormProps) => {
  const classes = useStyles();
  const [showImgErr, setShowImgErr] = useState(false);
  const ref = useRef<any>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm<IngredientFormType>({ defaultValues: initialValues });

  const { data: users } = useGetUsersQuery();
  const [uploadImage, { isLoading: imageUploading }] = useUploadImageMutation();

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];
      setShowImgErr(false);
      try {
        const formData = new FormData();
        formData.append("image", image as File);
        const url = await uploadImage(formData).unwrap();
        setValue("image", url);
      } catch (err) {
        const error = err as ErrorResponse;
        const message = error?.message ?? "Something went wrong";
        dispatch(openAlert({ message, varient: "error" }));
      }
    }
  };

  const onSubmit = async (data: IngredientFormType) => {
    try {
      const { image, ...formData } = data;

      if (image) {
        await saveIngredient({ image, ...formData });
        if (type === "create") reset();
        dispatch(
          openAlert({
            message: "Ingredient saved successfully",
            varient: "success",
          })
        );
        navigate("/ingredients");
      } else {
        setShowImgErr(true);
      }
    } catch (err) {
      const error = err as ErrorResponse;
      const message =
        error?.message === "Validation error!"
          ? error.data?.errors[0].msg ?? "Something went wrong"
          : error?.message ?? "Something went wrong";
      dispatch(openAlert({ message, varient: "error" }));
    }
  };

  const loadOptions = useMemo(() => {
    return (users || []).map((user) => ({
      id: user?._id,
      label: user?.name,
    }));
  }, [users]);

  return (
    <div style={{ minHeight: "80vh", marginTop: "30px" }}>
      <Grid container spacing={1}>
        <Grid
          container
          xs={12}
          md={9}
          spacing={2}
          sx={{ marginBottom: "10px", marginRight: "10px" }}
        >
          <Grid item xs={12} sm={6}>
            <Controller
              name="user"
              control={control}
              rules={{
                required: "User is required",
                validate: (value) => true,
              }}
              render={({ field }) => (
                <>
                  <Autocomplete
                    {...field}
                    onChange={(e, value) => {
                      field.onChange(value);
                    }}
                    options={loadOptions}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => (
                      <TextField {...params} label="User" />
                    )}
                    isOptionEqualToValue={(option, test) =>
                      option.id === test.id
                    }
                    renderOption={(props, option) => (
                      <li {...props} key={option.id}>
                        {option.label}
                      </li>
                    )}
                  />
                  {errors.user && (
                    <span style={{ color: "red" }}>{errors.user.message}</span>
                  )}
                </>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="name"
              control={control}
              defaultValue=""
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
              name="quantity"
              control={control}
              rules={{
                required: "Quantity is required",
                min: {
                  value: 0,
                  message: "Quantity must be greater than or equal to 0",
                },
              }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  size="medium"
                  label="Quantity"
                  type="number"
                  inputProps={{
                    min: 0,
                  }}
                  {...field}
                  error={!!errors.quantity}
                  helperText={errors.quantity?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="type"
              control={control}
              defaultValue="KG"
              rules={{ required: "Unit is required" }}
              render={({ field }) => (
                <FormControl
                  error={!!errors.type}
                  className={classes.formControl}
                  style={{
                    minWidth: "100%",
                  }}
                >
                  <TextField
                    id="outlined-select-currency"
                    select
                    label="Unit"
                    defaultValue="KG"
                    {...field}
                    fullWidth
                    size="medium"
                  >
                    <MenuItem value="KG">KG</MenuItem>
                    <MenuItem value="G">GM</MenuItem>
                    <MenuItem value="L">LT</MenuItem>
                    <MenuItem value="ML">ML</MenuItem>
                    <MenuItem value="COUNT">COUNT</MenuItem>
                    <MenuItem value="PCS">PIECES</MenuItem>
                  </TextField>
                  <FormHelperText>{errors.type?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="price"
              control={control}
              rules={{ required: "Price is required" }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  size="medium"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">$</InputAdornment>
                    ),
                  }}
                  label="Price"
                  type="price"
                  {...field}
                  error={!!errors.price}
                  helperText={errors.price?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="expiry"
              control={control}
              defaultValue={new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().slice(0, 10)}
              rules={{ required: "Date is required" }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  size="medium"
                  label="Expiry"
                  type="date"
                  {...field}
                  error={!!errors.expiry}
                  helperText={errors.expiry?.message}
                  inputProps={{
                    min: new Date().toISOString().slice(0, 10),
                  }}
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} md={3}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <input
              type="file"
              name="image"
              ref={ref}
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleUploadImage}
              disabled={imageUploading}
            />
            <button
              type="button"
              onClick={() => {
                if (ref.current !== null) ref.current.click();
              }}
              className={classes.uploadButton}
              disabled={imageUploading}
            >
              <div
                className={classes.imageInput}
                style={{
                  backgroundImage: `url('${watch("image") || ""}')`,
                }}
              >
                <div className={classes.placeHolder}>
                  {!imageUploading ? (
                    <>
                      <img src={cameraIcon} alt="" />
                      <span
                        style={{ color: "rgb(150, 150, 150", marginTop: "5px" }}
                      >
                        Click Here to Upload <br /> Picture
                      </span>
                    </>
                  ) : (
                    <LoadingComponent />
                  )}
                </div>
              </div>
            </button>
            {showImgErr && (
              <span
                style={{
                  color: "red",
                }}
              >
                Upload a Picture
              </span>
            )}
          </div>
        </Grid>
      </Grid>
      <div
        style={{
          marginTop: "30px",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <div>
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
              "Save Ingredient"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IngredientForm;
