import { useAccount, useConnectUI, useDisconnect, useIsConnected } from "@fuels/react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { Symbols } from "../types";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { connect } = useConnectUI();
  const { disconnect } = useDisconnect();
  const { isConnected, refetch } = useIsConnected();
  const { account } = useAccount();

  const navigate = useNavigate();

  const [user, setUser] = useState({
    loggedIn: false,
    addr: "",
  });

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    console.log(account);
  });

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className={`flex flex-row py-3 px-4 gap-5 items-center glass text-white font-semibold`}>
        <Link to="/" className="flex flex-row gap-1 text-xl items-center">
          <div className="relative w-10 h-10">
            <img src="/logo_white.png" alt="logo" />
          </div>
          Velocity
        </Link>
        <div className="ml-auto hidden lg:flex flex-row items-center text gap-10 text-white">
          <Menu>
            <MenuButton>
              Derivatives
              <KeyboardArrowDownIcon />
            </MenuButton>

            <MenuItems
              transition
              anchor="bottom end"
              className={`z-[100] w-[14rem] origin-top-right rounded mt-2 border p-1 text transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 bg-[#FFFFFF4D] text-white border-white shadow-white/10 hover:bg-[#FFFFFF26] `}
            >
              {Object.keys(Symbols).map((key) => (
                <MenuItem>
                  <button
                    onClick={() => navigate(`/trade/${key}`)}
                    className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3"
                  >
                    {key.replace("USD", "")} FUT
                  </button>
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
          <Link to="https://github.com/HackArchive/velocity-finance" target="_blank">
            Documentation
          </Link>
          <Link to="#features">Features</Link>
          <Link to="/whitepaper">Whitepaper</Link>
        </div>
        <div className="hidden lg:block">
          {!isConnected ? (
            <button
              onClick={() => connect()}
              className={`w-[15rem] items-center gap-2 rounded-md py-2 px-3 text-sm/6 font-semibold border-[1.5px] glass border-white
             `}
            >
              Connect Wallet
            </button>
          ) : (
            <div>
              <Menu>
                <MenuButton
                  className={` truncate w-[15rem] items-center gap-2 rounded-md py-2 px-3 text-sm/6 font-semibold  border-[1px] glass border-white justify-center`}
                >
                  <CgProfile className="w-5 h-5 inline-block mr-2" />
                  {account}
                </MenuButton>

                <MenuItems
                  transition
                  anchor="bottom end"
                  className={`z-[100] w-[14rem] origin-top-right rounded mt-2 border p-1 text transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 bg-[#FFFFFF4D] text-white border-white shadow-white/10 hover:bg-[#FFFFFF26] `}
                >
                  <MenuItem>
                    <Link to="/profile">
                      <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3">Profile</button>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <button
                      onClick={() => disconnect()}
                      className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3"
                    >
                      Disconnect Wallet
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          )}
        </div>
        <div className="lg:hidden">
          <button onClick={handleMenuToggle} className="text-2xl">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className={`lg:hidden flex flex-col items-center text-black py-4 font-bold`}>
          <Link to="https://github.com/HackArchive/velocity-finance" target="_blank" className="py-2">
            Github
          </Link>
          <Link to="https://github.com/HackArchive/velocity-finance" target="_blank" className="py-2">
            Documentation
          </Link>
          <Link to="#features" className="py-2">
            Features
          </Link>
          <Link to="/" className="py-2">
            Whitepaper
          </Link>
          <Link
            to=""
            target="_blank"
            className="bg-white shadow-md hover:bg-gray-200 transition-all shadow-white text-black text-center rounded-xl px-10 py-2 text-lg mt-4 w-3/4"
          >
            Connect Wallet
          </Link>
        </div>
      )}
    </div>
  );
}
