import React, { useState } from "react";
import Button from "../core/Button";
import ButtonLink from "../core/ButtonLink";
import Modal from "../core/Modal";
import WorldGovernmentModal from "../common/WorldGovernmentModal";
import Wales from "../../assets/wales.svg";
import Coins from "../../assets/gold_coins.svg";
import { ACCOMPLICE, GOLD, getInventoryImage } from "../common/Inventory";
import { useInventory } from "../../context/useInventory";
import { useWorld } from "../../context/useWorld";
import {
  COUNTRIES,
  conquestReward,
  delegationPrice,
  fastestDelegation,
  tapsToFall,
} from "../../assets/countries";
import { formatCount } from "../../utils/format";
import "./World.css";

const World = () => {
  const { inventoryItems } = useInventory();
  const {
    delegationFor,
    deployDelegation,
    recallDelegation,
    conqueredCount,
    welshPopulation,
    deployedAccomplices,
    isWorldWelsh,
    sawEnding,
    acknowledgeEnding,
  } = useWorld();
  const [target, setTarget] = useState(null);

  const countOf = (type) =>
    inventoryItems.find((item) => item.type === type)?.count ?? 0;
  const availableAccomplices = countOf(ACCOMPLICE);
  const gold = countOf(GOLD);

  return (
    <div className="world-container">
      <div className="world-header">
        <div className="world-title">
          <img className="world-title-flag" src={Wales} alt="Wales" />
          The Welsh World Government
        </div>
        <div className="world-subtitle">
          {isWorldWelsh
            ? "Every flag on earth is a dragon. Job done."
            : `${conqueredCount} of ${COUNTRIES.length} countries have gone Welsh.`}
        </div>
        <div className="world-stats">
          <WorldStat
            image={Wales}
            label="under Welsh rule"
            value={formatCount(welshPopulation)}
          />
          <WorldStat
            image={getInventoryImage(ACCOMPLICE)}
            label="at home"
            value={formatCount(availableAccomplices)}
          />
          <WorldStat
            image={getInventoryImage(ACCOMPLICE)}
            label="abroad"
            value={formatCount(deployedAccomplices)}
          />
          <WorldStat image={Coins} label="in the treasury" value={formatCount(gold)} />
        </div>
        <ButtonLink to="/">Back to the Fortress</ButtonLink>
        {deployedAccomplices > 0 && !isWorldWelsh && (
          <div className="world-hint">
            Your delegations only loot when you do. Go tap <b>Loot</b>.
          </div>
        )}
      </div>

      <div className="world-countries">
        {COUNTRIES.map((country) => (
          <CountryCard
            key={country.id}
            country={country}
            entry={delegationFor(country.id)}
            onDeploy={() => setTarget(country)}
            onRecall={() => recallDelegation(country.id)}
          />
        ))}
      </div>

      {target && (
        <DeployModal
          country={target}
          entry={delegationFor(target.id)}
          availableAccomplices={availableAccomplices}
          gold={gold}
          onCancel={() => setTarget(null)}
          onConfirm={(size) => {
            deployDelegation(target.id, size);
            setTarget(null);
          }}
        />
      )}

      <WorldGovernmentModal
        show={isWorldWelsh && !sawEnding}
        welshPopulation={welshPopulation}
        onClose={acknowledgeEnding}
      />
    </div>
  );
};

export default World;

const WorldStat = (props) => (
  <div className="world-stat">
    <img className="world-stat-image" src={props.image} alt={props.label} />
    <div className="world-stat-value">{props.value}</div>
    <div className="world-stat-label">{props.label}</div>
  </div>
);

const CountryCard = ({ country, entry, onDeploy, onRecall }) => {
  const percent = Math.min(100, Math.floor(entry.progress * 100));
  const isLooting = entry.delegation > 0 && !entry.conquered;

  return (
    <div className={`country-card ${entry.conquered ? "welsh" : ""}`}>
      <div className="country-header">
        {entry.conquered ? (
          // The Welsh flag emoji is a tag sequence that a lot of platforms
          // won't draw, and this one ends up on every card.
          <img className="country-flag-image" src={Wales} alt="Wales" />
        ) : (
          <span className="country-flag">{country.flag}</span>
        )}
        <div className="country-name">{country.name}</div>
      </div>

      <div className="country-population">
        {`${formatCount(country.population)} people`}
      </div>

      {entry.conquered ? (
        <div className="country-status welsh-status">Welsh.</div>
      ) : (
        <>
          <div className="country-progress">
            <div className="country-progress-bar" style={{ width: `${percent}%` }} />
            <div className="country-progress-label">{`${percent}% looted`}</div>
          </div>

          {isLooting ? (
            <>
              <div className="country-status">
                {`${formatCount(entry.delegation)} delegates · ${tapsToFall(
                  country,
                  entry.delegation,
                  entry.progress
                )} more taps`}
              </div>
              <div className="country-actions">
                <Button onClick={onDeploy}>Reinforce</Button>
                <Button onClick={onRecall}>Recall</Button>
              </div>
            </>
          ) : (
            <>
              <div className="country-status">
                {entry.paid ? (
                  "Bought and waiting. Nobody is looting it."
                ) : (
                  <>
                    <img className="country-price-icon" src={Coins} alt="gold" />
                    {` ${formatCount(delegationPrice(country))} to get in the door`}
                  </>
                )}
              </div>
              <div className="country-actions">
                <Button onClick={onDeploy}>Send delegation</Button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

const DeployModal = ({
  country,
  entry,
  availableAccomplices,
  gold,
  onCancel,
  onConfirm,
}) => {
  const price = entry.paid ? 0 : delegationPrice(country);
  const canAfford = gold >= price;
  // Default to as fast as this country can possibly fall, or everyone you have.
  const overwhelming = fastestDelegation(country);
  const [size, setSize] = useState(
    Math.min(availableAccomplices, overwhelming)
  );

  const total = entry.delegation + size;
  const valid = size > 0 && size <= availableAccomplices && canAfford;

  const preset = (fraction) =>
    Math.max(1, Math.floor(availableAccomplices * fraction));

  return (
    <Modal isOpen={true} onClose={onCancel}>
      <div className="modal-header text">{`${country.flag} ${country.name}`}</div>

      <div className="text deploy-body">
        <p>
          Station a delegation in <b>{country.name}</b> and they loot the place
          every time you tap <b>Loot</b> back at the fortress. When the looting
          is done, all {formatCount(country.population)} of them are Welsh, and
          your delegation comes home with them.
        </p>

        <div className="deploy-figures">
          <div>
            <img className="deploy-icon" src={Coins} alt="gold" />
            {` Entry fee: ${price === 0 ? "already paid" : formatCount(price)}`}
          </div>
          <div>
            <img
              className="deploy-icon"
              src={getInventoryImage(ACCOMPLICE)}
              alt={ACCOMPLICE}
            />
            {` Available: ${formatCount(availableAccomplices)}`}
          </div>
          <div>
            <img className="deploy-icon" src={Coins} alt="gold" />
            {` Treasury on victory: +${formatCount(conquestReward(country))}`}
          </div>
        </div>

        <input
          className="deploy-slider"
          type="range"
          min={1}
          max={Math.max(1, availableAccomplices)}
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
        />

        <div className="deploy-size">{`${formatCount(size)} delegates`}</div>

        <div className="deploy-presets">
          <Button onClick={() => setSize(preset(0.1))}>10%</Button>
          <Button onClick={() => setSize(preset(0.5))}>50%</Button>
          <Button onClick={() => setSize(preset(1))}>All</Button>
          <Button
            disabled={availableAccomplices < country.population}
            onClick={() => setSize(country.population)}
          >
            Match them
          </Button>
          <Button
            disabled={availableAccomplices < overwhelming}
            onClick={() => setSize(overwhelming)}
          >
            Overwhelm
          </Button>
        </div>

        <div className="deploy-eta">
          {valid
            ? `Falls after ${tapsToFall(country, total, entry.progress)} taps of Loot`
            : canAfford
            ? "You don't have that many accomplices."
            : "You can't afford the entry fee."}
        </div>
      </div>

      <div className="modal-actions">
        <Button disabled={!valid} onClick={() => onConfirm(size)}>
          Send them
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
      </div>
    </Modal>
  );
};
