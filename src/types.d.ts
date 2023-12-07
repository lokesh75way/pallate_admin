interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  mac_address?: string;
}

type UserRole = "ADMIN" | "ANNOTATOR" | "USER";

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
  _id: string;
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
