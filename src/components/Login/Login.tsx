import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostsService } from "../../services/PostsService";
import { UserService } from "../../services/UserService";
import "./login.css";

interface ILoginValues {
  userName: string;
  password: string;
}
export function Login() {
  const [logInValues, setLogInValues] = useState<ILoginValues>({
    userName: "",
    password: "",
  });
  const navigation = useNavigate();
  function handleInputChangeLogin(e: ChangeEvent<HTMLInputElement>) {
    setLogInValues({ ...logInValues, [e.target.name]: e.target.value });
  }
  function submitLogIn() {
    let service = new UserService();
    service.postLogIn(logInValues).then((response) => {
      console.log(response);
      if (response.message === "error") {
        alert("Användare finns inte, försök gärna igen!");
      } else {
        localStorage.setItem("userId", response[0].userId);
        navigation("/main");
      }
    });
    setLogInValues({
      userName: "",
      password: "",
    });
  }
  return (
    <>
      <div className='containerLogin'>
        <h2 className='headingLogin'>Var vänlig logga in nedan:</h2>
        <form className='formLogin'>
          <div className='containerInput'>
            <input
              type='text'
              placeholder='Användarnamn'
              id='userLogin'
              name='userName'
              value={logInValues.userName}
              onChange={handleInputChangeLogin}
            />
            <input
              type='password'
              placeholder='Lösenord '
              id='passwordLogin'
              name='password'
              value={logInValues.password}
              onChange={handleInputChangeLogin}
            />
          </div>
          <div className='containerButton'>
            <button
              type='submit'
              className='submitButtonLogin'
              onClick={(e) => {
                e.preventDefault();
                submitLogIn();
              }}
            >
              Logga in
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
