interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  mac_address?: string;
}

interface SuccessResponse {
  data: any;
  message: string;
  success: boolean;
}

interface ErrorResponse extends SuccessResponse {
  error_code: number;
}

type Quantity_Type = "KG" | "G" | "L" | "ML" | "COUNT";

interface Ingredient {
  user: {
    _id: string;
    name: string;
  };
  name: string;
  quantity: number;
  type: Quantity_Type;
  expiry: Date;
  image: string;
  price: number;
}
