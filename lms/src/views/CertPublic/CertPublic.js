import React from 'react';
// import './Cert.css';
import { API } from 'aws-amplify';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';

import loadingGif from '../../assets/images/loading.gif';

export default class CertPublic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cert: null,
        };
    }

    componentDidMount() {
        this.loadCert();
    }

    loadCert() {
        const apiName = 'courses';
        const path = '/certs/' + window.location.hash.split('/')[2];
        
        API.get(apiName, path)
            .then((response) => {
                this.setState({
                    cert: response,
                });
            })
            .catch((error) => {
                console.log(error.response);
            });
    }

    render() {
        let cert = this.state.cert;

        return <div>
            <NavBar navigation={this.props.navigation}/>
            <div className='cert-wrapper'>
                {!cert
                ? <div><img src={loadingGif} alt="loading..." className='cert-loading-gif' /></div>
                : <div className='cert-course'>
                    <div className='cert-view'>
                        {!this.state.cert 
                            ? <img src={loadingGif} alt="loading..." className='cert-view-loading-gif' />
                            : <div className='publiccert-view-container'>
                                <div>{cert.UserEmail}</div>
                            </div>}
                    </div>
                </div>}
            </div>
            <Footer />
        </div>;
    };
}