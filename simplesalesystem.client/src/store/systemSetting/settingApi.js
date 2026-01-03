import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createBaseQuery, getErrorMessage } from "../../utils/apiHelper";

const BASE_URL = "/api/SystemSetting";
// export const create = async (data, onSuccess, onError) => {
//   await callApiSimple("post", `${BASE_URL}/Create`, data, onSuccess, onError);
// };
export const systemSettingApi = createApi({
  reducerPath: "systemSettingApi",
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
    // create: builder.mutation({
    //   query: (data) => ({
    //     url: "/Create",
    //     method: apiMethods.post,
    //     body: data,
    //   }),
    //   transformErrorResponse: (response) => getErrorMessage(response),
    // }),
    // update: builder.mutation({
    //   query: (data) => ({
    //     url: "/Update",
    //     method: apiMethods.put,
    //     body: data,
    //   }),
    //   transformErrorResponse: (response) => getErrorMessage(response),
    // }),
    getSetting: builder.query({
      query: (settingName) => `?name=${settingName}`,
      keepUnusedDataFor: 0,
      refetchOnMountOrArgChange: true,
      transformErrorResponse: (response) => {
        return getErrorMessage(response);
      },
      transformResponse: (res) => res.data,
    }),
    // getAll: builder.query({
    //   query: (filterData) => ({
    //     url: "/GetALL",
    //     body: filterData||{},
    //     method: apiMethods.post,
    //   }),
    //   providesTags: ["systemSettingList"],
    //   transformResponse: (response) => {
    //     return response?.data;
    //   },
    //   transformErrorResponse: (response) => getErrorMessage(response),
    //   onQueryStarted(arg, { dispatch }) {
    //     dispatch(setSearchFitlers(arg));
    //   },
    // }),
    // delete: builder.mutation({
    //   query: (id) => ({
    //     url: `/Delete?id=${id}`,
    //     method: "Delete",
    //   }),
    //   transformErrorResponse: (response) => getErrorMessage(response),
    //   invalidatesTags: ["systemSettingList"],
    // }),
  }),
});
export const { useLazyGetSettingQuery } = systemSettingApi;
