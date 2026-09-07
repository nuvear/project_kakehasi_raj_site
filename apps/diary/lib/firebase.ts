import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import config from "./firebase-config.json";
export const auth = () =>
  getAuth(getApps().length ? getApp() : initializeApp(config));
