import { configApi } from "../api/configApi";

const users = configApi.injectEndpoints({
  endpoints: (builder) => ({
    getActiveUserList: builder.query({
      query: ({ status }) => ({
        url: "/api/users/v1/users",
        params: { status },
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useGetActiveUserListQuery } = users;
