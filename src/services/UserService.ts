import axios from "axios";

export class UserService {
  async postLogIn(userInfo: any) {
    let response = await axios.post<any>(
      "http://localhost:3005/users/login",

      userInfo,

      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  }

  async postNewUser(newUserInfo: any) {
    let response = await axios.post(
      "http://localhost:3005/users/newuser/",

      newUserInfo,

      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  }
}
