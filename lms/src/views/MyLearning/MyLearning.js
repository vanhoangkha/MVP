import './MyLearning.css';
import React from 'react';
import NavBar from '../../components/NavBar/NavBar';
import { AppLayout } from '@cloudscape-design/components';

export default class MyLearning extends React.Component {
    render() {
        return <div>
            <NavBar navigation={this.props.navigation}/>
            <AppLayout/>
        </div>;
    }
}