// src/lib/app-params.js

export const appParams = {
  appId: "static",
  token: null,
  fromUrl: typeof window !== "undefined" ? window.location.href : "",
  functionsVersion: "static",
  appBaseUrl: "",
}
