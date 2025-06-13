import React, { useEffect, useState } from "react";
import Button from "../core/Button";
import GoldCoins from "../../assets/gold_coins.svg";
import Inventory, {
  ACCOMPLICE,
  BACKPACK,
  BURLAP_SACK,
  getInventoryImage,
  GOLD,
  LEATHER_SACK,
} from "../common/Inventory";
import LoserModal from "../common/LoserModal";
import FadeOutAction from "../common/FadeOutAction";
import { useInventory } from "../../context/useInventory";
import ButtonLink from "../core/ButtonLink";
import "./Theft.css";

const Theft = () => {
  const [goldCount, setGoldCount] = useState(0);
  const [bagType, setBagType] = useState(BURLAP_SACK);
  const [history, setHistory] = useState([]);
  const [highScore, setHighScore] = useState(
    JSON.parse(localStorage.getItem("highScore")) || {
      [BURLAP_SACK]: 0,
      [LEATHER_SACK]: 0,
      [BACKPACK]: 0,
    }
  );

  const { inventoryItems, updateInventory } = useInventory();

  const hasBags = inventoryItems.some(
    (e) =>
      (e.type === BURLAP_SACK ||
        e.type === LEATHER_SACK ||
        e.type === BACKPACK) &&
      e.count > 0
  );
  const accompliceCount =
    inventoryItems.find((e) => e.type === ACCOMPLICE)?.count ?? 0;

  const getPercentage = () => {
    if (goldCount === 0) {
      return 0;
    }
    switch (bagType) {
      case BURLAP_SACK:
        return 0.2;
      case LEATHER_SACK:
        return 0.0625;
      case BACKPACK:
        return 0.015625;
      default:
        return 0.5;
    }
  };

  useEffect(() => {
    if (inventoryItems.find((e) => e.type === bagType).count === 0) {
      if (inventoryItems.find((e) => e.type === BURLAP_SACK)?.count > 0) {
        setBagType(BURLAP_SACK);
      } else if (
        inventoryItems.find((e) => e.type === LEATHER_SACK)?.count > 0
      ) {
        setBagType(LEATHER_SACK);
      } else if (inventoryItems.find((e) => e.type === BACKPACK)?.count > 0) {
        setBagType(BACKPACK);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddClick = () => {
    if (Math.random() > getPercentage()) {
      try {
        navigator.vibrate(30);
      } catch {}
      setHistory([
        ...history,
        {
          message: "success",
          count: goldCount + 1,
          bagType: bagType,
          action: "add",
        },
      ]);
      setGoldCount(goldCount + 1);
    } else {
      try {
        navigator.vibrate([150, 30, 150]);
      } catch {}
      setHistory([
        ...history,
        {
          message: "failure",
          count: 1,
          bagType: bagType,
          action: "bag burst!",
        },
      ]);
      setGoldCount(1);
      updateInventory(bagType, -1);

      if (inventoryItems.find((e) => e.type === bagType).count === 0) {
        if (inventoryItems.find((e) => e.type === BURLAP_SACK)?.count > 0) {
          setBagType(BURLAP_SACK);
        } else if (
          inventoryItems.find((e) => e.type === LEATHER_SACK)?.count > 0
        ) {
          setBagType(LEATHER_SACK);
        } else if (inventoryItems.find((e) => e.type === BACKPACK)?.count > 0) {
          setBagType(BACKPACK);
        }
      }
    }
    setTimeout(() => {
      setHistory((thisHistory) => thisHistory.slice(1));
    }, 2000);
  };

  const handleStopClick = () => {
    setHistory([
      ...history,
      {
        message: "saved",
        count: goldCount * (1 + accompliceCount),
        bagType: bagType,
        action: "stop",
      },
    ]);

    if (!highScore[bagType] || highScore[bagType] < goldCount) {
      localStorage.setItem(
        "highScore",
        JSON.stringify({ ...highScore, [bagType]: goldCount })
      );
      setHighScore({ ...highScore, [bagType]: goldCount });
    }
  };

  const getActionDisplay = (action) => {
    switch (action.message) {
      case "success":
        return "+1";
      case "failure":
        return "Bag Burst!";
      case "saved":
        return "Saved";
      default:
        return "?";
    }
  };

  return (
    <div className="theft-container">
      <Inventory inventoryItems={inventoryItems} />
      <div className="theft-content">
        <div className="theft-title">This haul</div>
        <div className="theft-gold-container">
          <img style={{ height: "3rem" }} src={GoldCoins} alt="Gold Coins" />
          <div className="theft-gold-count">{goldCount}</div>
          {accompliceCount > 0 && (
            <div className="theft-accomplice-bonus">
              {`+${accompliceCount}`}
              <img
                style={{ height: "1rem" }}
                src={getInventoryImage(ACCOMPLICE)}
                alt="Gold Coins"
              />
              {`=${(1 + accompliceCount) * goldCount}`}
            </div>
          )}
        </div>
        <div className="theft-history-container">
          {history.map((action) => (
            <FadeOutAction
              key={action.message + action.count}
              onExit={() => setHistory((thisHistory) => thisHistory.slice(1))}
            >
              <div className={`theft-history-item ${action.message}`}>
                {getActionDisplay(action)}
              </div>
            </FadeOutAction>
          ))}
        </div>
        <div className="theft-buttons-container">
          <Button disabled={!hasBags} onClick={handleAddClick}>
            Loot
          </Button>
          <ButtonLink
            to={goldCount === 0 ? "/" : "/escape"}
            state={{ amount: goldCount * (1 + accompliceCount) }}
            onClick={handleStopClick}
          >
            Escape
          </ButtonLink>
        </div>
        <p className="theft-high-score">{`Best haul: ${highScore[bagType]}`}</p>
        <div className="theft-bag-selector-container">
          <BagSelector
            bagType={BURLAP_SACK}
            setBagType={() => setBagType(BURLAP_SACK)}
            count={
              inventoryItems.find((e) => e.type === BURLAP_SACK)?.count || 0
            }
            isSelected={bagType === BURLAP_SACK}
            disabled={goldCount !== 0}
          />
          <BagSelector
            bagType={LEATHER_SACK}
            setBagType={() => setBagType(LEATHER_SACK)}
            count={
              inventoryItems.find((e) => e.type === LEATHER_SACK)?.count || 0
            }
            isSelected={bagType === LEATHER_SACK}
            disabled={goldCount !== 0}
          />
          <BagSelector
            bagType={BACKPACK}
            setBagType={() => setBagType(BACKPACK)}
            count={inventoryItems.find((e) => e.type === BACKPACK)?.count || 0}
            isSelected={bagType === BACKPACK}
            disabled={goldCount !== 0}
          />
        </div>
      </div>
      {localStorage.getItem("isDeveloper") === "true" && (
        <div className="developer-panel">
          {history.map((item) => (
            <div className="developer-panel-item">{`${item.message} - ${item.count} - ${item.bagType} - ${item.action}`}</div>
          ))}
        </div>
      )}
      <LoserModal
        show={
          !hasBags &&
          inventoryItems.find((e) => e.type === GOLD).count +
            goldCount * (1 + accompliceCount) <
            3
        }
      />
    </div>
  );
};

export default Theft;

const BagSelector = ({ bagType, setBagType, count, isSelected, disabled }) => {
  const handleClick = () => {
    if (count > 0 && !isSelected && !disabled) {
      setBagType();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || count === 0}
      className={`bag-selector ${isSelected ? "selected" : ""}`}
    >
      <img
        style={{ height: "3rem" }}
        src={getInventoryImage(bagType)}
        alt="Burlap Sack"
      />
    </button>
  );
};
