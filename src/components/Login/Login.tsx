import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostsService } from "../../services/PostsService";
import { UserService } from "../../services/UserService";
import "./login.css";

interface IUser {
  userName: string;
  password: string;
}
export function Login() {
  const [openLoginCard, setOpenLoginCard] = useState(true);
  const [openNewUserTag, setOpenNewUserTag] = useState<boolean>(false);
  const [newUserValues, setNewUserValues] = useState<IUser>({
    userName: "",
    password: "",
  });
  const [logInValues, setLogInValues] = useState<IUser>({
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

  //inputvärden från ny-användare-fält
  function handleInputChangeNewUser(e: ChangeEvent<HTMLInputElement>) {
    setNewUserValues({ ...newUserValues, [e.target.name]: e.target.value });
  }

  //skapa ny användare funktion
  function submitNewUser() {
    let service = new UserService();
    service.postNewUser(newUserValues).then((response) => {
      if (response.message === "Ny användare skapad") {
        alert("Ny användare är skapad, var vänlig logga in");
        setOpenNewUserTag(false);
        setOpenLoginCard(true);
        return;
      } else if (
        response.message === "Användare finns redan, välj annat namn"
      ) {
        alert("Användarnamn finns redan, prova med ett annat");
        return;
      } else if (
        response.message === "Användarnamn och password får inte vara tomma"
      ) {
        alert("Användarnamn och lösenord krävs");
        return;
      }
    });

    setNewUserValues({
      userName: "",
      password: "",
    });
  }

  //Toggla ny användare fönster
  function openNewUser() {
    if (openNewUserTag === true) {
      setOpenNewUserTag(false);
    } else {
      setOpenNewUserTag(true);
    }
  }

  return (
    <>
      {openLoginCard ? (
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
          {/* {openNewUserTag ? ( */}
          <p>
            Skapa ny användare &nbsp;
            <span
              className='openNewUser'
              onClick={() => {
                setOpenLoginCard(false);
                openNewUser();
              }}
            >
              här
            </span>
          </p>
          {/* )} */}
        </div>
      ) : (
        <></>
      )}

      {openNewUserTag ? (
        <div className='containerNewUser'>
          <h2 className='headingLogin'>Skapa ny användare: </h2>
          <form className='formNewUser'>
            <input
              type='text'
              placeholder='Användarnamn'
              id='userNewUser'
              name='userName'
              value={newUserValues.userName}
              onChange={handleInputChangeNewUser}
            />

            <input
              type='password'
              placeholder='Lösenord '
              id='passwordNewUser'
              name='password'
              value={newUserValues.password}
              onChange={handleInputChangeNewUser}
            />
            <button
              type='submit'
              className='submitButtonNewUser'
              onClick={(e) => {
                e.preventDefault();
                submitNewUser();
              }}
            >
              Skapa ny användare
            </button>
          </form>
          <p>
            Stäng skapa ny användare &nbsp;{" "}
            <span
              className='openNewUser'
              onClick={() => {
                setOpenLoginCard(true);

                openNewUser();
              }}
            >
              här
            </span>
          </p>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
