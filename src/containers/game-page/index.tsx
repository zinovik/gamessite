import React from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { Paper } from '@material-ui/core';
import { GAME_STARTED } from 'z-games-base-game';

import { GameInfo } from '../../components/game-info';
import { GameTable } from '../../components/game-table';
import { Chat } from '../../components/chat';
import {
  closeGame as closeGameWithoutDispatch,
  leaveGame as leaveGameWithoutDispatch,
  readyToGame as readyToGameWithoutDispatch,
  startGame as startGameWithoutDispatch,
  sendMessage as sendMessageWithoutDispatch,
  makeMove as makeMoveWithoutDispatch,
} from '../../actions';
import { IUser, IGame, IState } from '../../interfaces';

import './index.scss';

function GamePagePure({ currentUser, game, isButtonsDisabled, closeGame, leaveGame, readyToGame, startGame, sendMessage, makeMove }: {
  currentUser: IUser,
  game: IGame,
  isButtonsDisabled: boolean,
  closeGame: (gameNumber: number) => void,
  leaveGame: (gameNumber: number) => void,
  readyToGame: (gameNumber: number) => void,
  startGame: (gameNumber: number) => void,
  sendMessage: ({ gameId, message }: { gameId: string, message: string }) => void,
  makeMove: ({ gameNumber, move }: { gameNumber: number, move: string }) => void,
}) {
  if (!currentUser || !game) {
    return null;
  }

  return (
    <main>
      <div className='game-page-container'>
        <div className={`game-page-table${game.state === GAME_STARTED ? '' : ' game-page-table-not-started'}`}>
          <GameTable
            game={game}
            currentUser={currentUser}
            isButtonsDisabled={isButtonsDisabled}
            makeMove={makeMove}
          />
        </div>

        <div className='game-page-info-chat-container'>
          <div className='game-page-info-container'>
            <Paper className='game-page-info'>
              <GameInfo
                game={game}
                currentUserId={currentUser.id}
                isButtonsDisabled={isButtonsDisabled}
                closeGame={closeGame}
                leaveGame={leaveGame}
                readyToGame={readyToGame}
                startGame={startGame}
              />
            </Paper>
          </div>

          <div className='game-page-chat-container'>
            <Paper className='game-page-chat'>
              <Chat
                logs={game.logs}
                gameId={game.id}
                sendMessage={sendMessage}
              />
            </Paper>
          </div>
        </div>
      </div>
    </main>
  );
}

const mapStateToProps = (state: IState) => ({
  currentUser: state.users.currentUser,
  game: state.games.openGame,
  isButtonsDisabled: state.users.isButtonsDisabled,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  closeGame: bindActionCreators(closeGameWithoutDispatch, dispatch),
  leaveGame: bindActionCreators(leaveGameWithoutDispatch, dispatch),
  readyToGame: bindActionCreators(readyToGameWithoutDispatch, dispatch),
  startGame: bindActionCreators(startGameWithoutDispatch, dispatch),
  sendMessage: bindActionCreators(sendMessageWithoutDispatch, dispatch),
  makeMove: bindActionCreators(makeMoveWithoutDispatch, dispatch),
});

export const GamePage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(GamePagePure);
