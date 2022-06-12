import { Outlet } from "react-router-dom";
import "./Layout.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export function Layout() {
  const navigation = useNavigate();
  const [booleanLogOutButton, setBooleanLogOutButton] = useState(true);

  // useEffect(() => {
  //   console.log(localStorage.getItem("userId"));
  //   if (localStorage.getItem("userId") === null) {
  //     console.log("är jag här?");
  //     setBooleanLogOutButton(false);
  //   } else if (localStorage.getItem("userId") === Number.toString()) {
  //     console.log("HÄR");
  //     setBooleanLogOutButton(true);
  //   }
  // }, []);

  return (
    <>
      <div className='containerPage'>
        <header className='header'></header>
        <main className='main'>
          <Outlet></Outlet>
        </main>
        <footer className='footer'>Copyright 2022</footer>
      </div>
    </>
  );
}
