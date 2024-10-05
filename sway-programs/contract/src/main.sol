// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleFutures {

    struct Position {
        uint256 size;
        bool isLong;
        uint256 margin;
        uint256 entryPrice;
        bool isOpen;
    }

    mapping(address => Position) public positions;

    uint256 public leverageLimit = 10;  // 10x leverage
    uint256 public liquidationThreshold = 80;  // Liquidate if margin drops to 80% of required

    uint256 public futuresExpiration;
    uint256 public maintenanceMargin;

    constructor(uint256 _futuresExpiration, uint256 _maintenanceMargin) {
        futuresExpiration = _futuresExpiration;
        maintenanceMargin = _maintenanceMargin;
    }

    function openPosition(uint256 margin, uint256 leverage, bool isLong) external {
        require(leverage <= leverageLimit, "Leverage too high");
        require(margin > 0, "Margin required");

        uint256 positionSize = margin * leverage;
        uint256 entryPrice = getLatestPrice();

        positions[msg.sender] = Position({
            size: positionSize,
            isLong: isLong,
            margin: margin,
            entryPrice: entryPrice,
            isOpen: true
        });
    }

    function closePosition() external {
        Position storage position = positions[msg.sender];
        require(position.isOpen, "No open position");

        uint256 exitPrice = getLatestPrice();
        uint256 pnl;
        
        // Calculate profit or loss based on whether the position is long or short
        if (position.isLong) {
            pnl = (exitPrice - position.entryPrice) * position.size / position.entryPrice;
        } else {
            pnl = (position.entryPrice - exitPrice) * position.size / position.entryPrice;
        }

        position.isOpen = false;

        // Handle payout based on the pnl value
        // Send pnl to trader if profitable or handle liquidation if loss exceeds margin
    }

    function liquidatePosition(address trader) external {
        Position storage position = positions[trader];
        require(position.isOpen, "No open position");

        uint256 currentPrice = getLatestPrice();
        uint256 pnl;

        if (position.isLong) {
            pnl = (currentPrice - position.entryPrice) * position.size / position.entryPrice;
        } else {
            pnl = (position.entryPrice - currentPrice) * position.size / position.entryPrice;
        }

        // If the position is in danger of liquidation (i.e. insufficient margin)
        if (position.margin < maintenanceMargin) {
            // Liquidate position and release funds
            position.isOpen = false;
            // Handle the liquidation process here
        }
    }

    function getLatestPrice() public view returns (uint256) {
        // This would call an external oracle like Chainlink to get the current price
        return 1000; // Placeholder value
    }
}
