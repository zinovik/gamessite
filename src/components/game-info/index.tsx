import React, { Fragment, useState } from 'react';
import { object, string, bool, func, array } from 'prop-types';
import { Button, Typography } from '@material-ui/core';
import { Lock } from '@material-ui/icons';
import { GAME_NOT_STARTED, GAME_STARTED, GAME_FINISHED, BaseGame } from 'z-games-base-game';

import { GameRules } from '../game-rules';
import { GameOptions } from './game-options';
import { NewInvite } from './new-invite';
import { GameMoveTime } from './game-move-time';
import { GamesServices } from '../../services';
import { IGame, GamePlayerType, GameDataType, IUser } from '../../interfaces';

import './index.scss';

export function GameInfo({
  game,
  currentUserId,
  isButtonsDisabled,
  users,
  closeGame,
  leaveGame,
  readyToGame,
  startGame,
  updateRemovingGame,
  repeatGame,
  updateOption,
  newInvite,
}: {
  game: IGame;
  currentUserId: string;
  isButtonsDisabled: boolean;
  users: IUser[];
  closeGame: () => void;
  leaveGame: (gameId: string) => void;
  readyToGame: () => void;
  startGame: (gameId: string) => void;
  updateRemovingGame: (gameId: string) => void;
  repeatGame: (gameId: string) => void;
  updateOption: (parameters: { gameId: string, name: string, value: string }) => void;
  newInvite: (parameters: { gameId: string; userId: string; }) => void;
}) {
  const [isRulesShown, setIsRulesShown] = useState(false);

  const handleLogoClick = () => {
    setIsRulesShown(true);
  };

  const handleRulesClose = () => {
    setIsRulesShown(false);
  };

  const handleCloseClick = () => {
    closeGame();
  };

  const handleLeaveClick = () => {
    leaveGame(game.id);
  };

  const handleReadyClick = () => {
    readyToGame();
  };

  const handleStartClick = () => {
    startGame(game.id);
  };

  const handleRemoveClick = () => {
    updateRemovingGame(game.id);
  };

  const handleRepeatClick = () => {
    repeatGame(game.id);
  };

  const { playersOnline, watchersOnline, isPrivate, nextPlayers, previousMoveAt } = game;
  const gameDataParsed: GameDataType = JSON.parse(game.gameData);
  const { players: gamePlayers }: { players: GamePlayerType[] } = gameDataParsed;

  const maxTimeOption = gameDataParsed.options.find(option => option.name === 'Max Time');
  const maxTime = BaseGame.getMaxTimeVariants()[maxTimeOption!.value];

  const isAbleToStart = game.players.length >= game.playersMin
    && game.players.length <= game.playersMax
    && gamePlayers.every(gamePlayer => gamePlayer.ready);

  const isAccessToRemove = game.createdBy && game.createdBy.id === currentUserId;

  const isAccessToRepeat = gamePlayers.some(gamePlayer => gamePlayer.id === currentUserId);

  return (
    <div>
      <div className='game-info-container'>
        <Typography>
          <img
            src={`/images/${GamesServices[game.name].getNameWork()}.png`}
            className='game-info-img'
            onClick={handleLogoClick}
            title={`click to see ${game.name} game rules`}
            alt='game logo'
          />
        </Typography>

        <div className='game-info-players'>

          <Typography>
            {isPrivate && <Lock />} #{game.number}: {game.name}
          </Typography>

          {game.state === GAME_NOT_STARTED && <Typography>
            ({game.playersMin} min, {game.playersMax} max)
          </Typography>}

          {gamePlayers.map((gamePlayer, index) => (
            <Typography key={index}>

              {playersOnline.some(playerOnline => playerOnline.id === gamePlayer.id) ?
                <span className='player-online-dot game-green-dot' /> :
                <span className='player-online-dot game-red-dot' />
              }

              {game.state === GAME_NOT_STARTED && (gamePlayer.ready ?
                <span className='player-ready-dot game-green-dot' /> :
                <span className='player-ready-dot game-yellow-dot' />)
              }

              {game.players.find(player => player.id === gamePlayer.id) && game.players.find(player => player.id === gamePlayer.id)!.username}

              {nextPlayers.some(nextPlayer => nextPlayer.id === gamePlayer.id)
                && <img src='/images/sandglass.gif' alt='sandglass' className='sandglass' />}

            </Typography>
          ))}

          {watchersOnline.map((watcher, index) => (
            <Typography key={index}>
              <span className='player-dot game-green-dot' />
              {watcher.username}
            </Typography>
          ))}
        </div>

        <div className='game-info-buttons'>
          {isAccessToRemove && <Button onClick={handleRemoveClick} disabled={isButtonsDisabled}>Remove</Button>}

          <Button onClick={handleCloseClick} disabled={isButtonsDisabled}>Close</Button>

          {isAccessToRepeat && game.state === GAME_FINISHED && <Button onClick={handleRepeatClick} disabled={isButtonsDisabled}>Repeat</Button>}

          {game.state === GAME_NOT_STARTED && <Button onClick={handleLeaveClick} disabled={isButtonsDisabled}>Leave</Button>}

          {game.state === GAME_NOT_STARTED && <Fragment>
            <Button onClick={handleReadyClick} disabled={isButtonsDisabled}>
              {gamePlayers.find(gamePlayer => gamePlayer.id === currentUserId)!.ready ? 'Not Ready' : 'Ready'}
            </Button>

            <Button onClick={handleStartClick} disabled={!isAbleToStart || isButtonsDisabled}>Start</Button>
          </Fragment>}
        </div>

        {isRulesShown && <GameRules gameName={game.name} close={handleRulesClose} />}
      </div>

      {game.state === GAME_STARTED && <GameMoveTime
        previousMoveAt={previousMoveAt}
        maxTime={maxTime}
      />}

      {gameDataParsed.options && gameDataParsed.options.length > 0 && <GameOptions
        game={game}
        isButtonsDisabled={isButtonsDisabled || game.state !== GAME_NOT_STARTED}
        updateOption={updateOption}
      />}

      {game.state === GAME_NOT_STARTED && <NewInvite
        currentUserId={currentUserId}
        gameId={game.id}
        users={users}
        newInvite={newInvite}
      />}
    </div>
  );
}

GameInfo.propTypes = {
  game: object.isRequired,
  currentUserId: string.isRequired,
  isButtonsDisabled: bool.isRequired,
  users: array.isRequired,
  closeGame: func.isRequired,
  leaveGame: func.isRequired,
  readyToGame: func.isRequired,
  startGame: func.isRequired,
  updateRemovingGame: func.isRequired,
  updateOption: func.isRequired,
  newInvite: func.isRequired,
};

GameInfo.defaultProps = {
  game: {},
  currentUserId: '',
  isButtonsDisabled: false,
  users: [],
  closeGame: () => null,
  leaveGame: () => null,
  readyToGame: () => null,
  startGame: () => null,
  updateRemovingGame: () => null,
  repeatGame: () => null,
  updateOption: () => null,
  newInvite: () => null,
};
