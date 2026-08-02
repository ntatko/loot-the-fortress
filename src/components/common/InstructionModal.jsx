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
import Coins from "../../assets/gold_coins.svg";
import Crown from "../../assets/crown.svg";
import Key from "../../assets/key.svg";
import { useInventory } from "../../context/useInventory";
import { useWorld } from "../../context/useWorld";
import Modal from "../core/Modal";
import GameLoopDiagram from "./GameLoopDiagram";
import {
  AccompliceGraphic,
  BagOddsGraphic,
  CrownGraphic,
  EscapeGraphic,
  IphoneGraphic,
  LootGraphic,
  ShopGraphic,
  WalesGraphic,
  WorldGraphic,
} from "./InstructionGraphics";

const inline = { height: "1.5rem", verticalAlign: "middle" };

const Step = ({ number, title, children }) => (
  <section style={{ marginTop: "1.5rem" }}>
    <div
      style={{
        fontSize: "1.5rem",
        fontFamily: "'Syne Mono', monospace",
        fontWeight: "bold",
        borderBottom: "2px solid #bb6108",
        paddingBottom: "0.25rem",
        marginBottom: "0.5rem",
      }}
    >
      {number}. {title}
    </div>
    {children}
  </section>
);

Step.propTypes = {
  number: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const Unlocked = ({ title, children }) => (
  <section style={{ marginTop: "1.5rem" }}>
    <div
      style={{
        fontSize: "1.5rem",
        fontFamily: "'Syne Mono', monospace",
        fontWeight: "bold",
        borderBottom: "2px solid #bb6108",
        paddingBottom: "0.25rem",
        marginBottom: "0.5rem",
      }}
    >
      {title}
    </div>
    {children}
  </section>
);

Unlocked.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const ItemHeading = ({ type, tagline }) => (
  <>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "0.75rem",
        marginTop: "1rem",
      }}
    >
      <img style={{ height: "2.5rem" }} src={getInventoryImage(type)} alt={type} />
      <div style={{ fontSize: "1.5rem", fontFamily: "'Syne Mono', monospace" }}>
        <b>{type}</b>
      </div>
    </div>
    <div
      style={{
        fontSize: "1.2rem",
        fontFamily: "'Syne Mono', monospace",
        textAlign: "center",
        color: "#7a6a58",
      }}
    >
      {tagline}
    </div>
  </>
);

ItemHeading.propTypes = {
  type: PropTypes.string.isRequired,
  tagline: PropTypes.string.isRequired,
};

const InstructionModal = (props) => {
  const { inventoryItems } = useInventory();
  const { unlocked: hasPopulatedWales } = useWorld();
  const hasCrown =
    inventoryItems.find((item) => item.type === CROWN) &&
    inventoryItems.find((item) => item.type === CROWN)?.count > 0;

  return (
    <Modal isOpen={props.show} onClose={props.onClose}>
      <div className="modal-header text">How to play</div>

      <div className="text" style={{ fontSize: "1.2rem", overflow: "auto" }}>
        <GameLoopDiagram />

        <p style={{ textAlign: "center" }}>
          Steal <img style={inline} src={Coins} alt="gold" /> gold from the
          fortress and get out with it. Do that enough times and you can buy the{" "}
          <img style={inline} src={Crown} alt="crown" /> <b>crown</b>, which is
          how you win.
        </p>

        <Step number={1} title="Shop">
          <ShopGraphic />
          <p>
            You can't carry gold without something to carry it in. Spend your{" "}
            <img style={inline} src={Coins} alt="gold" /> gold at the store on{" "}
            <b>sacks</b>. You start with two burlap ones, so you can skip
            straight to looting your first time.
          </p>
        </Step>

        <Step number={2} title="Bag">
          <BagOddsGraphic />
          <p>
            Every coin you drop in a sack is another chance it{" "}
            <b>bursts and spills everything</b>. That chance is the only real
            difference between the three, and it's why the good ones cost more.
          </p>
          <p>
            A <b>{BURLAP_SACK}</b> is cheap and nervous. A <b>{LEATHER_SACK}</b>{" "}
            is steadier. A <b>{BACKPACK}</b> will carry a fortune. Pick which one
            you're using before you start a haul.
          </p>
        </Step>

        <Step number={3} title="Loot">
          <LootGraphic />
          <p>
            Tap <b>Loot</b> to slip another coin into the sack. Tap it as many
            times as your nerve holds. If the sack bursts you lose that haul and
            the sack with it — the gold you've already banked at home is safe.
          </p>
        </Step>

        <Step number={4} title="Escape">
          <EscapeGraphic />
          <p>
            Walking out needs the <img style={inline} src={Key} alt="key" />{" "}
            <b>key</b>, and the key needs a <b>trivia question</b> about castles
            and fortresses. Answer it right and the whole haul goes in the bank.
            Answer it wrong and you're caught, and half of it (rounded down)
            buys your way out.
          </p>
        </Step>

        <Step number={5} title="Repeat">
          <CrownGraphic />
          <p>
            Bank the haul, buy a better sack, take a bigger risk. Keep going
            until you can afford the{" "}
            <img style={inline} src={Crown} alt="crown" /> <b>crown</b>.
          </p>
          {!hasCrown && (
            <p>
              <b>Oh, also...</b> when you think you've won, be sure to check the
              store out again. You might find more interesting stuff there.
            </p>
          )}
          {!hasCrown && (
            <p>
              <b>Good luck!</b>
            </p>
          )}
        </Step>

        {hasCrown && (
          <Unlocked title="Stage two">
            <p>
              There are some new items to find in the store that might make your
              journey a bit more exciting.
            </p>

            <ItemHeading type={ACCOMPLICE} tagline="A thieving multiplier" />
            <AccompliceGraphic />
            <p>
              Every time you loot, your <strong>accomplice</strong> does, too.
              Your <b>sack</b> can hold all the extra gold, too, without being
              any more likely to break. Oh, and you can have an unlimited amount
              of accomplices, working as multipliers for you while you{" "}
              <b>loot</b>.
            </p>

            <ItemHeading type={IPHONE} tagline="A Googling Device" />
            <IphoneGraphic />
            <p>
              Every time you answer your trivia question wrong, your{" "}
              <strong>iphone</strong> corrects you, because you should have been
              googling those anyway. Get caught with one and you keep the whole
              haul instead of half of it.
            </p>

            <ItemHeading type={WALES} tagline="Literally, the country of wales" />
            <WalesGraphic />
            <p>
              Yeah, you can buy <strong>wales</strong>. What other game lets you
              do that?
            </p>
            <p>
              Oh, and the population of Wales is 3.2 million people. Just an
              interesting hint.
            </p>
          </Unlocked>
        )}

        {hasPopulatedWales && (
          <Unlocked title="Ruling the world">
            <WorldGraphic />
            <p>
              You filled <b>wales</b> with 3.2 million accomplices, so the world
              map is open from the main menu.
            </p>
            <p>
              Pay a country's entry fee in{" "}
              <img style={inline} src={Coins} alt="gold" /> gold and station a{" "}
              <b>delegation</b> of accomplices there. They loot it in the
              background — a delegation the size of the country takes about a
              minute, half that size takes twice as long, and nothing ever falls
              in under five seconds.
            </p>
            <p>
              When a country is fully looted, its entire population joins your
              accomplices and its treasury joins your gold. That is how you
              afford the next one, and the one after that, all the way up to
              China.
            </p>
            <p>
              Accomplices stationed abroad don't multiply your hauls back at the
              fortress, so don't send everyone. You can <b>recall</b> a
              delegation at any time and the looting progress waits for them.
            </p>
            <p>
              Take every country and Wales is the only one left standing. That's
              the end of the game.
            </p>
          </Unlocked>
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
