import { apiSlice } from "../../services/api";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        body: { ...credentials },
      }),
      transformResponse: (response: {
        data: { token: string; user: User };
      }) => {
        if (response.data.user.role === "USER")
          throw new Error("Invalid email or password");
        return response.data;
      },
      transformErrorResponse: (response) => response.data,
      invalidatesTags: ["Ingredient", "User", "Annotator"],
    }),
    forgotPassword: builder.mutation({
      query: (credentials) => ({
        url: "/users/forgot-password",
        method: "POST",
        body: { ...credentials },
      }),
      transformResponse: (response: { message: string }) => response.message,
      transformErrorResponse: (response) => response.data,
    }),
    resetPassword: builder.mutation({
      query: (credentials) => ({
        url: "/users/reset-password",
        method: "PUT",
        body: { ...credentials },
      }),
      transformResponse: (response: { message: string }) => response.message,
      transformErrorResponse: (response) => response.data,
    }),
  }),
  overrideExisting: true,
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApiSlice;
