import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { useForm, Controller } from "react-hook-form";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import Snackbar from "@mui/material/Snackbar";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import AsyncSelect from "react-select/async";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import { useDropzone } from "react-dropzone";
import { makeStyles } from "@mui/styles";
import { userOptions } from "./data";
import { useUpdateIngredientMutation } from "../../services/userApi";
import { usersApi } from "../../services/userApi";
import {
  Button,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: "60px",
    marginLeft: "100px",
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
    margin: "5px",
    border: "2px solid #002D62",
    color: "black",
    "&:hover": {
      backgroundColor: "white",
      color: "black",
    },
  },
  button1: {
    color: "black",
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: "white",
      color: "black",
    },
  },
  button2: {
    backgroundColor: "#002D62",

    color: "white",
    "&:hover": {
      color: "white",
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
  inputLabel: {
    position: "absolute",
    backgroundColor: "white",
    zIndex: 1,
  },
}));

interface Ingredient {
  id: string;
  userId: string;
  name: string;
  quantity: number;
  expiry: string;
  type: string;
  image: File | null | string;
}

interface FormValues {
  // userId: string;
  name: string;
  quantity: number;
  expiry: string;
  type: string;
  image: File | null | string;
}

interface IngredientsEditFormProps {
  onSave: (data: FormValues) => void;
}

const StyledAsyncSelect = styled(AsyncSelect)({
  width: "50%",
});

const IngredientsEditForm: React.FC<IngredientsEditFormProps> = ({
  onSave,
}) => {
  const { ingredientId } = useParams<{ ingredientId: string }>();
  // const [ingredientData, setIngredientData] = useState<Ingredient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const navigate = useNavigate();
  const classes = useStyles();
  const theme = useTheme();

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  const { data: ingredientData } =
    usersApi.endpoints.getIngredientById.useQuery(ingredientId);
  console.log("data is", ingredientData);

  useEffect(() => {
    if (ingredientData) {
      reset({

        name: ingredientData.data.ingredient.name,
        quantity: ingredientData.data.ingredient.quantity,
        expiry: ingredientData.data.ingredient.expiry.split("T")[0],
        type: ingredientData.data.ingredient.type,
        image: ingredientData.data.ingredient.image,
      });
    }
  }, [ingredientData]);
  const [updateIngredient, { isLoading: isUpdating }] =
    useUpdateIngredientMutation();

  const onSubmit = async (data: FormValues) => {
    try {
      const updatedIngredient: Partial<Ingredient> = {
        id: ingredientId,
        name: data.name,
        quantity: data.quantity,
        expiry: data.expiry,
        type: data.type,
        image: data.image,
      };
      const response = await updateIngredient(updatedIngredient);
      onSave(data);
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
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];
        console.log("Selected picture:", selectedFile);
        setValue("image", selectedFile);

        setIsSnackbarOpen(true);
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
          name="expiry"
          control={control}
          defaultValue={new Date().toISOString().slice(0, 10)}
          rules={{ required: "Date is required" }}
          render={({ field }) => (
            <TextField
              label="Date"
              type="date"
              {...field}
              error={!!errors.expiry}
              helperText={errors.expiry?.message}
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
                  padding: "10px",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <input {...getInputProps()} />
                <Button
                  startIcon={<AddAPhotoIcon />}
                  className={classes.button}
                >
                  Upload or Drag Pictures
                </Button>
              </div>
            </section>
          )}
        />

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
