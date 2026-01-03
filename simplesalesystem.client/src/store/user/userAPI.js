// src/store/user/userAPI.js
import { createApi } from "@reduxjs/toolkit/query/react";
import { apiMethods, createBaseQuery, getErrorMessage } from "../../utils/apiHelper";
import { logout, setCurrentUser } from "./userSlice";
const BASE_URL = "/api/user";

// // 🟡 APIهای مستقیم برای useState + callback
// export const fetchUserSettingsWithCallback = async (setState) => {
//   try {
//     const res = await axios.get(`${BASE_URL}/settings`);
//     setState(res.data);
//   } catch (err) {
//     console.error("fetchUserSettingsWithCallback error:", err);
//   }
// };

// export const updateUserSettings = (settings) =>
//   axios.put(`${BASE_URL}/settings`, settings);

// // 🔵 thunkهای مربوط به Redux
// export const fetchProfile = createAsyncThunk(
//   "user/fetchProfile",
//   async ({ rejectWithValue }) => {
//     return await callApi("get", `${BASE_URL}/Profile`, null, rejectWithValue);
//   }
// );
// export const loginUser = createAsyncThunk(
//   "User/Login",
//   async (credentials, { rejectWithValue }) => {
//     return await callApiRedux(
//       "get",
//       `${BASE_URL}/Login`,
//       {
//         username: credentials.username,
//         password: credentials.password,
//       },
//       rejectWithValue
//     );
//   }
// );
export const userApi = createApi({
  reducerPath: "userApi",
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
    // 🟩 لاگین
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/Login",
        method: "POST",
        body: credentials,
      }),
      transformErrorResponse: (response) => {
        return getErrorMessage(response);
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const token = data.data.access_token;
          const exp = Date.now() + data.data.expires_in * 1000;
          const full_name = data.data.token_for;
          const mobile = data.data.u_mobile;
          const userData = {
            token,
            exp,
            full_name,
            uName: arg.username,
            u_mobile: mobile,
          };
          dispatch(setCurrentUser(userData));
        } catch {
          dispatch(logout());
        }
      },
    }),

    fetchProfile: builder.query({
      query: () => "/Profile",
      keepUnusedDataFor: 0,
      refetchOnMountOrArgChange: true,
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCurrentUser(data));
        } catch {
          dispatch(logout());
        }
      },
    }),
    fetchUserList: builder.query({
      query: () => "/GetAll",
      providesTags: ["UserList"],
      keepUnusedDataFor: 0,
      refetchOnMountOrArgChange: true,
      transformErrorResponse: (response) => {
        return getErrorMessage(response);
      },
      transformResponse: (res) => res.data,
    }),
    createUser: builder.mutation({
      query: (data) => ({
        url: "/Create",
        body: data,
        method: "POST",
      }),
      transformErrorResponse: (response) => {
        return getErrorMessage(response);
      },
      invalidatesTags: ["UserList"],
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: "/Update",
        body: data,
        method: apiMethods.put,
      }),
      transformErrorResponse: (response) => {
        return getErrorMessage(response);
      },
      invalidatesTags: ["UserList"],
    }),    
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/Delete?id=${id}`,
        method: apiMethods.delete,
      }),
      transformErrorResponse: (response) => {
        return getErrorMessage(response);
      },
      invalidatesTags: ["UserList"],
    }),
    updateMe: builder.mutation({
      query: (data) => ({
        url: `/UpdateMe`,
        method: "PUT",
        body: data,
      }),
      transformErrorResponse: (response) => {
        return getErrorMessage(response);
      },
    }),
  }),
});

export const {
  useLoginUserMutation,
  useFetchProfileQuery,
  useLazyFetchUserListQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateMeMutation,
  useUpdateUserMutation
} = userApi;
