import React from 'react';
import { Auth } from 'aws-amplify';
import { Navigate } from 'react-router-dom';
import { TopNavigation, Input } from '@cloudscape-design/components';
import AWSLogo from './Logo';

export default class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authChecked: false,
      authenticated: false,
      redirectAuth: false,
      user: null,
    };
  }

  componentDidMount() {
    Auth.currentAuthenticatedUser({
      // Optional, By default is false. If set to true,
      // this call will send a request to Cognito to get the latest user data
      bypassCache: false,
    })
      .then((user) => {
        this.setState({
          authChecked: true,
          authenticated: true,
          user: user,
        });
      })
      .catch((err) => {
        this.setState({
          authChecked: true,
          authenticated: false,
        });
      });
  }

  startAuthentication() {
    this.setState({
      redirectAuth: true,
    });
  }

  async startSignOut() {
    try {
      await Auth.signOut();
    } catch (error) {
      console.log('error signing out: ', error);
      Auth.userHasAuthenticated(false);
    }

    this.setState({
      authChecked: true,
      authenticated: false,
    });
  }

  render() {
    return this.state.redirectAuth ? (
      <Navigate to="/auth" />
    ) : (
      <div
        id="h"
        style={{ position: 'sticky', top: 0, zIndex: 1002 }}
      >
        <TopNavigation
          identity={{
            href: '/',
            title: 'AWS Cloud Academy Studio',
            logo: {
              src: AWSLogo,
              alt: 'AWS Logo',
            },
          }}
          search={
            <Input
              type="search"
              placeholder="Search"
              ariaLabel="Search"
              onChange={() => {}}
            />
          }
          utilities={
            !this.state.authChecked
              ? []
              : !this.state.authenticated
              ? [
                  {
                    type: 'button',
                    text: 'Sign in',
                    onClick: () => {
                      this.startAuthentication();
                    },
                  },
                  {
                    type: 'button',
                    variant: 'primary-button',
                    text: 'Sign up',
                    onClick: () => {
                      this.startAuthentication();
                    },
                  },
                ]
              : [
                  {
                    type: 'menu-dropdown',
                    text: this.state.user.attributes.email,
                    iconName: 'user-profile',
                    items: [
                      {
                        id: 'signout',
                        text: 'Sign out',
                      },
                    ],
                    onItemClick: (e) => {
                      if (e.detail.id === 'signout') {
                        this.startSignOut();
                      }
                    },
                  },
                ]
          }
        />
      </div>
    );
  }
}
