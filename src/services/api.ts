import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { RootState } from "../store/store";

const apiURL = process.env.REACT_APP_API_BASE_URL;

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: apiURL,
    prepareHeaders: async (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Users", "Ingredients", "Ingredient"],
  endpoints: (builder) => ({}),
});
