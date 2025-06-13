import React, { useState } from "react";
import Inventory, {
  ACCOMPLICE,
  BACKPACK,
  BURLAP_SACK,
  CROWN,
  getInventoryImage,
  GOLD,
  IPHONE,
  LEATHER_SACK,
  WALES,
} from "../common/Inventory";
import Coins from "../../assets/gold_coins.svg";
import Button from "../core/Button";
import WinningModal from "../common/WinningModal";
import { useInventory } from "../../context/useInventory";
import "./Shop.css";
import ButtonLink from "../core/ButtonLink";

const costs = {
  [BURLAP_SACK]: 3,
  [LEATHER_SACK]: 8,
  [CROWN]: 100,
  [BACKPACK]: 30,
  [ACCOMPLICE]: 1000,
  [IPHONE]: 3000,
  [WALES]: 1000000,
};

const Shop = () => {
  const { inventoryItems, buyItems } = useInventory();
  const [showWinningModal, setShowWinningModal] = useState(false);
  const currentGold = inventoryItems.find((item) => item.type === GOLD).count;
  const [buyMaxItem, setBuyMaxItem] = useState(null);
  //   const [showStageThreeModal, setShowStageThreeModal] = useState(false);

  const buyItem = (type) => {
    try {
      navigator.vibrate(100);
    } catch {}
    buyItems(type, 1, costs[type]);
  };

  const onMaxItemConfirm = () => {
    const count = Math.floor(currentGold / costs[buyMaxItem]);
    buyItems(buyMaxItem, count, costs[buyMaxItem] * count);
    setBuyMaxItem(null);
  };

  const hasWon =
    inventoryItems.find((item) => item.type === CROWN)?.count > 0 ?? false;
  //   const hasWonStageTwo =
  //     inventoryItems.find((item) => item.type === WALES)?.count > 0 &&
  //     inventoryItems.find((item) => item.type === ACCOMPLICE)?.count >= 3200000;

  return (
    <>
      <ConfirmModal
        item={buyMaxItem}
        onCancel={() => setBuyMaxItem(null)}
        onPurchase={onMaxItemConfirm}
      />
      <WinningModal
        show={showWinningModal}
        onClose={() => setShowWinningModal(false)}
      />
      <div className="shop-container">
        <div className="shop-sidebar">
          <ButtonLink to="/">Back to the Fortress</ButtonLink>
          <Inventory inventoryItems={inventoryItems} />
        </div>
        <div className="shop-inventory">
          <ShopInventoryItem
            currentGold={currentGold}
            onClick={() => {
              if (
                !inventoryItems.find((e) => e.type === CROWN) ||
                inventoryItems.find((e) => e.type === CROWN)?.count === 0
              ) {
                setShowWinningModal(true);
              }
              buyItem(CROWN);
            }}
            maxClick={() => setBuyMaxItem(CROWN)}
            type={CROWN}
          />
          <ShopInventoryItem
            currentGold={currentGold}
            onClick={() => buyItem(BURLAP_SACK)}
            maxClick={() => setBuyMaxItem(BURLAP_SACK)}
            type={BURLAP_SACK}
          />
          <ShopInventoryItem
            currentGold={currentGold}
            onClick={() => buyItem(LEATHER_SACK)}
            maxClick={() => setBuyMaxItem(LEATHER_SACK)}
            type={LEATHER_SACK}
          />
          <ShopInventoryItem
            currentGold={currentGold}
            onClick={() => buyItem(BACKPACK)}
            maxClick={() => setBuyMaxItem(BACKPACK)}
            type={BACKPACK}
          />
          {hasWon && (
            <>
              <ShopInventoryItem
                currentGold={currentGold}
                onClick={() => buyItem(ACCOMPLICE)}
                maxClick={() => {
                  //   if (
                  //     inventoryItems.find((i) => i.type === WALES) &&
                  //     inventoryItems.find((i) => i.type === WALES)?.count > 0
                  //   ) {
                  //     if (
                  //       inventoryItems.find((i) => i.type === ACCOMPLICE) &&
                  //       inventoryItems.find((i) => i.type === ACCOMPLICE)?.count >
                  //         3200000
                  //     ) {
                  //       setShowStageThreeModal(true);
                  //     }
                  //   }
                  setBuyMaxItem(ACCOMPLICE);
                }}
                type={ACCOMPLICE}
              />
              <ShopInventoryItem
                currentGold={currentGold}
                onClick={() => buyItem(IPHONE)}
                maxClick={() => setBuyMaxItem(IPHONE)}
                type={IPHONE}
              />
              <ShopInventoryItem
                currentGold={currentGold}
                onClick={() => buyItem(WALES)}
                maxClick={() => setBuyMaxItem(WALES)}
                type={WALES}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Shop;

const ShopInventoryItem = (props) => {
  return (
    <div className="shop-item">
      <div className="shop-item-header">
        <img
          className="shop-item-image"
          src={getInventoryImage(props.type)}
          alt={props.type}
        />
        <div className="shop-item-title">{props.type}</div>
      </div>
      <div className="shop-item-actions">
        <div className="shop-item-price">
          <img src={Coins} alt={props.type} />
          <div className="shop-item-price-value">{costs[props.type]}</div>
        </div>
        <Button
          disabled={props.currentGold < costs[props.type]}
          onClick={props.onClick}
        >
          Buy
        </Button>
        {props.currentGold > costs[props.type] * 2 && (
          <Button
            disabled={props.currentGold < costs[props.type] * 2}
            onClick={props.maxClick}
          >
            Max
          </Button>
        )}
      </div>
    </div>
  );
};

const ConfirmModal = (props) => {
  if (props.item === null) return null;

  return (
    <div onClick={() => props.onCancel()} className="modal-container">
      <div onClick={(e) => e.stopPropagation()} className="modal-content">
        <div className="modal-header">
          <p>
            Buy all the{" "}
            <img
              alt={props.item}
              className="modal-item-image"
              src={getInventoryImage(props.item)}
            />{" "}
            {props.item}s
          </p>
        </div>

        <div className="modal-text">
          <p>
            You'll use most of your gold to buy the maximum amount of{" "}
            <img
              alt={props.item}
              className="modal-item-image-small"
              src={getInventoryImage(props.item)}
            />{" "}
            {props.item}s you can.
          </p>
        </div>
        <div className="modal-actions">
          <Button onClick={() => props.onPurchase()}>Buy</Button>
          <Button onClick={() => props.onCancel()}>Cancel</Button>
        </div>
      </div>
    </div>
  );
};
