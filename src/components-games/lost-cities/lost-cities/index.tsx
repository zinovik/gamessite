import React, { Fragment, useState } from 'react';
import { object, bool, func } from 'prop-types';
import { Button, Typography } from '@material-ui/core';
import { LostCitiesData } from 'z-games-lost-cities';

import * as types from '../../../constants';

import './index.css';

export function LostCities({ game, currentUser, isMyTurn, move }: {
	game: types.IGame,
	currentUser: types.IUser,
	isMyTurn: boolean,
	move: (move: string) => void,
}) {
	const [isButtonsDisabled, setIsButtonsDisabled] = useState(false);
	const [oldGameData, setOldGameData] = useState('');

	const { gameData } = game;

	if (gameData !== oldGameData) {
		setIsButtonsDisabled(false);
		setOldGameData(gameData);
	}

	const movePay = (): void => {
		move(JSON.stringify({ takeCard: false }));

		setIsButtonsDisabled(true);
	};

	const moveTake = (): void => {
		move(JSON.stringify({ takeCard: true }));

		setIsButtonsDisabled(true);
	};

	if (!currentUser) {
		return null;
	}

	const { cards, discards, cardsLeft, players: playersInGame }: LostCitiesData = JSON.parse(gameData);

	const currentPlayerInGame = playersInGame.find(playerInGame => playerInGame.id === currentUser.id);
	const myChips = currentPlayerInGame && currentPlayerInGame;

	return (
		<Fragment>

			<Typography>
				Cards left: {cardsLeft}
			</Typography>

			<Typography>
				Cards: {cards.join(', ')}
			</Typography>

			<Typography>
				Discards: {discards.join(', ')}
			</Typography>

			{isMyTurn && <div className='lost-cities-buttons'>
				<Button variant='contained' color='primary' className='lost-cities-button' onClick={movePay} disabled={!myChips || isButtonsDisabled}>
					Pay
				</Button>
				<Button variant='contained' color='primary' className='lost-cities-button' onClick={moveTake} disabled={isButtonsDisabled}>
					Take
				</Button>
			</div>}
		</Fragment>
	);
};

LostCities.propTypes = {
	game: object.isRequired,
	currentUser: object.isRequired,
	isMyTurn: bool.isRequired,
	move: func.isRequired,
};

LostCities.defaultProps = {
	game: {},
	currentUser: {},
	isMyTurn: false,
	move: () => console.log,
};
