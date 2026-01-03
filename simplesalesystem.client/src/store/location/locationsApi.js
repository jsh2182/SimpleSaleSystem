import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getErrorMessage, prepareHeaders } from "../../utils/apiHelper";
const BASE_URL = "/api";
export const locationsApi = createApi({
  reducerPath: "locationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) =>
      prepareHeaders(headers, getState),
  }),
  endpoints: (builder) => ({
    getAllProvinces: builder.query({
      query: () => "Province/Get",
      keepUnusedDataFor: 60,
      transformResponse: (response) => response?.data,
      transformErrorResponse: (response) => getErrorMessage(response),
    }),
    getCityList: builder.query({
      query: (provinceID) => `City/Get?provinceID=${provinceID}`,
      keepUnusedDataFor: 60,
      transformResponse: (response) => response?.data,
      transformErrorResponse: (response) => getErrorMessage(response),
    }),
  }),
});
export const { useGetAllProvincesQuery, useLazyGetCityListQuery } =
  locationsApi;
// export const getAllProvinces = createAsyncThunk(
//   "Locations/GetAllProvinces",
//   async (signal, { rejectWithValue }) => {
//     return await callApiRedux(
//       "get",
//       "/api/Province/Get",
//       undefined,
//       rejectWithValue,
//       undefined,
//       undefined,
//       signal
//     );
//   }
// );
// export const getCityList = (provinceID, onSuccess, onError) => {
//   callApiSimple(
//     "get",
//     "/api/City/Get",
//     { provinceID: provinceID },
//     onSuccess,
//     onError
//   );
// };
