import { apiSlice } from "../../services/api";

export const recipeSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    generateRecipes: builder.mutation({
      query: (credentials) => ({
        url: "/recipes",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: { data: { recipesGenerated: number } }) =>
        response.data.recipesGenerated,
      transformErrorResponse: (response) => response.data,
      invalidatesTags: ["Recipe"],
    }),
  }),
  overrideExisting: true,
});

export const { useGenerateRecipesMutation } = recipeSlice;
