import axios from "axios";

const {
  VITE_MEMBER_API_URL,
  VITE_NOTICE_API_URL,
  VITE_SUBLEASE_API_URL,
  VITE_SUBLEASE_DEAL_API_URL,
  VITE_CHATS_API_URL,
  VITE_BASKET_API_URL,
} = import.meta.env;

function createAxiosInstance(baseUrl, credentials) {
  const instance = axios.create({
    baseURL: baseUrl,
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    withCredentials: credentials,
  });

  // 요청 인터셉터 추가
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Authorization 헤더 추가
    }
    return config;
  });

  return instance;
}

function subleaseAxios() {
  return createAxiosInstance(VITE_SUBLEASE_API_URL, true);
}

function subleaseDealAxios() {
  return createAxiosInstance(VITE_SUBLEASE_DEAL_API_URL, true);
}

function memberAxios() {
  return createAxiosInstance(VITE_MEMBER_API_URL, true);
}

function noticeAxios() {
  return createAxiosInstance(VITE_NOTICE_API_URL, true);
}

function chatsAxios() {
  return createAxiosInstance(VITE_CHATS_API_URL, true);
}

function basketAxios() {
  return createAxiosInstance(VITE_BASKET_API_URL);
}
export {
  memberAxios,
  noticeAxios,
  subleaseAxios,
  chatsAxios,
  basketAxios,
  subleaseDealAxios,
};
