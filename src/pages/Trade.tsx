import { Slider } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmationModal from "../components/confirmation-modal/ConfirmationModal";
import LabelledTextField from "../components/LabelledTextField";
import TradingViewWidget from "../components/TradingView";
import { Symbols, type Trade } from "../types";
import { getSymbolPrice } from "../utils/GetSymbolPrice";
import { useWallet } from "@fuels/react";
import { SimpleFutures } from "../swap-api";
import { BN } from "fuels";
import { toast } from "react-toastify";

const BASE_ASSET_ID = "0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07"; 
const marks = [
  {
    value: 1,
    label: "X1",
  },
  {
    value: 2,
    label: "X2",
  },
  {
    value: 5,
    label: "X5",
  },
  {
    value: 10,
    label: "X10",
  },
];

export default function Trade() {
  const { symbol } = useParams();
  const [price, setPrice] = useState<number>(0);

  const [comfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const navigate = useNavigate();
  const { wallet, refetch } = useWallet();


  const _contract = new SimpleFutures(process.env.VITE_TESTNET_CONTRACT_ID!, wallet!);

  // const openPosition = async () => {

  // const ethPrice = await getSymbolPrice("ETHUSD");

  // let isLong = true;
  // if (trade.orderType === "SHORT") {
  //   isLong = false;
  // }
  // const eth_margin = (trade.margin! / ethPrice) * 1000000;

  // _contract.functions.open_position(1, isLong).callParams({
  //   forward: [eth_margin, BASE_ASSET_ID],
  //   gasLimit: new BN(1000000)

  //   }).call();
  // }



  const currentSymbol =
    Object.entries(Symbols)
      .find(([key]) => key === symbol)?.[0]
      .replace("USD", "") || undefined;


  // Get current eth Price
  useEffect(() => {
    getSymbolPrice("ETHUSD").then((val) => {
      setValue("ethPrice", val);
    })
  }, [])


  const form = useForm<Trade>({
    defaultValues: {
      orderType: "LONG",
      contractSize: 1,
      leverage: 1,
      limitPrice: 0,
      symbol: undefined,
      margin: 0,
      ethPrice: 0
    },
  });

  const { register, handleSubmit, setValue, watch } = form;

  const trade = watch();

  useEffect(() => {
    // Initialize WebSocket connection
    const socket = new WebSocket('ws://localhost:8080/ws');

    // Handle connection open event
    socket.onopen = () => {
      console.log('WebSocket connection established.');

      // Subscribe to a specific topic (if required by your backend)
      socket.send(JSON.stringify({
        "type": "subscribe",
        "userAddress": wallet?.address.toString()
      }));
    };

    // Handle incoming messages
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      toast.success("Order Successfully Matched");

      console.log('Message received:', data);
      // setMessage(data.message);  // Assume the message is in `data.message`
    };

    // Handle WebSocket close
    socket.onclose = () => {
      console.log('WebSocket connection closed.');
    };

    // Handle WebSocket errors
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Cleanup on component unmount
    return () => {
      socket.close();
    };
  }, []);



  useEffect(() => {
    const getPrice = async () => {
      const price = await getSymbolPrice(symbol as string);
      console.log(price);
      setPrice(price);
    };
    getPrice();
  }, [symbol]);

  useEffect(() => {
    setValue("symbol", currentSymbol || "");
    setValue("limitPrice", price);
  }, [currentSymbol, price]);

  useEffect(() => {
    setValue("margin", (trade.contractSize * (price / 1000)) / trade.leverage!);
  }, [trade.contractSize, trade.leverage, price]);


  const handleComfimTrade = async () => {


    const ethPrice = await getSymbolPrice("ETHUSD");

    let isLong = true;
    if (trade.orderType === "SHORT") {
      isLong = false;
    }
    const eth_margin = (trade.margin! / ethPrice) * 1000000;

    await _contract.functions.open_position(1, isLong).callParams({
      forward: [eth_margin, BASE_ASSET_ID],
      gasLimit: new BN(1000000)

    }).call();


    const data = {
      "type": trade.orderType === "LONG" ? "buy" : "sell",                     // Type: "buy" or "sell"
      "price": trade.margin!.toFixed(2),                  // Price of the asset
      "amount": trade.contractSize,                     // Amount to buy/sell
      "userAddress": wallet?.address.toString(),   // User's wallet or address
      "contractAddress": "0x123456789"   // Contract or asset address
    }

    const resp = await fetch("http://localhost:3000/order", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(data)
    })

    const jsn = await resp.json();
    console.log(jsn)

    setConfirmationModalOpen(false);
    toast.success("Order Placed")


  }

  return (
    <div className="min-h-screen pt-20 lg:px-4 flex flex-row gap-4 text-white">
      <div className="flex flex-col gap-4 w-full">
        <div className="h-[70vh]">
          <TradingViewWidget key={symbol} symbol={`PYTH:${symbol}`} />{" "}
        </div>
      </div>
      <FormProvider {...form}>
        <div className="w-1/3 bg-[#141414] lg:h-[60vh] shadow-xl">
          <div className="flex flex-row text-white border-b border-gray-700">
            <div
              onClick={() => setValue("orderType", "LONG")}
              className={`w-[6rem] p-4 ${trade.orderType === "LONG" ? "bg-green-400" : ""} cursor-pointer`}
            >
              Long
            </div>
            <hr className=" border-r border-gray-700 h-10 my-auto" />
            <div
              onClick={() => setValue("orderType", "SHORT")}
              className={`w-[6rem] p-4 ${trade.orderType === "SHORT" ? "bg-red-400" : ""} cursor-pointer`}
            >
              Short
            </div>
          </div>

          <div className="flex flex-col p-4 gap-4">
            <div className="flex flex-col">
              <div className="flex flex-col w-full text-white">
                <h1 className="text-[0.9rem] pb-1">Contract Count</h1>
                <input
                  {...register("contractSize")}
                  type="number"
                  className="border border-gray-600 bg-neutral-800 bg-transparent text-white w-full p-2"
                />
              </div>
              <span className="pt-1 ml-auto truncate w-20 text-left">${trade.contractSize * (price / 1000)}</span>
            </div>

            <div className="flex flex-col">
              <h1 className="text-[0.9rem] pb-1">Leverage</h1>
              <Controller
                name="leverage"
                control={form.control}
                render={({ field }) => (
                  <Slider
                    {...field}
                    value={Number(field.value)}
                    sx={{ color: "white", width: "95%", ml: 2 }}
                    defaultValue={1}
                    step={null}
                    marks={marks}
                    min={1}
                    max={10}
                  />
                )}
              />
              <span className="ml-auto">X{trade.leverage}</span>
            </div>
            <LabelledTextField label="Margin" {...register("margin")} disabled />
            <button
              onClick={handleSubmit(() => setConfirmationModalOpen(true))}
              className="w-full glass border py-2 text-white rounded mt-10"
            >

              Submit Order
            </button>
          </div>
        </div>
      </FormProvider>
      <ConfirmationModal
        trade={trade}
        onCancel={() => setConfirmationModalOpen(false)}
        onConfirm={handleComfimTrade}
        open={comfirmationModalOpen}
      />
    </div>
  );
}
