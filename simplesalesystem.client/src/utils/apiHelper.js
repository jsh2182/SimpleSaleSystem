import axios from "axios";

import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const apiMethods = {
  delete: "DELETE",
  get: "GET",
  put: "PUT",
  post: "POST",
};
export const apiModalResultType = {
  info: "info",
  confirm: "confirm",
  warning: "warning",
  error: "error",
};
/**
 *
 * @param {Object} error
 *
 * @returns {string}
 */
export const getErrorMessage = (error) => {
  const message =
    error?.data?.message ||
    error?.data?.Message ||
    error?.statusText ||
    error.message ||
    error?.error ||
    "خطای ناشناخته";
  try {
    if(message?.toLowerCase().contains("failed to fetch"))
    {
      return "اشکال در دریافت اطلاعات از سرور";
    }
    if (Number(error.data?.StatusCode) === 6) {
      localStorage.removeItem("currUser");
      window.location.replace("/");
    }
    const errorObj = JSON.parse(message);
    if (errorObj?.Exception) {
      return errorObj.Exception;
    }
  } catch  {
    return message;
  }
  return message;
};
/**
 * @param {object} headers
 * @param {function} getState
 * @returns {object}
 */
export const prepareHeaders = (headers, getState) => {
  const token = getState().user.currentUser?.token;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
};

export const makeCaseInsensitive =(obj) =>{
  if(!obj)
  {
    return undefined;
  }
  return new Proxy(obj, {
    get(target, prop) {
      if (typeof prop === "string") {
        let key = Object.keys(target).find(k => k.toLowerCase() === prop.toLowerCase());
        if (key !== undefined) return target[key];
      }
      return undefined;
    }
  });
}
/**
 * نسخه ساده برای استفاده مستقل فقط با callback
 * @param {'get'|'post'|'put'|'delete'} method
 * @param {string} url
 * @param {object} data - برای get: query / برای post: body
 * @param {function} [onSuccess] - کال‌بک موفقیت
 * @param {function} [onError] - کال‌بک خطا
 * @param {AbortSignal} [signal] - سیگنال لغو درخواست (اختیاری)
 */
export async function callApiSimple(
  method,
  url,
  data,
  onSuccess,
  onError,
  signal
) {
  try {
    const currUser = JSON.parse(localStorage.getItem("currUser"));
    const token = currUser?.token;

    const config = {
      method: method?.toLowerCase?.() || "get",
      url,
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      signal,
    };

    if (data) {
      if (config.method === "get") {
        config.params = data;
      } else {
        config.data = data;
      }
    }

    const res = await axios(config);

    if (!res.data.isSuccess) {
      onError?.(res.data.message || "خطای منطقی از سرور");
      return;
    }

    onSuccess?.(res.data);
    return res.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      const message = getErrorMessage(error);
      onError?.(message);
      return;
    }
    const message = getErrorMessage(error);
    onError?.(message);
  }
}


export const createRawBaseQuery = (baseUrl) =>
  fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
       const token = getState().user.currentUser?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });
  export const createBaseQuery = (baseUrl) => {
  const rawBaseQuery = createRawBaseQuery(baseUrl);

  return async (args, api, extraOptions) => {
    const result = await rawBaseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
      localStorage.removeItem("currUser");
      window.location.replace("/login");
    }

    return result;
  };
};




