use std::str::FromStr;

use fuels::{prelude::*, types::ContractId};
use fuels::{crypto::SecretKey, prelude::*};


#[tokio::test]
async fn can_get_contract_id() {

    const provider: Provider = Provider::connect("testnet.fuel.network").await.unwrap();

    const contract_id: &str = "0xb933c7e9428063baae2892daeaee192a4b73aaaa77767d9e53463e140feec54c";

    const secret: SecretKey = SecretKey::from_str(
        "",
    )?;

    const wallet: WalletUnlocked = WalletUnlocked::new_from_private_key(secret, Some(provider));


    const contract_instance: MyContract = MyContract::new(contract_id, wallet_1.clone());



    // Now you have an instance of your contract you can use to test each function
}
