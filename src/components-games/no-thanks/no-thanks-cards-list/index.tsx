import React from 'react';
import { arrayOf, number } from 'prop-types';

import { NoThanksCard } from '../';
import './index.css';

NoThanksCardsList.propTypes = {
  cards: arrayOf(number).isRequired,
}

NoThanksCardsList.defaultProps = {
  cards: [],
}

export function NoThanksCardsList({ cards }: { cards: number[] }) {
  return (
    <div className='no-thanks-cards-list-container'>
      {cards.map((card, index) => (
        <NoThanksCard card={card} dim={index !== 0 && card === cards[index - 1] + 1} key={index} />
      ))}
    </div>
  );
};