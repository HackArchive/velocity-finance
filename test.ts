import { BN, Provider, Wallet } from "fuels";


async function run() {
    const provider = await Provider.create("https://testnet.fuel.network/v1/graphql");
    const myWallet = Wallet.fromPrivateKey("ecd28bae7ff4db4cc41b088e57b06fcb6a6f561f516721df9a1f1a0d50a055f6", provider);
    myWallet.getBalances().then((data) => {
        console.log(data)
    });
}