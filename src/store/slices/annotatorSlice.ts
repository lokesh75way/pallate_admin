import { apiSlice } from "../../services/api";

export const userSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAnnotators: builder.query<User[], void>({
      query: () => ({
        url: "/annotators",
      }),
      transformResponse: (response: { data: { annotators: User[] } }) =>
        response.data.annotators,
      transformErrorResponse: (response) => response.data,
      providesTags: ["Annotators"],
    }),
    createAnnotators: builder.mutation({
      query: ({ ...credentials }) => ({
        url: `/annotators`,
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: { data: { annotator: User } }) =>
        response.data.annotator,
      transformErrorResponse: (response) => response.data,
      invalidatesTags: ["Annotators"],
    }),
    updateAnnotators: builder.mutation({
      query: ({ id, ...credentials }) => ({
        url: `/annotators/${id}`,
        method: "PUT",
        body: credentials,
      }),
      transformResponse: (response: { data: { annotator: User } }) =>
        response.data.annotator,
      transformErrorResponse: (response) => response.data,
      invalidatesTags: ["Annotators"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAnnotatorsQuery,
  useUpdateAnnotatorsMutation,
  useCreateAnnotatorsMutation,
} = userSlice;
