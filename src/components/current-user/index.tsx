import React, { Fragment, MouseEvent, useState } from 'react';
import { string, func } from 'prop-types';
import { Avatar, Menu, MenuItem, Button } from '@material-ui/core';

import { UserUpdate } from './user-update';
import { IUser } from '../../interfaces';

import './index.scss';

export function CurrentUser({
  currentUsername,
  avatar,
  updateCurrentUser,
  logout,
}: {
  currentUsername: string;
  avatar: string;
  updateCurrentUser: (parameters: IUser) => void;
  logout: () => void;
}) {
  const [anchorEl, setAnchorEl] = useState(null as HTMLElement | null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUpdate = () => {
    setIsUpdating(true);

    handleMenuClose();
  };

  const handleLogOutClick = async () => {
    logout();

    handleMenuClose();
  };

  const close = () => {
    setIsUpdating(false);
  };

  return (
    <Fragment>
      <Button
        onClick={handleMenuOpen}
        aria-owns={anchorEl ? 'user-menu' : undefined}
        aria-haspopup="true"
        className="current-user-avatar"
      >
        <Avatar src={avatar}>{currentUsername[0]}</Avatar>
      </Button>

      <Menu id="user-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleUpdate}>Update</MenuItem>
        <MenuItem onClick={handleLogOutClick}>Log out</MenuItem>
      </Menu>

      {isUpdating && (
        <UserUpdate currentUsername={currentUsername} updateCurrentUser={updateCurrentUser} close={close} />
      )}
    </Fragment>
  );
}

CurrentUser.propTypes = {
  currentUsername: string.isRequired,
  avatar: string.isRequired,
  updateCurrentUser: func.isRequired,
  logout: func.isRequired,
};

CurrentUser.defaultProps = {
  currentUsername: '',
  avatar: '',
  updateCurrentUser: () => null,
  logout: () => null,
};
