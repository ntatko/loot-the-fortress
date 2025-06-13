import React, { useState } from "react";
import Button from "../core/Button";
import ButtonLink from "../core/ButtonLink";
import Inventory from "../common/Inventory";
import InstructionModal from "../common/InstructionModal";
import StartOverModal from "../common/StartOverModal";
import { useInventory } from "../../context/useInventory";
import { useGamepad } from "../../context/useGamepad";
import "./HomeMenu.css";

const HomeMenu = () => {
  const { inventoryItems } = useInventory();
  const { isConnected } = useGamepad();
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
