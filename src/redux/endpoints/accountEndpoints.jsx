import { configApi } from "../api/configApi";

const accounts = configApi.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (data) => ({
        url: "/api/account/v1/register",
        method: "POST",
        body: data,
      }),
    }),
    validateEmail: builder.mutation({
      query: (data) => ({
        url: "/api/account/v1/verify-email",
        method: "POST",
        body: data,
      }),
    }),
    loginAccount: builder.mutation({
      query: (data) => ({
        url: "/api/account/v1/login",
        method: "POST",
        body: data,
      }),
    }),
    logoutAccount: builder.mutation({
      query: () => ({
        url: "/api/auth/v1/logout",
        method: "POST",
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useRegisterUserMutation,
  useValidateEmailMutation,
  useLoginAccountMutation,
  useLogoutAccountMutation,
} = accounts;
