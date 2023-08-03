import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const usersApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000/api",
    prepareHeaders: (headers) => {
      try {
        const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY0YzFlYjMyNTg0Mjk4YjUxNjI1YWNkZiIsIm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AcGFsbGF0ZS5jb20iLCJhY3RpdmUiOnRydWUsInBhc3N3b3JkIjoiJDJiJDEyJE9sbHBmSmR3akNHV2F3cnNJeHgwSnVqVUxOZ2NsTXpSejUwVjZwN2V3elFJMERiRTR2LjdtIiwicm9sZSI6IkFETUlOIiwiY3JlYXRlZEF0IjoiMjAyMy0wNy0yMFQxMjoyMjozOC42NThaIiwidXBkYXRlZEF0IjoiMjAyMy0wNy0yMVQwOToyNToyNS4yOTdaIiwiX192IjowfSwiaWF0IjoxNjkwODA2OTk0fQ.7vspbw1A1N019ewYYojPHS8AyMlHzlxk134f_c5GlUI"; 
        headers.set("Authorization", token);
      } catch (error) {
        console.error("Error while setting Authorization header:", error);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<{ token: string }, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/users/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    getUsers: builder.query<any[], void>({
      query: () => "users",

    }),
    getIngredients:builder.query<any[],void>({
      query:()=>"ingredients",
    }),
    deleteIngredient: builder.mutation<void, string[]>({
      query: (ingredientIds) => ({
        url: `ingredients`,
        method: "DELETE",
        
        data: {
          ingredientId: ingredientIds,
        },
      }),
    }),
    createIngredient: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: 'ingredients',
        method: 'POST',
        body: formData,
        
      }),
    }),
    updateIngredient: builder.mutation<any, Partial<Ingredient>>({
      query: (updatedIngredient) => ({
        url: `ingredients/${updatedIngredient.id}`,
        method: "PUT",
        body: updatedIngredient,
      }),
    }),
    getIngredientById: builder.query<any, string>({
      query: (ingredientId) => `ingredients/${ingredientId}`,
    }),
  }),
  })


export const { useGetUsersQuery,useGetIngredientsQuery,useDeleteIngredientMutation,useCreateIngredientMutation,useUpdateIngredientMutation,useGetIngredientByIdQuery,useLoginMutation } = usersApi;