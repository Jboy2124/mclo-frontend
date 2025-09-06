import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { StatusCodes } from "http-status-codes";
import { logoutUser } from "../reducer/authReducer";

const baseQuery = fetchBaseQuery({
  // baseUrl: "http://192.168.1.14:8080",
  baseUrl: "http://localhost:8080",
  credentials: "include",
});

export const baseQueryWithReAuth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === StatusCodes.FORBIDDEN) {
    const refreshResult = await baseQuery(
      {
        url: "/api/auth/v1/refresh-token",
        method: "POST",
      },
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      result = await baseQuery(args, api, extraOptions);
    } else {
      await baseQuery(
        {
          url: "/api/auth/v1/logout",
          method: "POST",
        },
        api,
        extraOptions
      );
      api.dispatch(logoutUser());
      localStorage.removeItem("persist:root");
    }
  }

  return result;
};
