import { Link } from "react-router";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="text-2xl font-bold text-gradient">
        <p >AI resume</p>
      </Link>
      <Link to="/upload" className="primary-button w-fit">
        <p >upload resume</p>
      </Link>
    </nav>
  );
};

export default Navbar;
