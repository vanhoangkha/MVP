import React from 'react';
import './Course.css';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import { API } from 'aws-amplify';


class Course extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            course: {},
        };
    }

    componentDidMount() {
        const apiName = 'lmsStudio';
        const path = '/courses/' + window.location.href.split('/')[4];
        
        API.get(apiName, path)
        .then((response) => {
            this.setState({course: {
                id: response.ID,
                name: response.Name,
                categories: response.Categories,
                tags: response.Tags,
                level: response.Level,
                length: response.Length,
                description: response.Description,
                whatToLearn: response.WhatToLearn,
                requirements: response.Requirements,
                chapters: response.Chapters,
            }});
        })
        .catch((error) => {
            console.log(error.response);
        });
    }

    render() {
        return <div>
            <NavBar navigation={this.props.navigation} title="Cloud Academy"/>
            <div className='course-main'>
                Displaying Course with ID {window.location.href.split('/')[4]}<br/>
                {JSON.stringify(this.state.course)}
            </div>
            <Footer />
        </div>;
    }
}

export default (Course);