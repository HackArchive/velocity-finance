import { Button, Slider } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmationModal from "../components/confirmation-modal/ConfirmationModal";
import LabelledTextField from "../components/LabelledTextField";
import TradingViewWidget from "../components/TradingView";
import { Symbols, type Trade } from "../types";
import { getSymbolPrice } from "../utils/GetSymbolPrice";

export default function Trade() {
  const { symbol } = useParams();
  const [price, setPrice] = useState<number>(0);
  const [comfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const navigate = useNavigate();
  const currentSymbol =
    Object.entries(Symbols)
      .find(([key]) => key === symbol)?.[0]
      .replace("USD", "") || undefined;

  const handleComfimTrade = () => {
    console.log("Trade Confirmed");
  };

  const form = useForm<Trade>({
    defaultValues: {
      orderType: "LONG",
      tradeSize: 0,
      leverage: 0,
      limitPrice: 0,
      symbol: undefined,
      margin: 1,
    },
  });

  const { register, handleSubmit, setValue, watch } = form;

  const trade = watch();
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

  return (
    <div className="min-h-screen pt-20 lg:px-4 flex flex-row gap-4 text-white">
      <div className="flex flex-col gap-4 w-full">
        <div className="h-[70vh]">
          <TradingViewWidget key={symbol} symbol={`PYTH:${symbol}`} />{" "}
        </div>
      </div>
      <FormProvider {...form}>
        <div className="w-1/3 bg-[#141414] lg:h-[79vh]">
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
              className={`w-[6rem] p-4 ${trade.orderType === "SHORT" ? "bg-green-400" : ""} cursor-pointer`}
            >
              Short
            </div>
          </div>

          <div className="flex flex-col p-4 gap-4 ">
            <div className="flex flex-col">
              <LabelledTextField label="Trade Size" {...register("tradeSize")} />
              <span className="pt-1 ml-auto">${trade.tradeSize * price}</span>
            </div>

            <div className="flex flex-col">
              <h1 className="text-[0.9rem] pb-1">Leverage</h1>
              <Controller
                name="leverage"
                control={form.control}
                render={({ field }) => (
                  <Slider {...field} value={Number(field.value)} sx={{ color: "white", width: "95%", ml: 2 }} />
                )}
              />
              <span className="ml-auto">{trade.leverage}%</span>
            </div>
            <LabelledTextField label="Price" {...register("limitPrice")} />
            <Button
              onClick={handleSubmit(() => setConfirmationModalOpen(true))}
              className="w-full bg-green-400 text-white rounded-none mt-10"
            >
              Submit Order
            </Button>
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
