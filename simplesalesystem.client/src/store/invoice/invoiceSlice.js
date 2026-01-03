import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchInvoiceFilters: {},
};
const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    setSearchFitlers(state, action) {
      state.searchInvoiceFilters = action.payload;
    },
  },
});
export const { setSearchFitlers } = invoiceSlice.actions;
export default invoiceSlice.reducer;