import { createApi } from "@reduxjs/toolkit/query/react";
import {
  apiMethods,
  createBaseQuery,
  getErrorMessage,
} from "../../utils/apiHelper";

const BASE_URL = "/api/InvoiceDefaultDescriptions";

export const invoiceDefaultDescsApi = createApi({
  reducerPath: "invoiceDefaultDescsApi",
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
  baseQuery: createBaseQuery(BASE_URL),
  endpoints: (builder) => ({
    create: builder.mutation({
      query: (data) => ({
        url: "/Create",
        method: apiMethods.post,
        body: data,
      }),
      transformErrorResponse: (response) => getErrorMessage(response),
      invalidatesTags: ["invoiceDefaultDescList"],
    }),
    getAllInvoiceDescs: builder.query({
      query: (filterData) => ({
        url: "/GetALL",
        body: filterData,
        method: apiMethods.post,
      }),
      providesTags: ["invoiceDefaultDescList"],
      transformResponse: (response) => {
        return response?.data;
      },
      transformErrorResponse: (response) => getErrorMessage(response),
    }),
    delete: builder.mutation({
      query: (id) => ({
        url: `/Delete?id=${id}`,
        method: apiMethods.delete,
      }),
      transformErrorResponse: (response) => getErrorMessage(response),
      invalidatesTags: ["invoiceDefaultDescList"],
    }),
  }),
});
export const {
  useCreateMutation,
  useDeleteMutation,
  useLazyGetAllInvoiceDescsQuery,
} = invoiceDefaultDescsApi;
