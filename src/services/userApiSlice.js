import { baseQueryApi } from "./baseQueryApiSlice";

export const userApiSlice = baseQueryApi.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (userData) => ({
        url: "users",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    getUsers: builder.query({
      query: ({ page = 1, limit = 10 } = {}) =>
        `users?page=${page}&limit=${limit}`,
      providesTags: ["User"],
    }),

    getUserById: builder.query({
      query: (id) => `users/${id}`,
      providesTags: ["User"],
    }),

    updateUser: builder.mutation({
      query: ({ id, ...userData }) => ({
        url: `users/${id}`,
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApiSlice;
