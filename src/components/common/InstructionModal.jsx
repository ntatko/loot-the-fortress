import React from "react";
import PropTypes from "prop-types";
import Button from "../core/Button";
import {
  ACCOMPLICE,
  BACKPACK,
  BURLAP_SACK,
  getInventoryImage,
  IPHONE,
  LEATHER_SACK,
  WALES,
  CROWN,
} from "./Inventory";
import MoneyBag from "../../assets/money-bag.svg";
import Coins from "../../assets/gold_coins.svg";
import Briefcase from "../../assets/briefcase.svg";
import Crown from "../../assets/crown.svg";
import Key from "../../assets/key.svg";
import { useInventory } from "../../context/useInventory";
import Modal from "../core/Modal";

const InstructionModal = (props) => {
  const { inventoryItems } = useInventory();
  const hasCrown =
    inventoryItems.find((item) => item.type === CROWN) &&
    inventoryItems.find((item) => item.type === CROWN)?.count > 0;
  //   const hasPopulatedWales =
  //     inventoryItems.find((item) => item.type === WALES) &&
  //     inventoryItems.find((item) => item.type === WALES)?.count > 0 &&
  //     inventoryItems.find((item) => item.type === ACCOMPLICE) &&
  //     inventoryItems.find((item) => item.type === ACCOMPLICE)?.count >= 3200000;

  return (
    <Modal isOpen={props.show} onClose={props.onClose}>
      <div className="modal-header text">How to play</div>

      <div className="text" style={{ fontSize: "1.2rem", overflow: "scroll" }}>
        <p>
          The goal of the game is to collect as much gold as possible.
          Technically, you win when you have enough gold to buy a{" "}
          <img style={{ height: "1.5rem" }} src={Crown} alt={"stuff"} /> crown.
        </p>
        <p>
          So, how do you make money? You <b>loot the fortress</b> and collect{" "}
          <img style={{ height: "1.5rem" }} src={Coins} alt={"stuff"} /> gold.
        </p>
        <p>
          But there's a catch. Every time you put{" "}
          <img style={{ height: "1.5rem" }} src={Coins} alt={"stuff"} /> gold in
          your sack, there's a <b>chance that it will break</b>. Each kind of
          sack has a different chance of breaking.
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <img style={{ height: "2.5rem" }} src={MoneyBag} alt={props.type} />
          <div
            style={{
              fontSize: "1.5rem",
              fontFamily: "Syne Mono",
              monospace: "true",
            }}
          >
            <b>{BURLAP_SACK}</b>
          </div>
          <div
            style={{
              fontSize: "1.5rem",
              fontFamily: "Syne Mono",
              monospace: "true",
            }}
          >
            1 in 5 chance
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <img style={{ height: "2.5rem" }} src={Briefcase} alt={props.type} />
          <div
            style={{
              fontSize: "1.5rem",
              fontFamily: "Syne Mono",
              monospace: "true",
            }}
          >
            <b>{LEATHER_SACK}</b>
          </div>
          <div
            style={{
              fontSize: "1.5rem",
              fontFamily: "Syne Mono",
              monospace: "true",
            }}
          >
            1 in 16 chance
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <img
            style={{ height: "2.5rem" }}
            src={getInventoryImage(BACKPACK)}
            alt={props.type}
          />
          <div
            style={{
              fontSize: "1.5rem",
              fontFamily: "Syne Mono",
              monospace: "true",
            }}
          >
            <b>{BACKPACK}</b>
          </div>
          <div
            style={{
              fontSize: "1.5rem",
              fontFamily: "Syne Mono",
              monospace: "true",
            }}
          >
            1 in 64 chance
          </div>
        </div>
        <p>
          If you break a sack, you lose the gold you put in it. But don't worry!
          You can always buy a new sack to keep your gold. If you have enough
          gold, that is.
        </p>
        <p>
          If you're escaping the fortress with{" "}
          <img style={{ height: "1.5rem" }} src={Coins} alt={"stuff"} /> loot,
          you'll need to find the{" "}
          <img style={{ height: "1.5rem" }} src={Key} alt={props.type} />{" "}
          <b>key</b>. You'll be presented with a <b>trivia question</b>. If you
          answer correctly, you keep your{" "}
          <img style={{ height: "1.5rem" }} src={Coins} alt={"stuff"} /> money.
          If you don't, you'll have to pay a{" "}
          <img style={{ height: "1.5rem" }} src={Coins} alt={"stuff"} /> bribe
          to get out of the fortress (half your{" "}
          <img style={{ height: "1.5rem" }} src={Coins} alt={"stuff"} /> loot,
          rounded up).
        </p>
        {!hasCrown && (
          <>
            <p>
              <b>Oh, also...</b> when you think you've won, be sure to check the
              store out again. You might find more interesting stuff there.
            </p>
            <p>
              <b>Good luck!</b>
            </p>
          </>
        )}
        {hasCrown && (
          <>
            <p style={{ fontSize: "2rem" }}>
              <b>STAGE TWO:</b>
            </p>
            <p>
              There are some new items to find in the store that might make your
              journey a bit more exciting.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <img
                style={{ height: "2.5rem" }}
                src={getInventoryImage(ACCOMPLICE)}
                alt={ACCOMPLICE}
              />
              <div
                style={{
                  fontSize: "1.5rem",
                  fontFamily: "Syne Mono",
                  monospace: "true",
                }}
              >
                <b>{ACCOMPLICE}</b>
              </div>
            </div>
            <div
              style={{
                fontSize: "1.5rem",
                fontFamily: "Syne Mono",
                monospace: "true",
              }}
            >
              A thieving multiplier
            </div>
            <p>
              Every time you loot, your <strong>accomplice</strong> does, too.
              Your <b>sack</b> can hold all the extra gold, too, without being
              any more likely to break. Oh, and you can have an unlimited amount
              of accomplices, working as multipliers for you while you{" "}
              <b>loot</b>.
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <img
                style={{ height: "2.5rem" }}
                src={getInventoryImage(IPHONE)}
                alt={IPHONE}
              />
              <div
                style={{
                  fontSize: "1.5rem",
                  fontFamily: "Syne Mono",
                  monospace: "true",
                }}
              >
                <b>{IPHONE}</b>
              </div>
            </div>
            <div
              style={{
                fontSize: "1.5rem",
                fontFamily: "Syne Mono",
                monospace: "true",
              }}
            >
              A Googling Device
            </div>
            <p>
              Every time you answer your trivia question wrong, your{" "}
              <strong>iphone</strong> corrects you, because you should have been
              googling those anyway.
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <img
                style={{ height: "2.5rem" }}
                src={getInventoryImage(WALES)}
                alt={WALES}
              />
              <div
                style={{
                  fontSize: "1.5rem",
                  fontFamily: "Syne Mono",
                  monospace: "true",
                }}
              >
                <b>{WALES}</b>
              </div>
            </div>
            <div
              style={{
                fontSize: "1.5rem",
                fontFamily: "Syne Mono",
                monospace: "true",
              }}
            >
              Literally, the country of wales
            </div>
            <p>
              Yeah, you can buy <strong>wales</strong>. What other game lets you
              do that?
            </p>
            <br></br>

            <p>
              Oh, and the population of Wales is 3.2 million people. Just an
              interesting hint.
            </p>
          </>
        )}
      </div>

      <Button onClick={() => props.onClose()}>I got it</Button>
    </Modal>
  );
};

InstructionModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default InstructionModal;
