import * as io from 'socket.io-client';

import {
  updateStatus,
  setCurrentUsername,
  updateUsersOnline,
  updateAllGames,
  updateOpenGame,
  updateOpenGameNumber,
} from '../../actions';
import * as types from '../../constants';

const SERVER_URL = ((window as any).envs && (window as any).envs.SERVER_URL) || 'http://localhost:4000';

export const GAMES_IMAGES: any = {
  'No, Thanks!': `${SERVER_URL}/images/No,%20Thanks!.png`,
  'Perudo': `${SERVER_URL}/images/Perudo.png`,
};
export const CHIP: string = '\u2B24';
export const DICES: string[] = [
  '\u2680',
  '\u2681',
  '\u2682',
  '\u2683',
  '\u2684',
  '\u2685',
];

export class ZGamesApi {
  private static instance: ZGamesApi;
  private socket;
  private store;
  private history;

  public static get Instance() {
    return this.instance || (this.instance = new this());
  }

  setStore = async store => {
    await fetch(`${SERVER_URL}/api`, { credentials: 'include' });

    this.socket = io(SERVER_URL);

    this.store = store;

    // updates from the server
    this.socket.on('connect_error', (): void => {
      console.log(`socket.on('connect_error')`);
      store.dispatch(updateStatus(false));
    });

    this.socket.on('connect', (): void => {
      console.log(`socket.on('connect')`);
      store.dispatch(updateStatus(true));
    });

    this.socket.on('updateCurrentUsername', (currentUsername: string): void => {
      console.log(`socket.on('updateCurrentUsername'): ${currentUsername}`);
      store.dispatch(setCurrentUsername(currentUsername));
      this.updateOpenGameNumber();
    });

    this.socket.on('updateUsersOnline', (usersOnline: types.UserOnline[]): void => {
      console.log(`socket.on('updateUsersOnline'): `, usersOnline);
      this.store.dispatch(updateUsersOnline(usersOnline))
      this.updateOpenGameNumber();
    });

    this.socket.on('updateAllGamesInfo', (allGames: types.Game[]): void => {
      console.log(`socket.on('updateAllGamesInfo'): `, allGames);
      store.dispatch(updateAllGames(allGames));
    });

    this.socket.on('updateOpenGameInfo', (openGame: types.Game): void => {
      console.log(`socket.on('updateOpenGameInfo'): `, openGame);
      store.dispatch(updateOpenGame(openGame));
    });

    this.socket.emit('getCurrentUsername');
    this.socket.emit('getAllGamesInfo');
    this.socket.emit('getUsersOnline');
    this.socket.emit('getOpenGameInfo');
  }

  setHistory = history => {
    this.history = history;
  }

  // Accounts
  register = (username: string, password: string): void => {
    this.socket.emit('register', username, password);
  };

  login = (username: string, password: string): void => {
    this.socket.emit('authorize', username, password);
  };

  logout = (): void => {
    this.socket.emit('logout');
  };


  joinGame = (gameNumber: number): void => {
    this.socket.emit('joingame', gameNumber);
  }

  leaveGame = (): void => {
    this.socket.emit('leavegame');
  }

  readyToGame = (): void => {
    this.socket.emit('readytogame');
  }

  startGame = (): void => {
    this.socket.emit('startgame');
  }

  move = (move: { takeCard?: boolean, number?: number, figure?: number, notBelieve?: boolean }): void => {
    this.socket.emit('move', move);
  }

  message = (message: string): void => {
    this.socket.emit('message', message);
  }

  newGame = (gameName: string): void => {
    this.socket.emit('newgame', gameName);
  }

  updateOpenGameNumber = (): void => {
    const { currentUsername, usersOnline } = this.store.getState().users;

    if (!currentUsername || !usersOnline.length) {
      return this.history.push(`/games`);
    }

    usersOnline.forEach((userOnline) => {
      if (userOnline.username === currentUsername) {
        this.store.dispatch(updateOpenGameNumber(userOnline.openGameNumber));

        if (userOnline.openGameNumber || userOnline.openGameNumber === 0) {
          return this.history.push(`/game/${userOnline.openGameNumber}`);
        }

        this.history.push(`/games`);
      }
    });
  };
}
