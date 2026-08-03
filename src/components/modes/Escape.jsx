import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { getTriviaQuestion } from "../../assets/fortressTrivia";
import TriviaAnswerButton from "../core/TriviaAnswerButton";
import Key from "../../assets/key.svg";
import Gold from "../../assets/gold_coins.svg";
import ButtonLink from "../core/ButtonLink";
import { getInventoryImage, GOLD, IPHONE } from "../common/Inventory";
import { useInventory } from "../../context/useInventory";
import "./Escape.css";
import Modal from "../core/Modal";
import { formatCount } from "../../utils/format";

const Escape = () => {
  const location = useLocation();
  const [question, setQuestion] = useState(getTriviaQuestion);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const { inventoryItems, updateInventory } = useInventory();

  const answerQuestion = (answer) => {
    if (answer.correct) {
      setCorrectCount(correctCount + 1);
    } else {
      setIncorrectCount(incorrectCount + 1);
    }
    setQuestion(getTriviaQuestion(question));
  };

  const renderQuestion = () => {
    return (
      <div>
        <div className="escape-question">{question.question}</div>
        <div className="escape-answers">
          {question.answers.map((answer) => (
            <TriviaAnswerButton
              key={answer.text}
              onClick={() => answerQuestion(answer)}
            >
              <div className="escape-answer">
                <img src={Key} alt={"Key"} />
                <div>{answer.text}</div>
              </div>
            </TriviaAnswerButton>
          ))}
        </div>
      </div>
    );
  };

  const hasIphone =
    inventoryItems.find((item) => item.type === IPHONE)?.count > 0 ?? false;

  return (
    <div className="escape-container">
      <div className="escape-content">
        <div className="escape-title">
          Escape with{" "}
          <img className="escape-gold-icon" src={Gold} alt={"stuff"} />{" "}
          {formatCount(location.state?.amount || 0)}
        </div>

        {renderQuestion()}
      </div>

      <Modal isOpen={correctCount >= 1}>
        <div className="modal-header">You escaped!</div>
        <div className="modal-text">
          Put your{" "}
          <img alt="gold currency" className="modal-gold-icon" src={Gold} />
          {formatCount(location.state?.amount || 0)} in the bank.
        </div>
        <ButtonLink
          to="/"
          onClick={() => {
            updateInventory(GOLD, location.state?.amount || 0);
          }}
        >
          Go Home
        </ButtonLink>
      </Modal>

      <Modal isOpen={incorrectCount >= 1 && !hasIphone}>
        <div className="modal-header">Uh oh!</div>
        <div className="modal-text">
          You got caught. Better cough up{" "}
          <img alt="gold currency" className="modal-gold-icon" src={Gold} />{" "}
          your new "associate's" cut (
          <img
            alt="gold currency"
            className="modal-gold-icon"
            src={Gold}
          />{" "}
          {formatCount(
            location.state?.amount ? Math.floor(location.state?.amount / 2) : 0
          )}
          ).
        </div>
        <ButtonLink
          to="/"
          onClick={() =>
            updateInventory(GOLD, Math.floor(location.state?.amount / 2) || 0)
          }
        >
          Pay them off
        </ButtonLink>
      </Modal>

      <Modal isOpen={incorrectCount >= 1 && hasIphone}>
        <div className="modal-header">Just phoning it in</div>
        <div className="modal-text">
          You got caught, but clearly rules don't apply to people who{" "}
          <b>
            spend <i>that much</i>
          </b>{" "}
          on{" "}
          <img
            alt="iphone"
            src={getInventoryImage(IPHONE)}
            className="modal-gold-icon"
          />{" "}
          apples. Keep the lot (
          <img
            alt="gold currency"
            src={Gold}
            className="modal-gold-icon"
          />{" "}
          {formatCount(location.state?.amount || 0)}
          ). Just ask Siri for the answer next time.
        </div>
        <ButtonLink
          to="/"
          onClick={() => updateInventory(GOLD, location.state?.amount || 0)}
        >
          🤷 Whatever
        </ButtonLink>
      </Modal>
    </div>
  );
};

export default Escape;
