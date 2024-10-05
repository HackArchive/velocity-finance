contract;


use std::{
    asset::transfer,
    auth::msg_sender,
    block::height,
    call_frames::msg_asset_id,
    context::msg_amount,
    hash::Hash,
};


fn get_latest_price() -> u64 {
    return 10000;
}

// The abi defines the blueprint for the contract.
abi SimpleFutures {

    #[storage(read, write)]
    fn constructor(
        _futuresExpiration: u64,
        _maintenanceMargin: u64,
        _leverage_divident: u64,
    );

    #[storage(read, write), payable]
    fn open_position(leverage: u64, isLong: bool);

    #[storage(read)]
    fn get_position(isLong: bool) -> Position;

    fn get_test() -> bool;

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

}

impl SimpleFutures for Contract {

    #[storage(read, write)]
    fn constructor(
        _futuresExpiration: u64,
        _maintenanceMargin: u64,
        _leverage_divident: u64,
    ) {
        storage.futuresExpiration.write(_futuresExpiration);
        storage.maintenanceMargin.write(_maintenanceMargin);


        storage.leverage_divident.write(_leverage_divident);

    }

    #[storage(read, write), payable]
    fn open_position(leverage: u64, isLong: bool) {

        // let margin = msg_amount();
        let margin = 1000;

        if isLong == true {
            require(storage.long.read().isOpen, "Position Not open");
        } else {
            require(storage.short.read().isOpen, "Position Not open");
        }
        
        require(0 < margin, "Ammount cannot be zero");
        require(leverage <= storage.leverageLimit.read(), "Leverage too high");
        
        let sender = msg_sender().unwrap();

        let leverage_div = storage.leverage_divident.read();

        let c_margin = get_latest_price() / leverage_div;

        let entryPrice = get_latest_price();

        let new_position = Position {
            margin: c_margin,
            entryPrice: entryPrice,
            isOpen: false,
            holder: sender,
        };

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

    fn get_test() -> bool {
        return true
    }


}
