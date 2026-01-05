import { createApi } from "@reduxjs/toolkit/query/react";
import {
  apiMethods,
  createBaseQuery,
  getErrorMessage,
} from "../../utils/apiHelper";
import { setSearchFitlers } from "./invoiceSlice";

const BASE_URL = "/api/Invoices";
// export const create = async (data, onSuccess, onError) => {
//   await callApiSimple("post", `${BASE_URL}/Create`, data, onSuccess, onError);
// };
export const invoiceApi = createApi({
  reducerPath: "invoiceApi",
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
      invalidatesTags: ["invoiceList"],
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
      providesTags: ["invoiceList"],
      transformResponse: (response) => {
        return response?.data;
      },
      transformErrorResponse: (response) => getErrorMessage(response),
      onQueryStarted(arg, { dispatch }) {
        dispatch(setSearchFitlers(arg));
      },
    }),
    delete: builder.mutation({
      query: (id) => ({
        url: `/Delete?id=${id}`,
        method: apiMethods.delete,
      }),
      transformErrorResponse: (response) => getErrorMessage(response),
      invalidatesTags: ["invoiceList"],
    }),
    getNextNumber: builder.query({
      query: () => ({ url: "/GetNextNumber", method: apiMethods.get }),
      transformResponse: (res) => res.data?.data,
      transformErrorResponse: (response) => getErrorMessage(response),
    }),
    sendToCustomer: builder.mutation({
      query: (id) => ({
        url: `/SendToCustomer?id=${id}`,
        method: apiMethods.get,
      }),
      transformResponse: (res) => res.data,
      transformErrorResponse: (response) => getErrorMessage(response),
      invalidatesTags: ["invoiceList"],
    }),
  }),
});
export const {
  useCreateMutation,
  useUpdateMutation,
  useLazyGetQuery,
  useDeleteMutation,
  useLazyGetAllQuery,
  useLazyGetNextNumberQuery,
  useSendToCustomerMutation,
} = invoiceApi;
