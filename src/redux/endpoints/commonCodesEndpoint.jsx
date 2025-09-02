import { configApi } from "../api/configApi";

const commonCodeListEndpoints = configApi.injectEndpoints({
  endpoints: (builder) => ({
    getTitles: builder.query({
      query: () => "/api/common-codes/v1/titles",
      providesTags: ["TITLES"],
    }),
    getDesignation: builder.query({
      query: () => "/api/common-codes/v1/designations",
      providesTags: ["DESIGNATIONS"],
    }),
    getNatureOfCommunication: builder.query({
      query: () => "/api/common-codes/v1/nature-of-communications",
      providesTags: ["NATUREOFCOMMUNICATIONS"],
    }),
    getReceivedThru: builder.query({
      query: () => "/api/common-codes/v1/received-through",
      providesTags: ["RECEIVEDTHROUGH"],
    }),
    getDocumentType: builder.query({
      query: () => ({
        url: "/api/common-codes/v1/document-type",
        method: "GET",
      }),
      providesTags: ["DOCUMENTTYPES"],
    }),
    getAccessLevel: builder.query({
      query: () => ({
        url: "/api/common-codes/v1/access-level",
        method: "GET",
      }),
      providesTags: ["ACCESSLEVEL"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetTitlesQuery,
  useGetDesignationQuery,
  useGetNatureOfCommunicationQuery,
  useGetReceivedThruQuery,
  useGetDocumentTypeQuery,
  useGetAccessLevelQuery,
} = commonCodeListEndpoints;
