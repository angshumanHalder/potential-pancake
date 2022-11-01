import { CodeResponse } from "@react-oauth/google";

export const loginRequest: (codeResponse: CodeResponse) => Promise<LoginResponse> = async (
  codeResponse: CodeResponse
) => {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "applcation/json",
    },
    mode: "cors",
    redirect: "manual",
    body: JSON.stringify({ code: codeResponse.code, scope: codeResponse.scope }),
  });
  const data: LoginResponse = await res.json();
  if (res.ok) {
    return data;
  }
  throw Error("Unable to login");
};

export const logoutRequest = async () => {
  await fetch("/api/logout", {
    method: "GET",
    headers: {
      "Content-Type": "applcation/json",
      Authorization: `Bearer ${localStorage.getItem("potential_token")}`,
    },
    mode: "cors",
  });
};
