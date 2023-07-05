import React from 'react';
import './Home.css';
import { Navigate } from "react-router-dom";
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import { API } from 'aws-amplify';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            courseToRedirect: null,
            courses: [],
        };
    }

    componentDidMount() {
        const apiName = 'lmsStudio';
        const path = '/courses';
        
        API.get(apiName, path)
          .then((response) => {
            let transformedCourses = [];

            response.forEach(course => {
                transformedCourses.push({
                    id: course.ID,
                    name: course.Name,
                    categories: course.Categories,
                    tags: course.Tags,
                    level: course.Level,
                    length: course.Length,
                    description: course.Description
                });
            });

            this.setState({courses: transformedCourses});
          })
          .catch((error) => {
            console.log(error.response);
          });
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
                    Home Page Here :)<br/>
                    {this.state.courses.map(course => 
                        <a onClick={() => {this.redirectToCourse(course.id)}}>Click here to redirect to course <b>{course.name}</b><br/></a>
                    )}
                </div>
                <Footer />
            </div>;
    }
}

export default (Home);