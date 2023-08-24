import { apiSlice } from "../../services/api";

export const imageSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation({
      query: (credentials) => ({
        url: "/images",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: { data: { image: string } }) =>
        response.data.image,
      transformErrorResponse: (response) => response.data,
    }),
  }),
  overrideExisting: true,
});

export const { useUploadImageMutation } = imageSlice;
