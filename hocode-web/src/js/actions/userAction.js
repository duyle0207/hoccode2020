import { ADD_CODEPOINT, GET_USER, CHANGE_USER_INFO,CHANGE_LOADING,SET_UNDEFINED_NEXT_MINITASK } from "./types";
import axios from "axios";

export const submitUpdateMinitask = (minitask_id, task_id, course_id, courseStatus) => dispatch => {
  console.log({minitask_id: minitask_id,
    task_id: task_id,
    course_id: course_id,
    course_status: courseStatus})
  axios
    .post(`http://localhost:8081/api/v1/auth/updateusercourse/${course_id}`, {
      minitask_id: minitask_id,
      task_id: task_id,
      course_status: courseStatus
    })
    .then(res => {
      console.log(res.data)
      dispatch({
        type: ADD_CODEPOINT,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};

export const changeUserInfo = (newUser, userId) => dispatch => {
  console.log(newUser);
  dispatch({
    type: CHANGE_LOADING,
    payload: true
  });
  axios
    .post("http://localhost:8081/auth/userinfoupdate", {
      id: userId,
      avatar: newUser.avatar,
      password: newUser.password,
      firstname: newUser.firstName,
      lastname: newUser.lastName,
      
    })
    .then(res => {
      console.log(res.data);
      dispatch({
        type: CHANGE_USER_INFO,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};

export const getUser = () => dispatch => {
  axios
    .get("http://localhost:8081/auth/userinfo")
    .then(res => {
      dispatch({
        type: GET_USER,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};

export const setUndefinedNextMinitask = () => dispatch => {
  dispatch({
    type: SET_UNDEFINED_NEXT_MINITASK,
    payload: undefined
  });
};