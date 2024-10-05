contract;


use std::{
    asset::transfer,
    auth::msg_sender,
    block::height,
    call_frames::msg_asset_id,
    context::msg_amount,
    hash::Hash,
};

pub enum UserError {
    AmountCannotBeZero: (),
}

// The abi defines the blueprint for the contract.
abi SimpleFutures {

    #[storage(read, write)]
    fn constructor(
        _futuresExpiration: u64,
        _maintenanceMargin: u64
    );

    #[storage(read, write)]
    #[payable]
    fn open_position(leverage: u64, isLong: bool);
}

 fn get_latest_price() -> u64 {
        return 1000;
    }

struct Position {
    size: u64,
    isLong: bool,
    margin: u64,
    entryPrice: u64,
    isOpen: bool,
}

storage {
    counter: u64 = 0,
    positions: StorageMap<Identity, Position> = StorageMap::<Identity, Position> {},

    leverageLimit: u64 = 10,  // 10x leverage
    liquidationThreshold: u64 = 80, // Liquidate if margin drops to 80% of required

    futuresExpiration: u64 = 0,
    maintenanceMargin: u64 = 0,
}

impl SimpleFutures for Contract {

    #[storage(read, write)]
    fn constructor(
        _futuresExpiration: u64,
        _maintenanceMargin: u64
    ) {
        storage.futuresExpiration.write(_futuresExpiration);
        storage.maintenanceMargin.write(_maintenanceMargin);
    }

    #[storage(read, write)]
    #[payable]
    fn open_position(leverage: u64, isLong: bool) {

        let margin = msg_amount();
        require(0 < margin, UserError::AmountCannotBeZero);
        
        require(leverage <= storage.leverageLimit.read(), "Leverage too high");

        let positionSize = margin * leverage;
        let entryPrice = get_latest_price();

        let new_position = Position {
            size: positionSize,
            isLong: isLong,
            margin: msg_amount(),
            entryPrice: entryPrice,
            isOpen: true
        };

        let sender = msg_sender().unwrap();

        storage.positions.insert(sender, new_position);

    }

}
