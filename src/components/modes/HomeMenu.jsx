import React, { useState } from "react";
import Button from "../core/Button";
import ButtonLink from "../core/ButtonLink";
import Inventory from "../common/Inventory";
import InstructionModal from "../common/InstructionModal";
import StartOverModal from "../common/StartOverModal";
import { useInventory } from "../../context/useInventory";
import { useGamepad } from "../../context/useGamepad";
import { useWorld } from "../../context/useWorld";
import { COUNTRIES } from "../../assets/countries";
import "./HomeMenu.css";

const HomeMenu = () => {
  const { inventoryItems } = useInventory();
  const { isConnected } = useGamepad();
  const { unlocked, conqueredCount, deployedAccomplices } = useWorld();
  const [firstTime, setFirstTime] = useState(
    JSON.parse(localStorage.getItem("firstTime"))
  );
  const [quitConfirm, setQuitConfirm] = useState(false);

  return (
    <div className="home-container">
      <div className="home-title">
        Loot the Fortress
        {isConnected && <span className="gamepad-indicator">*</span>}
      </div>
      <ButtonLink to="/theft">Go Looting</ButtonLink>
      <ButtonLink to="/inventory">Stock Up</ButtonLink>
      {unlocked && <ButtonLink to="/world">Rule the World</ButtonLink>}
      {unlocked && (
        <div className="home-world-status">
          {`${conqueredCount}/${COUNTRIES.length} countries Welsh`}
          {deployedAccomplices > 0 && " · delegations are out looting"}
        </div>
      )}
      <Inventory inventoryItems={inventoryItems} />
      <InstructionModal
        show={firstTime}
        onClose={() => {
          setFirstTime(false);
          localStorage.setItem("firstTime", JSON.stringify(false));
        }}
      />
      <Button onClick={() => setFirstTime(true)}>Instructions</Button>
      <Button onClick={() => setQuitConfirm(true)}>Start Over</Button>
      {quitConfirm && <StartOverModal onClose={() => setQuitConfirm(false)} />}
    </div>
  );
};

export default HomeMenu;
