import { Link, useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen">
      <div className="px-5 pt-20">
        <div className="relative flex flex-col justify-center items-center h-[85vh] w-full overflow-clip rounded-[40px]">
          <div className="absolute top-0 bottom-0 left-[60vw] right-0 bg-gradient-to-bl from-[#97a9ab] via-transparent to-transparent opacity-70 h-full" />
          <div className="absolute top-[20vh] bottom-0 left-0 right-0 bg-gradient-to-tr from-[#97a9ab] via-transparent to-transparent opacity-70 h-full" />
          <Link
            to="/trade/BTCUSD"
            className="absolute top-[10vh] left-0 gap-2 text-xl opacity-40 hover:opacity-100 transition-all"
          >
            <img src="/line4.png" alt="" className="w-80 h-20 object-contain" />
            <div className="inline-flex mt-5 ml-10 gap-2 text-base">
              &#8226;
              <div className="">
                <p>Bitcoin</p>
                <p>61,999</p>
              </div>
            </div>
          </Link>
          <Link
            to="/trade/BTCUSD"
            className="absolute top-[10vh] right-0 gap-2 text-xl opacity-40 hover:opacity-100 transition-all"
          >
            <img src="/line3.png" alt="" className="w-80 h-20 object-contain" />
            <div className="inline-flex mt-5 ml-44 gap-2 text-base">
              &#8226;
              <div className="">
                <p>Ethereum</p>
                <p>61,999</p>
              </div>
            </div>
          </Link>
          <Link
            to="/trade/BTCUSD"
            className="absolute bottom-[10vh] left-0 gap-2 text-xl opacity-40 hover:opacity-100 transition-all"
          >
            <div className="inline-flex mb-5 ml-10 gap-2 text-base">
              &#8226;
              <div className="">
                <p>Solana</p>
                <p>61,999</p>
              </div>
            </div>
            <img src="/line1.png" alt="" className="w-80 h-20 object-contain" />
          </Link>
          <Link
            to="/trade/BTCUSD"
            className="absolute bottom-[10vh] right-0 gap-2 text-xl opacity-40 hover:opacity-100 transition-all"
          >
            <div className="inline-flex mb-5 ml-44 gap-2 text-base">
              &#8226;
              <div className="">
                <p>Bitcoin</p>
                <p>61,999</p>
              </div>
            </div>
            <img src="/line2.png" alt="" className="w-80 h-20 object-contain" />
          </Link>
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-6xl font-semibold">Unleash Your Trading Potential</h1>
            <p>Fast, secure, and decentralized trading at your fingertips.</p>
            <button
              onClick={() => {
                navigate("/trade/BTCUSD");
              }}
              className="mt-5 w-fit glass border rounded-full font-bold text-lg py-2 px-6 hover:scale-105 transition-all"
            >
              Trade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
