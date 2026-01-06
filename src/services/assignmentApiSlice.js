import { baseQueryApi } from "./baseQueryApiSlice";

export const assignmentApi = baseQueryApi.injectEndpoints({
  endpoints: (builder) => ({
    getAssignments: builder.query({
      query: () => `/assignments`,
      providesTags: ["Assignment"],
    }),

    getAssignmentById: builder.query({
      query: (id) => `/assignments/${id}`,
      providesTags: ["Assignment"],
    }),

    getAssignmentForStudent: builder.query({
      query: (i) => `/assignments/student`,
      providesTags: ["Assignment"],
    }),

    createAssignment: builder.mutation({
      query: (data) => ({
        url: "/assignments",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Assignment"],
    }),

    updateAssignment: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/assignments/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Assignment"],
    }),

    deleteAssignment: builder.mutation({
      query: (id) => ({
        url: `/assignments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Assignment"],
    }),
  }),
});

export const {
  useGetAssignmentsQuery,
  useGetAssignmentByIdQuery,
  useGetAssignmentForStudentQuery,
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,
} = assignmentApi;
