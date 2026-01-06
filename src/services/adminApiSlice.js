import { baseQueryApi } from "./baseQueryApiSlice";

export const adminApiSlice = baseQueryApi.injectEndpoints({
  endpoints: (builder) => ({
    getTeachers: builder.query({
      query: ({ page = 1, limit = 10 } = {}) =>
        `admin/teachers?page=${page}&limit=${limit}`,
      providesTags: ["Teacher"],
    }),

    createTeacher: builder.mutation({
      query: (teacherData) => ({
        url: "admin/teachers",
        method: "POST",
        body: teacherData,
      }),
      invalidatesTags: ["Teacher"],
    }),

    getTeacherById: builder.query({
      query: (id) => `admin/teachers/${id}`,
      providesTags: ["Teacher"],
    }),

    updateTeacher: builder.mutation({
      query: ({ id, ...teacherData }) => ({
        url: `admin/teachers/${id}`,
        method: "PUT",
        body: teacherData,
      }),
      invalidatesTags: ["Teacher"],
    }),

    deleteTeacher: builder.mutation({
      query: (id) => ({
        url: `admin/teachers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Teacher"],
    }),

    getAdminStats: builder.query({
      query: () => "admin/stats",
      providesTags: ["Stats"],
    }),
  }),
});

export const {
  useGetTeachersQuery,
  useCreateTeacherMutation,
  useGetTeacherByIdQuery,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
  useGetAdminStatsQuery,
} = adminApiSlice;
