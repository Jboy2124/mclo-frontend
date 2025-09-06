import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  timeline: {
    timelineId: null,
    docId: null,
    status: "",
    dateUpdated: "",
  },
};

export const processTimelineSlice = createSlice({
  name: "timeline",
  initialState,
  reducers: {
    setDocumentTimeline: (state, action) => {
      state.timeline = action.payload;
    },
  },
});

export const { setDocumentTimeline } = processTimelineSlice.actions;
export default processTimelineSlice.reducer;
