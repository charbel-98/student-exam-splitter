import logo from "../assets/images/antonine-logo.png";

function Nav() {
  return (
    <div className="bg-primary text-white justify-between flex h-32 px-10 py-4">
      <img src={logo} alt="" />
      <button className="font-roboto font-semibold text-xl">Sign out</button>
    </div>
  );
}
export default Nav;
