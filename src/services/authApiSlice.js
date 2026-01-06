import { baseQueryApi } from "./baseQueryApiSlice";

export const authApi = baseQueryApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),

    registration: builder.mutation({
      query: (credentials) => ({
        url: "/auth/registration",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const { useLoginMutation, useRegistrationMutation } = authApi;
