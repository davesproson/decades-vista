import { createSlice } from '@reduxjs/toolkit';

export const serverSlice = createSlice({
	name: 'servers',
	initialState: {
        // servers: [],
        selectedServer: null
    },
	reducers: {
		// setServers: (state, action) => {
        //     state.servers = action.payload.servers;
		// },
        setSelectedServer: (state, action) => {
            state.selectedServer = action.payload.server;
        }
	},
});   

export const { setSelectedServer } = serverSlice.actions;

export default serverSlice.reducer;