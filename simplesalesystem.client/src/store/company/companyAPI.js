import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiMethods, getErrorMessage } from "../../utils/apiHelper";

const BASE_URL = "/api/Company";
// export const create = async (data, onSuccess, onError) => {
//   await callApiSimple("post", `${BASE_URL}/Create`, data, onSuccess, onError);
// };
export const companyApi = createApi({
  reducerPath: "companyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().user.currentUser?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    create: builder.mutation({
      query: (data) => ({
        url: "/Create",
        method: apiMethods.post,
        body: data,
      }),
      transformErrorResponse: (response) => getErrorMessage(response),
    }),
  }),
});
export const { useCreateMutation } = companyApi;
