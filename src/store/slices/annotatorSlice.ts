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
      providesTags: (result = [], error, args) => [
        "Annotator",
        ...result.map(({ _id: id }) => ({ type: "Annotator" as const, id })),
      ],
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
      invalidatesTags: ["Annotator"],
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
      invalidatesTags: (result, error, arg) => [
        { type: "Annotator", id: arg.id },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAnnotatorsQuery,
  useUpdateAnnotatorsMutation,
  useCreateAnnotatorsMutation,
} = userSlice;
