import { Outlet } from "react-router-dom";
import "./Layout.css";

export function Layout() {
  return (
    <>
      <div className="containerPage">
        <header className="header">HEADER</header>
        <main className="main">
          <Outlet></Outlet>
        </main>
        <footer className="footer">FOOTER</footer>
      </div>
    </>
  );
}
