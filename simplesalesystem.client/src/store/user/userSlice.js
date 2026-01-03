// src/store/user/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

let currUser = JSON.parse(localStorage.getItem("currUser"));
try {
  if (currUser && Number(currUser.exp) <= Date.now()) {
    localStorage.removeItem("currUser");
    currUser = null;
  }
} catch {
  localStorage.removeItem("currUser");
  currUser = null;
}

const initialState = {
  currentUser: currUser,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
      localStorage.setItem("currUser", JSON.stringify(action.payload));
    },
    logout(state) {
      state.currentUser = null;
      localStorage.removeItem("currUser");
    },
  },
});

export const { setCurrentUser, logout } = userSlice.actions;
export default userSlice.reducer;

// توکن از localStorage بخون و اعتبارش رو بررسی کن
// let savedUser = null;
// try {
//   const token = localStorage.getItem("token");
//   const decoded = jwtDecode(token);

//   if (decoded.exp * 1000 > Date.now()) {
//     savedUser = decoded;
//   } else {
//     localStorage.removeItem("token");
//   }
// } catch {
//   localStorage.removeItem("token");
// }
// let currUser = JSON.parse(localStorage.getItem("currUser"));
// try {
//   if (currUser && Number(currUser.exp) <= Date.now()) {
//     localStorage.removeItem("currUser");
//   }
// } catch {
//   localStorage.removeItem("currUser");
// }

// const initialState = {
//   currentUser: currUser,
//   loading: {
//     fetchProfile: false,
//     loginUser: false,
//   },
//   error: {
//     fetchProfile: null,
//     loginUser: null,
//   },
// };

// const userSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {
//     logout(state) {
//       state.currentUser = null;
//       localStorage.removeItem("currUser");
//     },
//     clearError(state, action) {
//       const errorName = action.payload;
//       state.error[errorName] = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // fetchProfile
//       .addCase(fetchProfile.pending, (state) => {
//         state.loading.fetchProfile = true;
//         state.error.fetchProfile = null;
//       })
//       .addCase(fetchProfile.fulfilled, (state, action) => {
//         state.loading.fetchProfile = false;
//         // اگر بخوای دیتا از سرور رو هم نگه داری
//         state.currentUser = {
//           ...state.currentUser,
//           ...action.payload,
//         };
//         //localStorage.setItem("user", action.payload.data);
//       })
//       .addCase(fetchProfile.rejected, (state, action) => {
//         state.loading.fetchProfile = false;
//         state.error.fetchProfile = action.error.message;
//       })

//       // loginUser
//       .addCase(loginUser.pending, (state) => {
//         state.loading.loginUser = true;
//         state.error.loginUser = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.loading.loginUser = false;

//         const token = action.payload.data.access_token;
//         const now = new Date();
//         const exp = Date.now() + Number(action.payload.data.expires_in) * 1000;
//         const name = action.payload.data.token_for;
//         state.currentUser = {
//           ...state.currentUser,
//           token: token,
//           exp: exp,
//           full_name: name,
//         };
//         localStorage.setItem("currUser", JSON.stringify(state.currentUser));
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.loading.loginUser = false;
//         state.error.loginUser =
//           action.payload || action.error.message || "خطای ناشناخته";
//       });
//   },
// });

// export const { logout, clearError } = userSlice.actions;
// export default userSlice.reducer;
