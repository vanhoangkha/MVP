import React from 'react';
import './Footer.css';

export default class Footer extends React.Component {
    render() {
        return <div className='footer'>
            <div className='footer-div footer-div-left'>
                <a href='/'>Feedback</a>
            </div>
            <div className='footer-div footer-div-right'>
                <span>©2023, Amazon Web Services, Inc. or its affilites</span>
                <a href='/'>Privacy</a>
                <a href='/'>Term</a>
                <a href='/'>Cookies preferences</a>
            </div>
        </div>
    }
}