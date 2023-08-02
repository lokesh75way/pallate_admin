import React, { useCallback, useState } from "react";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import AsyncSelect from "react-select/async";
import AddIcon from "@mui/icons-material/Add";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import SaveIcon from "@mui/icons-material/Save";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import { useTheme } from "@mui/material/styles";

import { userOptions } from "./data";
import { useDropzone } from "react-dropzone";
import { makeStyles } from "@mui/styles";

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
  },
  button1: {
    color: "black",
    backgroundColor: "white",
  },
  button2: {
    backgroundColor: "#002D62",
    color: "white",
    "&:hover": {
      backgroundColor: "#002D62",
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
  alert: {
    marginLeft: "600px",
    backgroundColor: "#002D62",
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
  userId: string;
  name: string;
  quantity: number;
  expiry: string;
  type: string;
  image: File;
}

const IngredientsCreateForm: React.FC = () => {
  const classes = useStyles();
  const [isDragging, setIsDragging] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("quantity", data.quantity.toString());
      formData.append("expiry", data.expiry);
      formData.append("type", data.type);
      formData.append("image", data.image as File);

      const config = {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY0YmZkZDg0Y2E0YzM1NTFjOTU2ZTEzZSIsIm5hbWUiOiJzaGEiLCJlbWFpbCI6InNoYW1pbGtvdHRhOTlAZ21haWwuY29tIiwiYWN0aXZlIjp0cnVlLCJwYXNzd29yZCI6IiQyYiQxMiRXTmtLdll3eGxKdkNHRC5lSi5WNFBlY0FqeWR4SVphZmV1VWtNLjlURmNud3RCcXZrckRSNiIsInJvbGUiOiJVU0VSIiwiY3JlYXRlZEF0IjoiMjAyMy0wNy0yNVQxNDozNDo0NC4yMjFaIiwidXBkYXRlZEF0IjoiMjAyMy0wNy0yNVQxNDozNDo0NC4yMjFaIiwiX192IjowfSwiaWF0IjoxNjkwMjk2MzU3fQ.xZn1KSQ6prK6v39xs5iVFgDUAKC1ipHmCmZ6b7K-b6o",
            "Content-Type": "multipart/form-data",
        },
      };

      await axios.post("https://38ef-150-129-102-218.ngrok-free.app/api/ingredients", formData, config);

      setIsSnackbarOpen(true);
      console.log(formData)
      navigate("/ingredients");

      reset({
        ...data,
        name: "",
        quantity: 0,
        expiry: new Date().toISOString().slice(0, 10),
        type: "",
        // image: null,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleDragEnter = useCallback(() => {
    setIsDragging(true);
  }, []);

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

  const handleCloseSnackbar = () => {
    setIsSnackbarOpen(false);
  };

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
          rules={{
            required: "Quantity is required",
            min: {
              value: 0,
              message: "Quantity must be greater than or equal to 0",
            },
          }}
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
            <FormControl error={!!errors.type} className={classes.formControl}>
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
              label="Expiry"
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
                  padding: "7px",
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

        <Snackbar
          open={isSnackbarOpen}
          autoHideDuration={3000}
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

        <Box className={classes.boxItem}>
          <Button
            className={classes.button2}
            onClick={handleSubmit(onSubmit)}
            startIcon={<SaveIcon />}
          >
            Save
          </Button>

          <Button
            className={classes.button1}
            onClick={handleSubmit(onSubmit)}
            startIcon={<AddIcon />}
          >
            Add Item
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default IngredientsCreateForm;