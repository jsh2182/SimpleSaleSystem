import { createApi } from "@reduxjs/toolkit/query/react";
import { apiMethods, createBaseQuery, getErrorMessage } from "../../utils/apiHelper";
import { setSearchFitlers } from "./personSlice";

const BASE_URL = "/api/Person";
// export const create = async (data, onSuccess, onError) => {
//   await callApiSimple("post", `${BASE_URL}/Create`, data, onSuccess, onError);
// };
export const personApi = createApi({
  reducerPath: "personApi",
  // baseQuery: fetchBaseQuery({
  //   baseUrl: BASE_URL,
  //   prepareHeaders: (headers, { getState }) => {
  //     const token = getState().user.currentUser?.token;
  //     if (token) {
  //       headers.set("Authorization", `Bearer ${token}`);
  //     }
  //     return headers;
  //   },
  // }),
    baseQuery:createBaseQuery(BASE_URL),
  endpoints: (builder) => ({
    create: builder.mutation({
      query: (data) => ({
        url: "/Create",
        method: apiMethods.post,
        body: data,
      }),
      transformErrorResponse: (response) => getErrorMessage(response),
    }),
    update: builder.mutation({
      query: (data) => ({
        url: "/Update",
        method: apiMethods.put,
        body: data,
      }),
      transformErrorResponse: (response) => getErrorMessage(response),
    }),
    get: builder.query({
      query: (id) => `/Get?id=${id}`,
      keepUnusedDataFor: 0,
      refetchOnMountOrArgChange: true,
      transformErrorResponse: (response) => {
        return getErrorMessage(response);
      },
      transformResponse: (res) => res.data,
    }),
    getAll: builder.query({
      query: (filterData) => ({
        url: "/GetALL",
        body: filterData,
        method: apiMethods.post,
      }),
      providesTags: ["personList"],
      transformResponse: (response) => {
        return response?.data;
      },
      transformErrorResponse: (response) => getErrorMessage(response),
      onQueryStarted(arg, { dispatch }) {
        dispatch(setSearchFitlers(arg));
      },
    }),
    getSimilarNamePeople: builder.query({
      query: (name) => `/GetSimilarNamePeople?name=${name}`,
      transformResponse: (response) => {
        return response?.data;
      },
      transformErrorResponse: (response) => getErrorMessage(response),
    }),
    delete: builder.mutation({
      query: (id) => ({
        url: `/Delete?id=${id}`,
        method: "Delete",
      }),
      transformErrorResponse: (response) => getErrorMessage(response),
      invalidatesTags: ["personList"],
    }),
  }),
});
export const {
  useCreateMutation,
  useUpdateMutation,
  useLazyGetQuery,
  useDeleteMutation,
  useLazyGetAllQuery,
  useLazyGetSimilarNamePeopleQuery
} = personApi;
