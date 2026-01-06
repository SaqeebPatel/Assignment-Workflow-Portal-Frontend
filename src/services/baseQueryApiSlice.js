import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASEURL } from "../constants/app.constant";

const baseQuery = fetchBaseQuery({
  baseUrl: BASEURL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token; 
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryApi = createApi({
  reducerPath: "baseQueryApi",
  baseQuery,
  tagTypes: ["Auth", "Assignment", "Submission"],
  endpoints: () => ({}), 
});
