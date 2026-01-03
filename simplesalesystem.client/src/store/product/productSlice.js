import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchProductsFilters: {},
};
const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setSearchFitlers(state, action) {
      state.searchProductsFilters = action.payload;
    },
  },
});
export const { setSearchFitlers } = productSlice.actions;
export default productSlice.reducer;