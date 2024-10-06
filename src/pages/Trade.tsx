import { useAccount, useWallet } from "@fuels/react";
import { Slider } from "@mui/material";
import { BN } from "fuels";
import { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmationModal from "../components/confirmation-modal/ConfirmationModal";
import LabelledTextField from "../components/LabelledTextField";
import TradingViewWidget from "../components/TradingView";
import { SimpleFutures } from "../swap-api";
import { Symbols, type Trade } from "../types";
import { getSymbolPrice } from "../utils/GetSymbolPrice";
import { trades } from "../utils/TradeModel";

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
  const { wallet, refetch } = useWallet();
  const { account } = useAccount();

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
    });
  }, []);

  const form = useForm<Trade>({
    defaultValues: {
      orderType: "LONG",
      contractSize: 1,
      leverage: 1,
      limitPrice: 0,
      symbol: undefined,
      margin: 0,
      ethPrice: 0,
    },
  });

  const { register, handleSubmit, setValue, watch } = form;

  const trade = watch();

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080/ws");

    socket.onopen = () => {
      console.log("WebSocket connection established.");

      socket.send(
        JSON.stringify({
          type: "subscribe",
          userAddress: wallet?.address.toString(),
        })
      );
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      toast.success("Order Successfully Matched");

      console.log("Message received:", data);
      // setMessage(data.message);  // Assume the message is in `data.message`
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

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

    await _contract.functions
      .open_position(1, isLong)
      .callParams({
        forward: [eth_margin, BASE_ASSET_ID],
        gasLimit: new BN(1000000),
      })
      .call();

    const data = {
      type: trade.orderType === "LONG" ? "buy" : "sell", // Type: "buy" or "sell"
      price: trade.margin!.toFixed(2), // Price of the asset
      amount: trade.contractSize, // Amount to buy/sell
      userAddress: wallet?.address.toString(), // User's wallet or address
      contractAddress: "0x123456789", // Contract or asset address
    };

    const resp = await fetch("http://localhost:3000/order", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const jsn = await resp.json();
    console.log(jsn);

    setConfirmationModalOpen(false);
    toast.success("Order Placed");
  };

  return (
    <div className="min-h-screen py-20 lg:px-4  text-white">
      <div className="flex flex-row gap-4">
        <div className="flex flex-col gap-4 w-full">
          <div className="h-[70vh]">
            <TradingViewWidget key={symbol} symbol={`PYTH:${symbol}`} />{" "}
          </div>
          <div className="p-5 border-[0.5px] border-[#393939] h-[35vh]">
            <h1>Postions</h1>
            <hr className="border w-full border-[#393939] my-2" />
            <div className="flex flex-col h-full gap-1">
              <div className="justify-between flex flex-row font-semibold mb-2">
                <h1>Symbol</h1>
                <h2>Price</h2>
                <div>Order Type</div>
              </div>
              {trades
                .filter((item) => item.symbol === symbol && item.address === account)
                .slice(0, 5)
                .map((item) => (
                  <div className="justify-between flex flex-row text-sm">
                    <h1>{item.symbol}</h1>
                    <h2>{((item.margin! * item.leverage!) / item.contractSize) * 1000}</h2>
                    <div
                      className={`py-1 px-2 w-20 rounded ${item.orderType === "LONG" ? "bg-[#34c38f2e] text-[#34c38f]" : "bg-[#f46a6a2e] text-[#f46a6a]"}`}
                    >
                      {item.orderType}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <FormProvider {...form}>
          <div className="flex flex-col gap-4 w-1/3">
            <div className=" bg-[#141414] lg:h-[70vh] border-[0.5px] border-[#393939]">
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
            <div className="p-5 border-[0.5px] border-[#393939] h-[35vh]">
              <h1>Order Book</h1>
              <hr className="border w-full border-[#393939] my-2" />
              <div className="flex flex-row gap-2">
                <div className="w-full text-right">
                  <h2 className="text-green-400">Long</h2>
                  <div className="flex flex-col gap-1 w-full">
                    {trades
                      .filter((item) => item.symbol === symbol && item.orderType === "LONG")
                      .slice(0, 5)
                      .map((item) => (
                        <div className="inline-flex justify-between">
                          <div>{item.contractSize}</div>
                          <div className="bg-[#34c38f2e] text-[#34c38f] p-1 text-sm rounded max-w-32 truncate">
                            {((item.margin! * item.leverage!) / item.contractSize) * 1000}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="w-full">
                  <h2 className="text-red-400">Short</h2>
                  <div className="flex flex-col gap-1 w-full">
                    {trades
                      .filter((item) => item.symbol === symbol && item.orderType === "SHORT")
                      .slice(0, 5)
                      .map((item) => (
                        <div className="flex flex-row-reverse justify-between">
                          <div>{item.contractSize}</div>
                          <div className="bg-[#f46a6a2e] text-[#f46a6a] p-1 text-sm rounded max-w-32 truncate">
                            {((item.margin! * item.leverage!) / item.contractSize) * 1000}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FormProvider>
      </div>
      <ConfirmationModal
        trade={trade}
        onCancel={() => setConfirmationModalOpen(false)}
        onConfirm={handleComfimTrade}
        open={comfirmationModalOpen}
      />
    </div>
  );
}
