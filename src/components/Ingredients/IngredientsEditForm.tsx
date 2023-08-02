
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { useForm, Controller } from "react-hook-form";
import axios from 'axios'
import AsyncSelect from "react-select/async";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import { makeStyles } from "@mui/styles";
import { userOptions } from "./data";
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
    border: "2px solid blue",
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
    backgroundColor:'white',
    zIndex: 1,
    
  },
}));

interface Ingredient {
  id: number;
  userId: string;
  name: string;
  quantity: number;
  expiry: string;
  type: string;
  picture: File | null;
}

interface FormValues {
  userId: string;
  name: string;
  quantity: number;
  expiry: string;
  type: string;
  picture: File | null;
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
  const [ingredientData, setIngredientData] = useState<Ingredient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const classes = useStyles();

  const {
    handleSubmit,
    control,
    reset,
    
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    const fetchIngredientData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/ingredients/${ingredientId}`,
          {
            headers: {
              Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY0YzFlYjMyNTg0Mjk4YjUxNjI1YWNkZiIsIm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AcGFsbGF0ZS5jb20iLCJhY3RpdmUiOnRydWUsInBhc3N3b3JkIjoiJDJiJDEyJE9sbHBmSmR3akNHV2F3cnNJeHgwSnVqVUxOZ2NsTXpSejUwVjZwN2V3elFJMERiRTR2LjdtIiwicm9sZSI6IkFETUlOIiwiY3JlYXRlZEF0IjoiMjAyMy0wNy0yMFQxMjoyMjozOC42NThaIiwidXBkYXRlZEF0IjoiMjAyMy0wNy0yMVQwOToyNToyNS4yOTdaIiwiX192IjowfSwiaWF0IjoxNjkwODA2OTk0fQ.7vspbw1A1N019ewYYojPHS8AyMlHzlxk134f_c5GlUI",
              "ngrok-skip-browser-warning": true,
            },
          }
        );
        const data = response.data.data.ingredient; 
        setIngredientData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching ingredient data:", error);
        setLoading(false);
      }
    };

    fetchIngredientData();
  }, [ingredientId]);

  useEffect(() => {
    if (ingredientData) {
      reset({
        // userId: ingredientData.userId,
        name: ingredientData.name,
        quantity: ingredientData.quantity,
        expiry: ingredientData.expiry.split("T")[0],
        type: ingredientData.type,
        // picture: ingredientData.picture,
      });
    }
  }, [ingredientData]);

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await axios.put(
        `https://38ef-150-129-102-218.ngrok-free.app/api/ingredients/${ingredientId}`,
        data,
        {
          headers: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY0YzFlYjMyNTg0Mjk4YjUxNjI1YWNkZiIsIm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AcGFsbGF0ZS5jb20iLCJhY3RpdmUiOnRydWUsInBhc3N3b3JkIjoiJDJiJDEyJE9sbHBmSmR3akNHV2F3cnNJeHgwSnVqVUxOZ2NsTXpSejUwVjZwN2V3elFJMERiRTR2LjdtIiwicm9sZSI6IkFETUlOIiwiY3JlYXRlZEF0IjoiMjAyMy0wNy0yMFQxMjoyMjozOC42NThaIiwidXBkYXRlZEF0IjoiMjAyMy0wNy0yMVQwOToyNToyNS4yOTdaIiwiX192IjowfSwiaWF0IjoxNjkwODA2OTk0fQ.7vspbw1A1N019ewYYojPHS8AyMlHzlxk134f_c5GlUI",
          },
        }
      );
      console.log("Updated ingredient:", response.data);
      onSave(data);
      navigate('/ingredients');
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

      <Box mt={2} className={classes.boxItem}>
        <Button
          color="primary"
          onClick={handleSubmit(onSubmit)}
          startIcon={<SaveIcon />}
          className={classes.button2}
          variant="contained"
        >
          Save
        </Button>
        <Button
          color="primary"
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