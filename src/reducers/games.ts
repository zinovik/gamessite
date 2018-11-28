import * as types from '../constants';

const initialState = {
  allGames: [],
  openGame: null,
  openGameNumber: null,
};

const games = (state: types.GamesState = initialState, action): types.GamesState => {

  switch (action.type) {

    case types.UPDATE_ALL_GAMES:
      return {
        ...state,
        allGames: [...action.allGames],
      };

    case types.UPDATE_OPEN_GAME:
      if (action.openGame) {
        return {
          ...state,
          openGame: { ...action.openGame },
        };
      }
      return {
        ...state,
        openGame: null,
      };

    case types.ADD_NEW_LOG:
      if (state.openGame) {
        return {
          ...state,
          openGame: {
            ...state.openGame,
            logs: [
              action.newLog,
              ...state.openGame.logs,
            ]
          },
        };
      }
      return state;

    case types.ADD_NEW_GAME:
      return {
        ...state,
        allGames: [
          action.newGame,
          ...state.allGames,
        ],
      };

    case types.UPDATE_GAME:
      const allGames = state.allGames.map(game => game.number === action.game.number ? action.game : { ...game });
      return {
        ...state,
        allGames,
      };

    default:
      return state;

  }

}

export default games;
