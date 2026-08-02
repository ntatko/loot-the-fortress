import React from "react";
import PropTypes from "prop-types";
import MoneyBag from "../../assets/money-bag.svg";
import Coins from "../../assets/gold_coins.svg";
import Briefcase from "../../assets/briefcase.svg";
import Crown from "../../assets/crown.svg";
import InventoryItem from "./InventoryItem";
import iphone from "../../assets/iphone.svg";
import backpack from "../../assets/backpack.svg";
import wales from "../../assets/wales.svg";
import accomplice from "../../assets/accomplice.svg";
import "./Inventory.css";

export const GOLD = "gold";
export const BURLAP_SACK = "burlap sack";
export const LEATHER_SACK = "leather sack";
export const CROWN = "crown";
export const IPHONE = "iphone";
export const BACKPACK = "backpack";
export const WALES = "wales";
export const ACCOMPLICE = "accomplice";

/**
 * Trophies rather than supplies. You can buy several, but a second one does
 * nothing, so they get a small icon instead of a line of their own.
 */
export const STATUS_ITEMS = [CROWN, IPHONE, WALES];

export const getInventoryImage = (item) => {
  switch (item) {
    case GOLD:
      return Coins;
    case BURLAP_SACK:
      return MoneyBag;
    case LEATHER_SACK:
      return Briefcase;
    case CROWN:
      return Crown;
    case IPHONE:
      return iphone;
    case BACKPACK:
      return backpack;
    case ACCOMPLICE:
      return accomplice;
    case WALES:
      return wales;
    default:
      return "https://i.imgur.com/g9ZQ2nZ.png";
  }
};

const Inventory = (props) => {
  // Nothing you don't actually have. An emptied sack type or a spent purse
  // just leaves the list rather than sitting there reading zero.
  const owned = props.inventoryItems.filter((item) => item.count > 0);
  const supplies = owned.filter((item) => !STATUS_ITEMS.includes(item.type));
  const status = owned.filter((item) => STATUS_ITEMS.includes(item.type));

  return (
    <div className="inventory">
      <div className="inventory-title">Your wares</div>

      {owned.length === 0 && <div className="inventory-empty">Nothing at all.</div>}

      {supplies.map((item) => (
        <InventoryItem
          key={item.type}
          image={getInventoryImage(item.type)}
          {...item}
        />
      ))}

      {status.length > 0 && (
        <div className="inventory-status">
          {status.map((item) => (
            <div className="inventory-status-item" key={item.type} title={item.type}>
              <img src={getInventoryImage(item.type)} alt={item.type} />
              {item.count > 1 && (
                <span className="inventory-status-count">{`x${item.count}`}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

Inventory.propTypes = {
  inventoryItems: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default Inventory;
