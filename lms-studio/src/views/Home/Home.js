import React from 'react';
import './Home.css';
import { Navigate } from "react-router-dom";
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import { withAuthenticator } from '@aws-amplify/ui-react';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            courseToRedirect: null,
            courses: [],
        };
    }

    redirectToCourse(courseId) {
        this.setState({courseToRedirect: courseId});
    }

    render() {
        return !!this.state.courseToRedirect ?
            <Navigate to={'/course/' + this.state.courseToRedirect} /> :
            <div>
                <NavBar navigation={this.props.navigation} title="Cloud Academy"/>
                <div className='dashboard-main'>
                    Home Page Here<br/>
                    <a onClick={() => {this.redirectToCourse("ASD")}}>Click here to redirect to course "SAA"</a>
                </div>
                <Footer />
            </div>;
    }
}

export default withAuthenticator(Home);