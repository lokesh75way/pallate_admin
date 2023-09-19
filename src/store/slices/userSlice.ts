import { apiSlice } from "../../services/api";

export const userSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => ({
        url: "/users",
      }),
      transformResponse: (response: { data: { users: User[] } }) =>
        response.data.users,
      transformErrorResponse: (response) => response.data,
      providesTags: ["Users"],
    }),
    deleteUsers: builder.mutation({
      query: (credentials) => ({
        url: "/users",
        method: "DELETE",
        body: { ...credentials },
      }),
      transformResponse: (response: { message: string }) => response.message,
      transformErrorResponse: (response) => response.data,
      invalidatesTags: ["Users", "Ingredients", "Annotators"],
    }),
    updateUsers: builder.mutation({
      query: ({ id, ...credentials }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: credentials,
      }),
      transformResponse: (response: { data: { users: User[] } }) =>
        response.data.users,
      transformErrorResponse: (response) => response.data,
      invalidatesTags: ["Users"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetUsersQuery,
  useDeleteUsersMutation,
  useUpdateUsersMutation,
} = userSlice;
