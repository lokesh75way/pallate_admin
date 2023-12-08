import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";
import { userSignedOut } from "../store/slices/authSlice";

const apiURL = process.env.REACT_APP_API_BASE_URL;
// const apiURL = "http://localhost:5000/api/pallate/api";

const baseQuery = fetchBaseQuery({
  baseUrl: apiURL,
  prepareHeaders: async (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithInterception: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (
    result.error &&
    result.error.status === 401 &&
    ((result.error.data as ErrorResponse).message as string) ===
      "Session expired"
  ) {
    // unauthorised error handling
    api.dispatch(userSignedOut());
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithInterception,
  tagTypes: ["User", "Ingredient", "Annotator", "Recipe"],
  endpoints: (builder) => ({}),
});
