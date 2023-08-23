import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { RootState } from "../store/store";

// const apiURL = process.env.REACT_APP_API_BASE_URL;
const apiURL = "http://localhost:5000/api/pallate/api";

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
  tagTypes: ["Users", "Ingredients"],
  endpoints: (builder) => ({}),
});
