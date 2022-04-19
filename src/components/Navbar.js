import { db, auth } from "./utils/firebase";
import logo from "../img/logo.png";

function Navbar() {
  return (
    <nav>
      <div>
        <a href="#" className="logo">
          <img src={logo} alt="logo" style={{ width: "100px" }} />
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
