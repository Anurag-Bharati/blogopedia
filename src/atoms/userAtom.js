import { atom } from "recoil";

export const userState = atom({
  key: "userState", // atom identifier
  default: null, // initial value
});
