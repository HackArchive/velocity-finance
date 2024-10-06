import AddchartTwoToneIcon from "@mui/icons-material/AddchartTwoTone";
import AlignVerticalBottomTwoToneIcon from "@mui/icons-material/AlignVerticalBottomTwoTone";
import CurrencyBitcoinTwoToneIcon from "@mui/icons-material/CurrencyBitcoinTwoTone";
import SecurityTwoToneIcon from "@mui/icons-material/SecurityTwoTone";
import ShowChartTwoToneIcon from "@mui/icons-material/ShowChartTwoTone";
import SyncAltTwoToneIcon from "@mui/icons-material/SyncAltTwoTone";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSymbolPrice } from "../utils/GetSymbolPrice";
const features: { icon: JSX.Element; title: string; description: string }[] = [
  {
    icon: <ShowChartTwoToneIcon sx={{ fontSize: "40px", my: 1 }} />,
    title: "Perpetual Contracts",
    description:
      "Trade Without Expiration - Engage in perpetual futures trading with no expiration dates, allowing you to hold positions as long as you want. Take advantage of market volatility without the pressure of contract expiration.",
  },
  {
    icon: <CurrencyBitcoinTwoToneIcon sx={{ fontSize: "40px", my: 1 }} />,
    title: "Multiple Cryptocurrencies Supported",
    description:
      "Diverse Market Access - Trade a variety of cryptocurrencies with ease. Velocity Finance supports multiple tokens, giving you the flexibility to diversify your trading portfolio and capitalize on opportunities across different assets.",
  },
  {
    icon: <AlignVerticalBottomTwoToneIcon sx={{ fontSize: "40px", my: 1 }} />,
    title: "Customizable Leverage",
    description:
      "Amplify Your Returns - Choose the leverage that fits your trading strategy, ranging from low to high risk. Increase your exposure to the market and unlock greater potential for profits with tailored leverage options.",
  },
  {
    icon: <SyncAltTwoToneIcon sx={{ fontSize: "40px", my: 1 }} />,
    title: "Low Transaction Fees",
    description:
      "Keep More of Your Profits - Velocity Finance offers some of the lowest fees in the market, allowing traders to keep more of what they earn. Enjoy competitive rates with no hidden costs or surprises.",
  },
  {
    icon: <AddchartTwoToneIcon sx={{ fontSize: "40px", my: 1 }} />,
    title: "Advanced Trading Tools",
    description:
      "Trade Like a Pro - Access real-time charts, order book data, and market insights to make informed decisions. Use advanced order types like limit, stop-loss, and market orders to execute your strategy with precision.",
  },
  {
    icon: <SecurityTwoToneIcon sx={{ fontSize: "40px", my: 1 }} />,
    title: "Secure and Open Source",
    description:
      "Open Source Security - Velocity Finance's code is fully open source, allowing anyone to review it, ensuring transparency and security for your funds and trades.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [bitcoin, useBitcoin] = useState(0);
  const [eth, useEth] = useState(0);
  const [solana, useSolana] = useState(0);

  const getPrices = async () => {
    let ethP = await getSymbolPrice("ETHUSD");
    let btcP = await getSymbolPrice("BTCUSD");
    let solP = await getSymbolPrice("SOLUSD");

    useBitcoin(Math.round(btcP * 100) / 100);
    useEth(Math.round(ethP * 100) / 100);
    useSolana(Math.round(solP * 100) / 100);
  };

  useEffect(() => {
    getPrices();
    const intervalId = setInterval(getPrices, 1000);
    return () => clearInterval(intervalId);
  }, []);

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
                <p>{bitcoin}</p>
              </div>
            </div>
          </Link>
          <Link
            to="/trade/ETHUSD"
            className="absolute top-[10vh] right-0 gap-2 text-xl opacity-40 hover:opacity-100 transition-all"
          >
            <img src="/line3.png" alt="" className="w-80 h-20 object-contain" />
            <div className="inline-flex mt-5 ml-44 gap-2 text-base">
              &#8226;
              <div className="">
                <p>Ethereum</p>
                <p>{eth}</p>
              </div>
            </div>
          </Link>
          <Link
            to="/trade/SOLUSD"
            className="absolute bottom-[10vh] left-0 gap-2 text-xl opacity-40 hover:opacity-100 transition-all"
          >
            <div className="inline-flex mb-5 ml-10 gap-2 text-base">
              &#8226;
              <div className="">
                <p>Solana</p>
                <p>{solana}</p>
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
                <p>{bitcoin}</p>
              </div>
            </div>
            <img src="/line2.png" alt="" className="w-80 h-20 object-contain" />
          </Link>
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-6xl font-semibold">Unleash Your Trading Potential</h1>
            <p>Fast, secure, and decentralized trading at your fingertips.</p>
            <button
              onClick={() => {
                navigate("/trade/ETHUSD");
              }}
              className="mt-5 w-fit glass border rounded-full font-bold text-lg py-2 px-6 hover:scale-105 transition-all"
            >
              Trade Now
            </button>
          </div>
        </div>
      </div>
      <div
        className="py-10 px-60 w-full h-full"
        style={{
          backgroundColor: "#141414",
          backgroundImage: `
          radial-gradient(circle at 78% 27%, #97a9ab42 10%, transparent 30.05%),
          radial-gradient(circle at 14% 60%, #b8cfbd25 5%, transparent 20.05%)
        `,
        }}
      >
        <div className="flex flex-row w-full justify-between items-center">
          <h1 className="text-4xl leading-snug w-1/2">
            Leverage Your Gains,
            <br /> Maximize Your <span className="text-green-400">Returns</span>
          </h1>
          <p className="w-1/2">
            At Velocity Finance, unlock the power of leverage to amplify your profits. Our platform lets you trade with
            precision, maximizing your returns on every move while managing risk effectively. Trade smarter and reach
            new profit heights.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-10 ">
          {features.map((feature) => (
            <div className="glass p-4 flex flex-col gap-4 rounded-xl">
              <div>{feature.icon}</div>
              <h2 className="text-lg font-semibold">{feature.title}</h2>
              <p className="text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
