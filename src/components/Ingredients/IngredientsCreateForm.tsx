import React, { useState, useRef } from "react";
import { styled } from "@mui/material/styles";
import { useForm, Controller } from "react-hook-form";
import AsyncSelect from "react-select/async";
import SaveIcon from "@mui/icons-material/Save";
import { makeStyles } from "@mui/styles";
import {
  Button,
  TextField,
  MenuItem,
  FormControl,
  FormHelperText,
  Typography,
  Grid,
  InputAdornment,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useGetUsersQuery } from "../../store/slices/userSlice";
import {
  useCreateIngredientsMutation,
  useUploadImageMutation,
} from "../../store/slices/ingredientSlice";
import { useDispatch } from "react-redux";
import { openAlert } from "../../store/slices/alertSlice";
import cameraIcon from "../../assets/camera.svg";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: "70px",
    marginLeft: "100px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    "& .MuiTextField-root, & .MuiFormControl-root": {
      width: "50%",
    },
  },

  imageInput: {
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

  box: {
    margin: "10px",
    display: "flex",
  },
  button: {
    margin: "5px !important",
    border: "2px solid #002D62 !important",
    color: "black !important",
  },
  button1: {
    color: "black !important",
    backgroundColor: "white !important",
  },
  button2: {
    backgroundColor: "#002D62 !important",
    color: "white !important",
    "&:hover": {
      backgroundColor: "#002D62 !important",
      color: "white !important",
    },
  },

  boxItem: {
    display: "flex",
    justifyContent: "space-between",
    width: "50%",
  },

  users: {
    zIndex: 100,
  },
  alert: {
    marginTop: "100px ",
    marginLeft: "600px",
    backgroundColor: "#002D62 !important",
  },
  inputLabel: {
    position: "absolute",
    backgroundColor: "white",
    zIndex: 1,
  },
}));

const StyledAsyncSelect = styled(AsyncSelect)({
  width: "50%",
});

interface FormValues {
  user: {
    id: string;
    label: string;
  };
  name: string;
  quantity: number;
  expiry: string;
  type: string;
  price: number;
  image: string;
}

const IngredientsCreateForm: React.FC = () => {
  const classes = useStyles();
  const [showImgErr, setShowImgErr] = useState(false);
  const ref = useRef<any>(null);
  const [photoURL, setPhotoURL] = useState("");
  const dispatch = useDispatch();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
  } = useForm<FormValues>();

  const { data: users } = useGetUsersQuery();
  const [createIngredient, { isLoading: ingredientCreating }] =
    useCreateIngredientsMutation();
  const [uploadImage, { isLoading: imageUploading }] = useUploadImageMutation();

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];
      setShowImgErr(false);
      try {
        const formData = new FormData();
        formData.append("image", image as File);
        const url = await uploadImage(formData).unwrap();
        setPhotoURL(url);
        setValue("image", url);
      } catch (err) {
        const error = err as ErrorResponse;
        const message = error?.message ?? "Something went wrong";
        dispatch(openAlert({ message, varient: "error" }));
      }
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const {
        user: { id: userId },
        image,
        ...formData
      } = data;

      if (image) {
        await createIngredient({ user: userId, image, ...formData }).unwrap();
        reset({
          ...data,
          name: "",
          quantity: 0,
          expiry: new Date().toISOString().slice(0, 10),
          type: "",
          price: 0,
          image: "",
          user: { id: "", label: "" },
        });
        setPhotoURL("");
        dispatch(
          openAlert({
            message: "Ingredient created successfully",
            varient: "success",
          })
        );
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

  const loadOptions = async (inputValue: string) => {
    return (users || [])
      .filter((user) =>
        user.name.toLowerCase().includes(inputValue.toLowerCase())
      )
      .map((user) => ({
        id: user?._id,
        label: user?.name,
      }));
  };

  return (
    <div style={{ marginLeft: "250px", marginTop: "70px" }}>
      <div>
        <Typography
          sx={{
            margin: "10px",
            fontSize: 30,
          }}
        >
          Create Ingredients
        </Typography>
      </div>
      <Divider />
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
                rules={{ required: "User is required" }}
                render={({ field }) => (
                  <>
                    <StyledAsyncSelect
                      {...field}
                      cacheOptions
                      defaultOptions
                      loadOptions={loadOptions}
                      placeholder="User"
                      className={classes.users}
                      styles={{
                        control: (provided, state) => ({
                          ...provided,
                          borderColor: state.isFocused ? "#002D62" : "grey",
                          "&:hover": {
                            borderColor: state.isFocused ? "#002D62" : "grey",
                          },
                        }),
                        option: (provided, state) => ({
                          ...provided,

                          backgroundColor: state.isSelected ? "white" : "white",
                          color: "black",
                        }),
                      }}
                    />
                    {errors.user && (
                      <span style={{ color: "red" }}>
                        {errors.user.message}
                      </span>
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
                defaultValue=""
                rules={{ required: "Unit is required" }}
                render={({ field }) => (
                  <FormControl
                    error={!!errors.type}
                    className={classes.formControl}
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
                defaultValue={new Date().toISOString().slice(0, 10)}
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
          <Grid container xs={12} md={3} spacing={2}>
            <Grid item xs={12}>
              <div>
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
                  style={{
                    position: "relative",
                    width: "200px",
                    height: "180px",
                    borderRadius: "8px",
                    border: "2px",
                    cursor: "pointer",
                  }}
                >
                  <div
                    className={classes.imageInput}
                    style={{
                      backgroundImage: `url('${photoURL || ""}')`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      borderRadius: "10px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={cameraIcon}
                      alt=""
                      style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        margin: "auto",
                        left: 0,
                        right: 0,
                      }}
                    />
                  </div>
                </button>
                <span
                  style={{
                    color: `${showImgErr ? "red" : "black"}`,
                    marginLeft: "60px",
                  }}
                >
                  Upload a Picture
                </span>
              </div>
            </Grid>
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
              className={classes.button2}
              onClick={handleSubmit(onSubmit)}
              startIcon={<SaveIcon />}
              disabled={ingredientCreating}
            >
              {ingredientCreating ? (
                <CircularProgress sx={{ color: "white" }} size={24} />
              ) : (
                " Add Ingredien"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngredientsCreateForm;
