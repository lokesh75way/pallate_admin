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
    }),
  }),
  overrideExisting: true,
});

export const { useGetUsersQuery, useDeleteUsersMutation } = userSlice;
