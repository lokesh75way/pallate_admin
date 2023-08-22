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
import { useTheme } from "@mui/material/styles";
import { useCreateIngredientMutation } from "../../services/userApi";
import { userOptions } from "./data";
import { useDropzone } from "react-dropzone";
import { makeStyles } from "@mui/styles";
import InputAdornment from "@mui/material/InputAdornment";
import { UserData } from "../../models/UserModel";
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
  CircularProgress,
} from "@mui/material";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: "70px",
    marginLeft: "100px",
    padding:'20px',
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

interface userApiResponse {
  data: {
    users: UserData[];
  };
}
interface FormValues {
  userId: string;
  name: string;
  quantity: number;
  expiry: string;
  type: string;
  price: number;
  image: File;
}

const IngredientsCreateForm: React.FC = () => {
  const classes = useStyles();
  const [isDragging, setIsDragging] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [isSnackbarOpenFile, setIsSnackbarOpenFile] = useState(false);

  const navigate = useNavigate();
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
  } = useForm<FormValues>();

  const { data } = usersApi.endpoints.getUsers.useQuery();
  const [createIngredient] = useCreateIngredientMutation();

  const onSubmit = async (data: FormValues) => {
    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("quantity", data.quantity.toString());
      formData.append("expiry", data.expiry);
      formData.append("type", data.type);
      formData.append("price", data.price.toString());
      formData.append("image", data.image as File);

      await createIngredient(formData);
      setIsSnackbarOpen(true);
      console.log(formData);
      navigate("/ingredients");

      reset({
        ...data,
        name: "",
        quantity: 0,
        expiry: new Date().toISOString().slice(0, 10),
        type: "",
        price: 0,
        // image: null,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleDragEnter = useCallback(() => {
    setIsDragging(true);
  }, []);

  const loadOptions = async (inputValue: string) => {
    try {
      const userResponse:userApiResponse = data as userApiResponse;
      const filteredUsers = userResponse.data.users.filter((user) =>
        user.name.toLowerCase().includes(inputValue.toLowerCase())
      );
  
      return filteredUsers.map((user) => ({
        lable:user._id,
        label: user.name,
      }));
    } catch (error) {
      console.error("Error loading users:", error);
      return [];
    }
  };  
  
  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];
        // console.log("Selected file:", selectedFile);

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

  const handleCloseSnackbar = () => {
    setIsSnackbarOpen(false);
    setIsSnackbarOpenFile(false);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    onDragEnter: handleDragEnter,
    onDragLeave: () => setIsDragging(false),
  });

  return (
    <div>
      <div className={classes.container}>
      <Controller
          name="userId"
          control={control}
          rules={{ required: "User is required" }}
          render={({ field }) => (
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
                  color:'black'
                }),
              }}
            />
          )}
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
          name="price"
          control={control}
          // defaultValue={0}
          rules={{ required: "Price is required" }}
          render={({ field }) => (
            <TextField
              label="Price"
              type="price"
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
