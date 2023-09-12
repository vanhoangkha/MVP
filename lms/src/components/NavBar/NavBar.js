import React from 'react';
import { Auth } from 'aws-amplify';
import { Navigate } from "react-router-dom";
import { TopNavigation, Input } from "@cloudscape-design/components";
import { withTranslation } from 'react-i18next';
import AWSLogo from "./Logo"

export class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            authChecked: false,
            authenticated: false,
            redirectAuth: false,
            redirectHome: false,
            redirectMyLearning: false,
            user: null,
        };
    }

    componentDidMount() {
        Auth.currentAuthenticatedUser({
            // Optional, By default is false. If set to true, 
            // this call will send a request to Cognito to get the latest user data
            bypassCache: false
        }).then((user) => {
            this.setState({
                authChecked: true,
                authenticated: true,
                user: user
            })
        }).catch((err) => {
            this.setState({
                authChecked: true,
                authenticated: false
            })
        });
    }

    startAuthentication() {
        this.setState({
            redirectAuth: true
        })
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
        })
        if ( this.props.href != "/" ){
            this.setState({
                redirectHome: true,
            })
        }
    }

    onLanguageHandle = (event) => {
        let newLang = event.detail.id;
        this.props.i18n.changeLanguage(newLang)
    }
    
    render() {
        const {t} = this.props
        return this.state.redirectAuth ?
            <Navigate to="/auth" /> :
            this.state.redirectHome ? 
            <Navigate to="/" /> :
            this.state.redirectMyLearning ? 
            <Navigate to="/mylearning" /> :
            <div id="h" style={{ position: 'sticky', top: 0, zIndex: 1002 }}>
                <TopNavigation
                    identity={{
                        href: "/",
                        title: "Cloud Solutions Journey",
                        logo: {
                            src: AWSLogo,
                            alt: "AWS Logo"
                        }
                    }}
                    search={
                        <Input
                            type="search"
                            placeholder={t('nav.search')}
                            ariaLabel="Search"
                            onChange={() => {}}
                        />
                    }
                    utilities = {!this.state.authChecked ? [] : !this.state.authenticated ? [
                        {
                            type: "menu-dropdown",
                            text: t('nav.language.title'),
                            items: [
                                { 
                                    id: "vn", 
                                    text: t('nav.language.item-vn'),
                                },
                                { 
                                    id: "en", 
                                    text: t('nav.language.item-en'),
                                }
                            ],
                            onItemClick: (e) => this.onLanguageHandle(e)
                        },
                        {
                            type: "button",
                            text: t('nav.signIn'),
                            onClick: () => {
                                this.startAuthentication()
                            },
                        },
                        {
                            type: "button",
                            variant: "primary-button",
                            text: t('nav.signUp'),
                            onClick: () => {
                                this.startAuthentication()
                            },
                        }
                    ] : [
                        {
                            type: "menu-dropdown",
                            text: t('nav.language.title'),
                            items: [
                                { 
                                    id: "vn", 
                                    text: t('nav.language.item-vn'),
                                },
                                { 
                                    id: "eng", 
                                    text: t('nav.language.item-en'),
                                }
                            ],
                            onItemClick: (e) => this.onLanguageHandle(e)
                        },
                        {
                            type: "menu-dropdown",
                            text: this.state.user.attributes.email,
                            iconName: "user-profile",
                            items: [
                                { 
                                    id: "mylearning", 
                                    text: t('nav.user.learning'),
                                },
                                { 
                                    id: "signout", 
                                    text: t('nav.user.signOut'),
                                }
                            ],
                            onItemClick: (e) => {
                                if (e.detail.id === 'mylearning') {
                                    this.setState({
                                        redirectMyLearning: true,
                                    })
                                } else if (e.detail.id === 'signout') {
                                    this.startSignOut();
                                }
                            }
                        }
                    ]}
                />
            </div>
    }
}

export default withTranslation()(NavBar)