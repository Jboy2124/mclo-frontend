import { configApi } from "../api/configApi";

const documents = configApi.injectEndpoints({
  endpoints: (builder) => ({
    addNewReceivingData: builder.mutation({
      query: (data) => ({
        url: "/api/documents/v1/new-documents",
        method: "POST",
        body: data,
      }),
    }),
    getDocumentList: builder.query({
      query: () => "/api/documents/v1/document-list",
    }),
    getProcessingDocumentList: builder.query({
      query: ({ activePage }) => ({
        url: "/api/documents/v1/processing-documents",
        method: "GET",
        params: { page: activePage },
      }),
    }),
    findDocuments: builder.mutation({
      query: ({ pageNumber, data }) => ({
        url: "/api/documents/v1/documents-results",
        method: "POST",
        body: data,
        params: {
          page: pageNumber,
        },
      }),
    }),
    findProcessingDocuments: builder.mutation({
      query: ({ pageNumber, data }) => ({
        url: "/api/documents/v1/search-processing-documents",
        method: "POST",
        body: data,
        params: {
          page: pageNumber,
        },
      }),
    }),
    getDocumentsCountPerType: builder.mutation({
      query: ({ docId }) => ({
        url: "/api/documents/v1/documents-count",
        method: "POST",
        params: { docId },
      }),
    }),
    addNewProcessingData: builder.mutation({
      query: (data) => ({
        url: "/api/documents/v1/new-processed-documents",
        method: "POST",
        body: data,
      }),
    }),
    findDocumentsByCodeId: builder.query({
      query: ({ code }) => ({
        url: "/api/documents/v1/code-query",
        method: "GET",
        params: { code },
      }),
    }),
    getForReleasingDocuments: builder.query({
      query: ({ activePage, userId }) => ({
        url: "/api/documents/v1/for-releasing-documents",
        method: "GET",
        params: {
          page: activePage,
        },
      }),
    }),
    addNewReleasedDocument: builder.mutation({
      query: (data) => ({
        url: "/api/documents/v1/add-new-released-document",
        method: "POST",
        body: data,
      }),
    }),
    getAssignedDocuments: builder.query({
      query: ({ data, page }) => ({
        url: "/api/documents/v1/assigned-documents",
        method: "GET",
        params: {
          assignee: data,
          page: page,
        },
      }),
      providesTags: ["ASSIGNED_DOCUMENTS"],
    }),
    updateProcessDocumentStatus: builder.mutation({
      query: (data) => ({
        url: "/api/documents/v1/update-process-status",
        method: "POST",
        body: data,
      }),
    }),
    getDocumentTimeline: builder.query({
      query: ({ docId }) => ({
        url: "/api/documents/v1/timeline",
        method: "GET",
        params: { docId },
      }),
      providesTags: ["TIMELINE"],
    }),
    updateReleaseDocument: builder.mutation({
      query: (data) => ({
        url: "/api/documents/v1/update-release-document",
        method: "POST",
        body: data,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddNewReceivingDataMutation,
  useGetDocumentListQuery,
  useGetProcessingDocumentListQuery,
  useFindDocumentsMutation,
  useGetDocumentsCountPerTypeMutation,
  useAddNewProcessingDataMutation,
  useFindProcessingDocumentsMutation,
  useFindDocumentsByCodeIdQuery,
  useGetForReleasingDocumentsQuery,
  useAddNewReleasedDocumentMutation,
  useGetAssignedDocumentsQuery,
  useUpdateProcessDocumentStatusMutation,
  useGetDocumentTimelineQuery,
  useUpdateReleaseDocumentMutation,
} = documents;
