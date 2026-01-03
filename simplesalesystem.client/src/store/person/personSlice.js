import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchPersonFilters: {},
};
const personSlice = createSlice({
  name: "person",
  initialState,
  reducers: {
    setSearchFitlers(state, action) {
      state.searchPersonFilters = action.payload;
    },
  },
});
export const { setSearchFitlers } = personSlice.actions;
export default personSlice.reducer;