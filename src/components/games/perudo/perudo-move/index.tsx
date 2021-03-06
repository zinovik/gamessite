import React, { Fragment, useState } from 'react';
import { object, bool, func } from 'prop-types';
import { Button, Typography, FormControlLabel, Checkbox } from '@material-ui/core';
import {
  countDices,
  calculateStartBet,
  countMinNumber,
  countMaxNumber,
  countMinFigure,
  countMaxFigure,
  numberInc,
  numberDec,
  figureInc,
  figureDec,
  IPerudoData,
  IPerudoMove,
} from 'z-games-perudo';

import { PerudoDices } from '../perudo-dices';
import { IGame } from '../../../../interfaces';

import './index.scss';

export function PerudoMove({
  game,
  isMaputoAble,
  isButtonsDisabled,
  makeMove,
}: {
  game: IGame;
  isMaputoAble: boolean;
  isButtonsDisabled: boolean;
  makeMove: (parameters: { gameId: string; move: string }) => void;
}) {
  const [diceNumber, setDiceNumber] = useState(0);
  const [diceFigure, setDiceFigure] = useState(0);
  const [isBetImpossible, setIsBetImpossible] = useState(false);
  const [isMaputo, setIsMaputo] = useState(false);
  const [oldGameData, setOldGameData] = useState('');

  const { gameData } = game;
  const { currentDiceNumber, currentDiceFigure, isMaputoRound, players: gamePlayers }: IPerudoData = JSON.parse(
    gameData,
  );
  const allDicesCount = countDices(gamePlayers);

  if (gameData !== oldGameData) {
    const {
      diceNumber: newDiceNumber,
      diceFigure: newDiceFigure,
      isBetImpossible: newIsBetImpossible,
    } = calculateStartBet({
      currentDiceNumber,
      currentDiceFigure,
      allDicesCount,
      isMaputoRound,
    });

    setDiceNumber(newDiceNumber);
    setDiceFigure(newDiceFigure);
    setIsBetImpossible(newIsBetImpossible || false);

    setOldGameData(gameData);
  }

  const handleNumberInc = (): void => {
    const { diceNumber: newDiceNumber } = numberInc(diceNumber);

    setDiceNumber(newDiceNumber);
  };

  const handleNumberDec = (): void => {
    const { diceNumber: newDiceNumber, diceFigure: newDiceFigure } = numberDec({
      diceNumber,
      diceFigure,
      currentDiceNumber,
      currentDiceFigure,
    });

    setDiceNumber(newDiceNumber);
    setDiceFigure(newDiceFigure);
  };

  const handleFigureInc = (): void => {
    const { diceNumber: newDiceNumber, diceFigure: newDiceFigure } = figureInc({
      diceNumber,
      diceFigure,
      currentDiceNumber,
      currentDiceFigure,
      allDicesCount,
    });

    setDiceNumber(newDiceNumber);
    setDiceFigure(newDiceFigure);
  };

  const handleFigureDec = (): void => {
    const { diceNumber: newDiceNumber, diceFigure: newDiceFigure } = figureDec({
      diceNumber,
      diceFigure,
      currentDiceNumber,
      currentDiceFigure,
      allDicesCount,
    });

    setDiceNumber(newDiceNumber);
    setDiceFigure(newDiceFigure);
  };

  const moveBet = (): void => {
    let perudoMove: IPerudoMove;

    if (isMaputoAble) {
      perudoMove = {
        number: diceNumber,
        figure: diceFigure,
        isMaputo,
      } as IPerudoMove;
    } else {
      perudoMove = { number: diceNumber, figure: diceFigure } as IPerudoMove;
    }

    makeMove({ gameId: game.id, move: JSON.stringify(perudoMove) });
  };

  const moveNotBelieve = (): void => {
    const perudoMove: IPerudoMove = { notBelieve: true } as IPerudoMove;

    makeMove({ gameId: game.id, move: JSON.stringify(perudoMove) });
  };

  const handleMaputoChange = (): void => {
    setIsMaputo(!isMaputo);
  };

  const myBetNumberDecDisable = diceNumber <= countMinNumber({ currentDiceNumber, currentDiceFigure, isMaputoRound });
  const myBetNumberIncDisable = diceNumber >= countMaxNumber({ allDicesCount });
  const myBetFigureDecDisable = diceFigure <= countMinFigure({ currentDiceNumber, currentDiceFigure, allDicesCount });
  const myBetFigureIncDisable = diceFigure >= countMaxFigure({ currentDiceNumber, currentDiceFigure, allDicesCount });

  return (
    <div className="perudo-my-bet">
      <Typography>My bet</Typography>

      <PerudoDices dices={Array(diceNumber).fill(diceFigure)} />

      <Typography>Dice number</Typography>
      <Typography>
        <Button onClick={handleNumberDec} disabled={myBetNumberDecDisable}>
          -
        </Button>
        {diceNumber}
        <Button onClick={handleNumberInc} disabled={myBetNumberIncDisable}>
          +
        </Button>
      </Typography>

      {!isMaputoRound && (
        <Fragment>
          <Typography>Dice figure</Typography>
          <Typography>
            <Button onClick={handleFigureDec} disabled={myBetFigureDecDisable}>
              -
            </Button>
            {diceFigure}
            <Button onClick={handleFigureInc} disabled={myBetFigureIncDisable}>
              +
            </Button>
          </Typography>
        </Fragment>
      )}

      {isMaputoAble && (
        <Typography>
          <FormControlLabel control={<Checkbox onChange={handleMaputoChange} />} label="Maputo" />
        </Typography>
      )}

      <Typography className="perudo-move-buttons">
        <Button
          variant="contained"
          color="primary"
          className="perudo-move-button"
          onClick={moveBet}
          disabled={isBetImpossible || isButtonsDisabled}
        >
          Bet
        </Button>
        <Button
          variant="contained"
          color="primary"
          className="perudo-move-button"
          onClick={moveNotBelieve}
          disabled={!currentDiceNumber || !currentDiceFigure || isButtonsDisabled}
        >
          Not Believe
        </Button>
      </Typography>
    </div>
  );
}

PerudoMove.propTypes = {
  game: object.isRequired,
  isMaputoAble: bool.isRequired,
  isButtonsDisabled: bool.isRequired,
  makeMove: func.isRequired,
};

PerudoMove.defaultProps = {
  game: {},
  isMaputoAble: false,
  isButtonsDisabled: false,
  makeMove: () => null,
};
