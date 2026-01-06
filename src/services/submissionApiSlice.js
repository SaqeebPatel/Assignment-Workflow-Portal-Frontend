import { baseQueryApi } from "./baseQueryApiSlice";

export const submissionApi = baseQueryApi.injectEndpoints({
  endpoints: (builder) => ({
    submitAssignment: builder.mutation({
      query: ({ assignmentId, answers }) => ({
        url: "/submissions",
        method: "POST",
        body: { assignmentId, answers },
      }),
      invalidatesTags: ["Assignment", "Submission"],
    }),

    getMySubmissionResultsStudent: builder.query({
      query: () => `/submissions/my/submissions`,
      providesTags: ["Submission"],
    }),

    getAssignmentSubmissions: builder.query({
      query: () => `/submissions`,
      providesTags: ["Submission"],
    }),

    reviewSubmission: builder.mutation({
      query: ({ submissionId, marksObtained, teacherNote, reviewed }) => ({
        url: `/submissions/${submissionId}/review`,
        method: "PATCH",
        body: { marksObtained, teacherNote, reviewed },
      }),
      invalidatesTags: ["Submission"],
    }),

    getSubmissionHistory: builder.query({
      query: (studentId = "") =>
        studentId
          ? `/submissions/history/${studentId}`
          : `/submissions/history`,
      providesTags: ["Submission"],
    }),
  }),
});

export const {
  useSubmitAssignmentMutation,
  useReviewSubmissionMutation,
  useGetMySubmissionResultsStudentQuery,
  useGetAssignmentSubmissionsQuery,
  useGetSubmissionHistoryQuery,
} = submissionApi;
