contract;


use std::{
    asset::transfer,
    auth::msg_sender,
    block::height,
    call_frames::msg_asset_id,
    context::msg_amount,
    hash::Hash,
};



use pyth_interface::{data_structures::price::{Price, PriceFeedId}, PythCore};

const PYTH_CONTRACT_ID = 0x73591bf32f010ce4e83d86005c24e7833b397be38014ab670a73f6fde59ad607; // Testnet Contract
const FUEL_ETH_BASE_ASSET_ID = 0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07;


// The abi defines the blueprint for the contract.
abi SimpleFutures {

    #[storage(read, write)]
    fn constructor(
        _futuresExpiration: u64,
        _maintenanceMargin: u64,
        _leverage_divident: u64,
        _asset_price: u64
    );

    #[storage(read, write), payable]
    fn open_position(leverage: u64, isLong: bool);

    #[storage(read)]
    fn get_position(isLong: bool) -> Position;

    fn get_price(price_feed_id: PriceFeedId) -> Price;

    #[storage(read, write)]
    fn close_position(isLong: bool);

    #[storage(write)]
    fn set_asset_price(_asset_price: u64);

    #[storage(read)]
    fn get_contract_margin() -> u64;

}

struct Position {
    margin: u64,
    entryPrice: u64,
    isOpen: bool,
    holder: Identity,
}

storage {

    long: Position = Position {
            margin: 0, 
            entryPrice: 0,
            isOpen: true,
            holder:  Identity::Address(Address::from(0x09c0b2d1a486c439a87bcba6b46a7a1a23f3897cc83a94521a96da5c23bc58db)),
    },
    short: Position = Position {
            margin: 0, 
            entryPrice: 0,
            isOpen: true,
            holder:   Identity::Address(Address::from(0x09c0b2d1a486c439a87bcba6b46a7a1a23f3897cc83a94521a96da5c23bc58db)),
    },

    leverageLimit: u64 = 10,  // 10x leverage
    liquidationThreshold: u64 = 80, // Liquidate if margin drops to 80% of required
    leverage_divident: u64 = 1000, // division to 1000 subunits

    futuresExpiration: u64 = 0,
    maintenanceMargin: u64 = 0,
    asset_price: u64 = 0,

}

impl SimpleFutures for Contract {

    #[storage(read, write)]
    fn constructor(
        _futuresExpiration: u64,
        _maintenanceMargin: u64,
        _leverage_divident: u64,
        _asset_price: u64
    ) {
        storage.futuresExpiration.write(_futuresExpiration);
        storage.maintenanceMargin.write(_maintenanceMargin);
        storage.asset_price.write(_asset_price);
        storage.leverage_divident.write(_leverage_divident);

    }

    #[storage(read, write), payable]
    fn open_position(leverage: u64, isLong: bool, ) {

        let margin = msg_amount();
        // let margin = 1000;

        // if isLong == true {
        //     require(storage.long.read().isOpen, "Position Not open");
        // } else {
        //     require(storage.short.read().isOpen, "Position Not open");
        // }
        
        require(0 < margin, "Ammount cannot be zero");
        require(leverage <= storage.leverageLimit.read(), "Leverage too high");
        
        let sender = msg_sender().unwrap();

        let leverage_div = storage.leverage_divident.read();

        let latest_asset_price = storage.asset_price.read();

        let c_margin = latest_asset_price / leverage_div;

        let entryPrice = latest_asset_price;

        let new_position = Position {
            margin: c_margin,
            entryPrice: entryPrice,
            isOpen: false,
            holder: sender,
        };


        // let asset = AssetId::from(0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07);

        // transfer(
        //     Identity::Address(Address::from(0xbf3d9e1f3d78fd8c16683ac17e6986bbed745884c05ad0878ea04ac1d1b0d7c6)),
        //     asset,
        //     111
        // );

        if isLong {
            storage.long.write(new_position);
        } else {
            storage.short.write(new_position);
        }

    }

    #[storage(read)]
    fn get_position(isLong: bool) -> Position {
        if isLong {
            return storage.long.read()
        } else {
            return storage.short.read()
        }
    }

    #[storage(read, write)]
    fn close_position(isLong: bool) {

        if isLong {
            let mut curr_position = storage.long.read();
            curr_position.isOpen = true;

            storage.long.write(curr_position);
        } else {
            let mut curr_position = storage.short.read();
            curr_position.isOpen = true;

            storage.short.write(curr_position);
        }

    }

    // liquidate collatera on leverageMargin

    fn get_price(price_feed_id: PriceFeedId) -> Price {
        let pyth_contract = abi(PythCore, PYTH_CONTRACT_ID);
        let price = pyth_contract.price(price_feed_id);
        price
    }

    #[storage(write)]
    fn set_asset_price(_asset_price: u64) {
        storage.asset_price.write(_asset_price);
    }

    #[storage(read)]
    fn get_contract_margin() -> u64 {
        
        let latest_asset_price: u64 = storage.asset_price.read();
        let leverage_div: u64 = storage.leverage_divident.read();
        let c_margin = latest_asset_price / leverage_div;

        return c_margin;
    }

}
