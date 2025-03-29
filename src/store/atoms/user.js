import {atom} from "recoil";

export const userStates = atom({
  key: 'userState',
  default: {
    isLoading: true,
    userEmail: null
  },
});
