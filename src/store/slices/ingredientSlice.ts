import { apiSlice } from "../../services/api";

export const ingredientSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getIngredients: builder.query<Ingredient[], void>({
      query: () => ({
        url: "/ingredients",
      }),
      transformResponse: (response: { data: { ingredients: Ingredient[] } }) =>
        response.data.ingredients,
      transformErrorResponse: (response) => response.data,
      providesTags: ["Ingredients"],
    }),
    getIngredient: builder.query<Ingredient, string>({
      query: (id) => ({
        url: `/ingredients/${id}`,
      }),
      transformResponse: (response: { data: { ingredient: Ingredient } }) =>
        response.data.ingredient,
      transformErrorResponse: (response) => response.data,
    }),
    deleteIngredients: builder.mutation({
      query: (credentials) => ({
        url: "/ingredients",
        method: "DELETE",
        body: { ...credentials },
      }),
      transformResponse: (response: { message: string }) => response.message,
      transformErrorResponse: (response) => response.data,
    }),
    createIngredients: builder.mutation({
      query: (credentials) => ({
        url: "/ingredients",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: { data: { ingredients: Ingredient[] } }) =>
        response.data.ingredients,
      transformErrorResponse: (response) => response.data,
    }),
    updateIngredients: builder.mutation({
      query: (credentials) => ({
        url: "/ingredients",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: { data: { ingredients: Ingredient[] } }) =>
        response.data.ingredients,
      transformErrorResponse: (response) => response.data,
    }),
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

export const {
  useGetIngredientsQuery,
  useDeleteIngredientsMutation,
  useCreateIngredientsMutation,
  useUploadImageMutation,
  useGetIngredientQuery,
} = ingredientSlice;
