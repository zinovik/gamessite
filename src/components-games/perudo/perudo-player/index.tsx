import React, { Fragment } from 'react';
import { arrayOf, number, bool } from 'prop-types';
import { Typography } from '@material-ui/core';

import { PerudoDices } from '../';

PerudoPlayer.propTypes = {
  dices: arrayOf(number),
  dicesCount: number,
  highlightNumber: number,
  highlightJoker: bool,
}

PerudoPlayer.defaultProps = {
  dices: [],
  dicesCount: 0,
}

export function PerudoPlayer({ dices, dicesCount, highlightNumber, highlightJoker }: {
  dices?: number[],
  dicesCount?: number,
  highlightNumber?: number,
  highlightJoker?: boolean,
}) {
  return (
    <Fragment>
      {dices && dices.length > 0 && <PerudoDices
        dices={dices}
        highlightNumber={highlightNumber}
        highlightJoker={highlightJoker}
      />}

      {!dices || !dices.length && <Typography>
        {dicesCount} dices
      </Typography>}
    </Fragment>
  );
}