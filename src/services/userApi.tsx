import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {Ingredient} from '../components/Ingredients/IngredientsEditForm'
import {ApiResponse} from '../components/Ingredients/IngredientsList'
import {userApiResponse} from '../components/user/UserList'

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
const Authtoken = process.env.REACT_APP_ACCESS_TOKEN;

export const usersApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiBaseUrl}`,
    prepareHeaders: (headers) => {
      try {
        const token = `${Authtoken}`; 
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
    getUsers: builder.query<userApiResponse, void>({
      query: () => "users",

    }),
    getIngredients:builder.query<ApiResponse,void>({
      query:()=>"ingredients",
    }),
    deleteIngredient: builder.mutation<void, string[]>({
      query: (ingredientIds) => ({
        url: `ingredients`,
        method: "DELETE",
        body: {
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