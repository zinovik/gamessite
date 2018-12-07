import React, { Fragment } from 'react';
import { array, string } from 'prop-types';

import { GamePlayer } from '../../components';
import * as types from '../../constants';
import './index.css';

GamePlayers.propTypes = {
  gameName: string.isRequired,
  currentUserId: string.isRequired,
  playersInGame: array.isRequired,
  players: array.isRequired,
  nextPlayers: array.isRequired,
}

GamePlayers.defaultProps = {
  gameName: '',
  currentUserId: 'user-id',
  playersInGame: [],
  players: [],
  nextPlayers: [],
}

export function GamePlayers({ gameName, currentUserId, playersInGame, players, nextPlayers }: {
  gameName: string,
  currentUserId: string,
  playersInGame: types.PlayerInGame[],
  players: types.User[],
  nextPlayers: types.User[],
}) {
  let playerNumber;

  playersInGame.forEach((player, index) => {
    if (player.id === currentUserId) {
      playerNumber = index;
    }
  });

  const playersCopy = playersInGame.slice();
  const playersBefore = playersCopy.splice(0, playerNumber);

  return (
    <div className='game-players-container'>
      {[...playersCopy, ...playersBefore].map((playerInGame: types.PlayerInGame, index: number) => (
        <Fragment key={index}>
          {playerInGame.id !== currentUserId && <Fragment key={index}>

            <GamePlayer
              gameName={gameName}
              username={players.find(player => player.id === playerInGame.id)!.username}
              cards={playerInGame.cards || []}
              dicesCount={playerInGame.dicesCount || 0}
              active={nextPlayers.some(nextPlayer => nextPlayer.id === playerInGame.id)}
            />

          </Fragment>}
        </Fragment>
      ))}
    </div>
  );
}
