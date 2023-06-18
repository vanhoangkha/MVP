import React from 'react';
import './Course.css';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import { withAuthenticator } from '@aws-amplify/ui-react';


class Course extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            course: null,
        };
    }

    render() {
        return <div>
            <NavBar navigation={this.props.navigation} title="Cloud Academy"/>
            <div className='course-main'>
                Displaying Course with ID {window.location.href.split('/')[4]}
            </div>
            <Footer />
        </div>;
    }
}

export default withAuthenticator(Course);