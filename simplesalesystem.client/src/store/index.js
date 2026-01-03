// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import { userApi } from "./user/userAPI";
import { locationsApi } from "./location/locationsApi";
import { companyApi } from "./company/companyAPI";
import { productApi } from "./product/productApi";
import productReducer from "./product/productSlice";
import { personApi } from "./person/personApi";
import personReducer from "./person/personSlice";
import { invoiceApi } from "./invoice/invoiceApi";
import invoiceReducer from "./invoice/invoiceSlice";
import { invoiceDefaultDescsApi } from "./invoiceDefaultDesc/invoiceDefaultDescApi";
import { systemSettingApi } from "./systemSetting/settingApi";

const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
    person: personReducer,
    invoice: invoiceReducer,
    [userApi.reducerPath]: userApi.reducer,
    [companyApi.reducerPath]: companyApi.reducer,
    [locationsApi.reducerPath]: locationsApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [personApi.reducerPath]: personApi.reducer,
    [invoiceApi.reducerPath]: invoiceApi.reducer,
    [invoiceDefaultDescsApi.reducerPath]: invoiceDefaultDescsApi.reducer,
    [systemSettingApi.reducerPath]:systemSettingApi.reducer
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApi.middleware)
      .concat(companyApi.middleware)
      .concat(locationsApi.middleware)
      .concat(productApi.middleware)
      .concat(personApi.middleware)
      .concat(invoiceApi.middleware)
      .concat(invoiceDefaultDescsApi.middleware)  
      .concat(systemSettingApi.middleware)    
});
export default store;