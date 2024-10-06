import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import type { ConfirmationModalProps } from "./type";
import { getSymbolPrice } from "../../utils/GetSymbolPrice";
import { useWallet } from "@fuels/react";
import { SimpleFutures } from "../../swap-api";
import { BN } from "fuels";

const BASE_ASSET_ID = "0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07"; 


const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ open, onConfirm, onCancel, trade }) => {

  const { wallet, refetch } = useWallet();

  const _contract = new SimpleFutures(process.env.VITE_TESTNET_CONTRACT_ID!, wallet!);


  const openPosition = async () => {

    const ethPrice = await getSymbolPrice("ETHUSD");

    let isLong = true;
    if (trade.orderType === "SHORT") {
      isLong = false;
    }
    const eth_margin = (trade.margin! / ethPrice) * 1000000;

    _contract.functions.open_position(1, isLong).callParams({
      forward: [eth_margin, BASE_ASSET_ID],
      gasLimit: new BN(1000000)

    }).call();
  }


  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent sx={{ width: "20vw" }}>
        <Typography variant="h6" className="font-bold">
          {trade.contractSize} {trade.symbol}
        </Typography>
        <Typography>Price: {trade.limitPrice}</Typography>
        <Typography>{trade.symbol}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} className="w-full  text-green-400 rounded-none mt-10">
          Cancel
        </Button>
        <Button onClick={openPosition} className="w-full bg-green-400 text-white rounded-none mt-10">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
