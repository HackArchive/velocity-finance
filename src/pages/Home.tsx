import {
  useAccount,
  useBalance,
  useConnectors,
  useConnectUI,
  useDisconnect,
  useIsConnected,
  useWallet,
} from "@fuels/react";
import { AbstractContract, BN, Contract, Provider } from "fuels";


import { useEffect, useState } from "react";
import { providerUrl } from "../lib";
import { SimpleFutures } from "../swap-api";

import PYTH_CONTRACT_ABI from "../abi/pyth-contract-abi.json";

export default function Home() {
  const FUEL_ETH_BASE_ASSET_ID = "0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07";
  const PRICE_FEED_ID = "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace"; // ETH/USD

  const PYTH_CONTRACT_ID = "0x73591bf32f010ce4e83d86005c24e7833b397be38014ab670a73f6fde59ad607";

  const [provider, setProvider] = useState<Provider>();
  const [contract, setContract] = useState<SimpleFutures>();

  const { connectors } = useConnectors();
  // const { connect } = useConnect();
  const { connect } = useConnectUI();

  const { wallet, refetch } = useWallet();

  const { disconnect } = useDisconnect();
  const { isConnected } = useIsConnected();
  const { account } = useAccount();
  const { balance } = useBalance({
    address: account as string,
  });

  const setProviderFunc = async () => {
    const _provider = await Provider.create(providerUrl);
    const _contract = new SimpleFutures(process.env.VITE_TESTNET_CONTRACT_ID!, wallet!);
    setProvider(_provider);
    setContract(_contract);

    const BASE_ASSET_ID = "0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07"; 

    // await contract?.functions.set_asset_price(325780000).call();
    let m = (await contract?.functions.get_contract_margin().get())?.value;
    console.log(m?.toString())
    // await contract?.functions.close_positi on(true).call();
    // let d = await contract?.functions.open_position(1,true).callParams({
    //   forward: [111, BASE_ASSET_ID],
    //   gasLimit: new BN(1000000)
    // }).call();

    // console.log(d,"=====");


    
  }



  return (
    <div className="w-full h-[100vh] bg-white mt-[100px]">
      <div className="flex flex-col items-start">
        <label className="mb-2" htmlFor="wallet">
          Wallet Address
        </label>
        <div className=" rounded-lg p-4 w-full">
          {isConnected ? (
            <div>
              <p
                className="text-black-600 font-bold"
                // value={formData.stellarAccountId}
                // onChange={handleChange}
              >
                Connected
              </p>
              <p className="text-sm">Account Address: {account}</p>
              {balance && <p className="text-sm"> Balance: {balance.toString()}</p>}
              <button className="mt-4" onClick={() => disconnect()}>
                Disconnect Wallet
              </button>
            </div>
          ) : (
            <button className="mt-4" onClick={() => connect()}>
              Connect Wallet
            </button>
          )}
        </div>
        <button onClick={setProviderFunc}>Open Position</button>
      </div>
    </div>
  );
}
