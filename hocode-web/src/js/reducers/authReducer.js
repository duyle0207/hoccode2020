import { SET_CURRENT_USER } from "../actions/types";

const isEmpty = require("is-empty");

const initialState = {
  isAuthenticated: false,
  user: {},
  loading: false
};

export default function(state = initialState, action) {
  console.log(state);
  switch (action.type) {
    case SET_CURRENT_USER:
      console.log(action.payload);
      console.log("SET");
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      }; 
    default:
      console.log(state);
      return state;
  }
}
