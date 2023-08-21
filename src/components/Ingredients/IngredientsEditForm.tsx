import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { useForm, Controller } from "react-hook-form";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useTheme } from "@mui/material/styles";
import AsyncSelect from "react-select/async";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import { useDropzone } from "react-dropzone";
import { makeStyles } from "@mui/styles";
import { userOptions } from "./data";
import { useUpdateIngredientMutation } from "../../services/userApi";
import { usersApi } from "../../services/userApi";
import InputAdornment from "@mui/material/InputAdornment";

import {
  Button,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  CircularProgress,
} from "@mui/material";

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
    color: "black  !important",
    "&:hover": {
      backgroundColor: "white !important",
      color: "black !important",
    },
  },
  button1: {
    color: "black !important",
    backgroundColor: "white !important",
    "&:hover": {
      backgroundColor: "white !important",
      color: "black !important",
    },
  },
  button2: {
    backgroundColor: "#002D62   !important",

    color: "white !important",
    "&:hover": {
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
    marginLeft: "600px",
    backgroundColor: "#002D62 !important",
  },
  inputLabel: {
    position: "absolute",
    backgroundColor: "white",
    zIndex: 1,
  },
}));

export interface Ingredient {
  id: string;
  userId: string;
  name: string;
  quantity: number;
  expiry: string;
  type: string;
  price: number;
  image: File | null | string;
}

interface FormValues {
  // userId: string;
  name: string;
  quantity: number;
  expiry: string;
  type: string;
  price: number;
  image: File | null | string;
}

interface IngredientsEditFormProps {
  onSave: (data: FormValues) => void;
}

const StyledAsyncSelect = styled(AsyncSelect)({
  width: "50%",
});

const IngredientsEditForm: React.FC = ({}) => {
  const { ingredientId } = useParams<{ ingredientId: string | undefined }>();
  const validIngredientId = ingredientId || "";
  const [loading, setLoading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const navigate = useNavigate();
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);

  const [isSnackbarOpenFile, setIsSnackbarOpenFile] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  const { data,refetch } =
    usersApi.endpoints.getIngredientById.useQuery(validIngredientId);
  const ingredientData = data?.data.ingredient;

  const [updateIngredient] = useUpdateIngredientMutation();

  useEffect(() => {
    refetch();
    if (ingredientData) {
      reset({
        name: ingredientData.name,
        quantity: ingredientData.quantity,
        expiry: ingredientData.expiry.split("T")[0],
        type: ingredientData.type,
        image: ingredientData.image,
        price: ingredientData.price,
      });
    }
  }, [ingredientData, loading]);
  const handleCloseSnackbar = () => {
    setIsSnackbarOpen(false);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const updatedIngredient: Partial<Ingredient> = {
        id: ingredientId,
        name: data.name,
        quantity: data.quantity,
        expiry: data.expiry,
        type: data.type,
        price: data.price,
        image: data.image,
      };
      const response = await updateIngredient(updatedIngredient);
      if (response) {
        setLoading(true);
      }

      navigate("/ingredients");
    } catch (error) {
      console.error("Error updating ingredient:", error);
    }
  };

  const filterColors = (inputValue: string) => {
    return userOptions.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const loadOptions = (
    inputValue: string,
    callback: (options: any) => void
  ) => {
    setTimeout(() => {
      callback(filterColors(inputValue));
    }, 1000);
  };
  const handleDragEnter = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];
        console.log("Selected file:", selectedFile);

        if (selectedFile.type.startsWith("image/")) {
          const reader = new FileReader();

          reader.onload = (e: ProgressEvent<FileReader>) => {
            const image = new Image();
            image.src = e.target!.result as string;

            image.onload = () => {
              if (image.width > 0 && image.height > 0) {
                setValue("image", selectedFile);
                setIsLoading(true);

                try {
                  setTimeout(() => {
                    setIsLoading(false);
                    setIsSnackbarOpen(true);
                  }, 2000);
                } catch (error) {
                  console.error("Error uploading image:", error);
                  setIsLoading(false);
                }
              } else {
                console.log("Selected file is not a valid image.");
              }
            };
          };

          reader.readAsDataURL(selectedFile);
        } else if (selectedFile.type.startsWith("video/")) {
          setIsSnackbarOpenFile(true);
        } else {
          setIsSnackbarOpenFile(true);
        }
      }
    },
    [setValue]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    onDragEnter: handleDragEnter,
    onDragLeave: () => setIsDragging(false),
  });
  return (
    <div>
      <div className={classes.container}>
        <StyledAsyncSelect
          cacheOptions
          defaultOptions
          loadOptions={loadOptions}
          placeholder="UserID"
          className={classes.users}
        />

        <Controller
          name="name"
          control={control}
          defaultValue=""
          rules={{ required: "Name is required" }}
          render={({ field }) => (
            <TextField
              label="Name"
              {...field}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          )}
        />

        <Controller
          name="quantity"
          control={control}
          defaultValue={0}
          rules={{ required: "Quantity is required", min: 1 }}
          render={({ field }) => (
            <TextField
              label="Quantity"
              type="number"
              {...field}
              error={!!errors.quantity}
              helperText={errors.quantity?.message}
            />
          )}
        />

        <Controller
          name="type"
          control={control}
          defaultValue=""
          rules={{ required: "Unit is required" }}
          render={({ field }) => (
            <FormControl error={!!errors.type}>
              <InputLabel
                htmlFor="type"
                className={`${classes.inputLabel} 
        }`}
              >
                Unit
              </InputLabel>
              <Select {...field}>
                <MenuItem value="KG">KG</MenuItem>
                <MenuItem value="G">GM</MenuItem>
                <MenuItem value="L">LT</MenuItem>
                <MenuItem value="ML">ML</MenuItem>
                <MenuItem value="COUNT">COUNT</MenuItem>
              </Select>
              <FormHelperText>{errors.type?.message}</FormHelperText>
            </FormControl>
          )}
        />
        <Controller
          name="price"
          control={control}
          defaultValue={0}
          rules={{ required: "Price is required" }}
          render={({ field }) => (
            <TextField
              label="Price"
              type="number"
              {...field}
              error={!!errors.price}
              helperText={errors.price?.message}
            />
          )}
        />

        <Controller
          name="expiry"
          control={control}
          defaultValue={new Date().toISOString().slice(0, 10)}
          rules={{ required: "Date is required" }}
          render={({ field }) => (
            <TextField
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
        <Controller
          name="image"
          control={control}
          rules={{ required: "Picture is required" }}
          render={() => (
            <section>
              <div
                {...getRootProps()}
                style={{
                  border: isDragging
                    ? "2px dashed #002D62"
                    : "2px solid transparent",
                  padding: "7px",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <input {...getInputProps()} />
                {isLoading ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "30px",
                    }}
                  >
                    <CircularProgress />
                  </div>
                ) : (
                  <Button
                    startIcon={<AddAPhotoIcon />}
                    className={classes.button}
                  >
                    Upload or Drag Pictures
                  </Button>
                )}
              </div>
            </section>
          )}
        />
        <Snackbar
          open={isSnackbarOpen}
          autoHideDuration={1000}
          onClose={handleCloseSnackbar}
        >
          <MuiAlert
            className={classes.alert}
            onClose={handleCloseSnackbar}
            severity="success"
            elevation={6}
            variant="filled"
          >
            Picture added
          </MuiAlert>
        </Snackbar>
        <Snackbar
          open={isSnackbarOpenFile}
          autoHideDuration={1000}
          onClose={handleCloseSnackbar}
        >
          <MuiAlert
            className={classes.alert}
            onClose={handleCloseSnackbar}
            severity="success"
            elevation={6}
            variant="filled"
          >
            Not an image
          </MuiAlert>
        </Snackbar>

        <Box className={classes.boxItem}>
          <Button
            onClick={handleSubmit(onSubmit)}
            startIcon={<SaveIcon />}
            className={classes.button2}
            variant="contained"
          >
            Save
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            startIcon={<AddIcon />}
            className={classes.button1}
          >
            Add More
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default IngredientsEditForm;
