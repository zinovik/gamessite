import React, { Component, Props } from 'react';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';

import Header from '../../components/header';
import { Loading } from '../../components';
import { ZGamesApi } from '../../services';
import * as types from '../../constants';
import './index.css';

interface ProfilePageProps extends Props<{}> {
  currentUser: types.User,
  isConnected: boolean,
  allGames: types.Game[],
  usersOnline: types.User[],
  serverUrl: string,
}

class ProfilePage extends Component<ProfilePageProps, {}> {
  zGamesApi: ZGamesApi = ZGamesApi.Instance;

  render() {
    const { isConnected, currentUser, usersOnline, serverUrl } = this.props;

    if (!currentUser) {
      // TODO: Redirect
      return null;
    }

    const { username, email, firstName, lastName } = currentUser;

    return (
      <main className='profile-page-container'>
        <Header
          currentUsername={currentUser && currentUser.username}
          avatar={currentUser && currentUser.avatar}
          serverUrl={serverUrl}
          signUp={this.zGamesApi.register}
          signIn={this.zGamesApi.login}
          logOut={this.zGamesApi.logout}
          usersOnline={usersOnline}
        />

        <div className='profile-page-content'>
          <div className='profile-page-data'>
            <Typography variant='h5'>
              {username}
            </Typography>

            <Typography>
              {email}
            </Typography>

            <Typography>
              {`${firstName} ${lastName}`}
            </Typography>
          </div>
        </div>

        <Loading isConnected={isConnected} />
      </main>
    );
  }
}

const mapStateToProps = (state: { users: types.UsersState, games: types.GamesState, server: types.ServerState }) => {
  return {
    usersOnline: state.users.usersOnline,
    isConnected: state.users.isConnected,
    currentUser: state.users.currentUser,
    allGames: state.games.allGames,
    serverUrl: state.server.serverUrl,
  };
};

const mapDispatchToProps = {
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfilePage);
