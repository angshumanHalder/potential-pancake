import { CodeResponse } from "@react-oauth/google";

export const loginRequest: (codeResponse: CodeResponse) => Promise<LoginResponse> = async (codeResponse: CodeResponse) => {
  try {
    const res: LoginResponse = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "applcation/json",
      },
      mode: "cors",
      redirect: "manual",
      body: JSON.stringify({ code: codeResponse.code, scope: codeResponse.scope }),
    }).then((res) => res.json());
    return res;
  } catch (err: any) {
    console.log(err);
    throw Error("Unable to login");
  }
};

export const logoutRequest = async () => {};
