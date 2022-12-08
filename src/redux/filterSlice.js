import { createSlice } from '@reduxjs/toolkit';

export const paramFilterSlice = createSlice({
	name: 'paramfilter',
	initialState: {filterText: ""},
	reducers: {
		setFilterText: (state, action) => {
			state.filterText = action.payload.filterText;
		}
	},
});   

export const { setFilterText } = paramFilterSlice.actions;

export default paramFilterSlice.reducer;