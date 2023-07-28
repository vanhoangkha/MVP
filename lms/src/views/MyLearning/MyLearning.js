import './MyLearning.css';
import React from 'react';
import { API } from 'aws-amplify';
import NavBar from '../../components/NavBar/NavBar';

import Footer from '../../components/Footer/Footer';
import MyLearningCourse from './MyLearningCourse';

import loadingGif from '../../assets/images/loading.gif';

export default class MyLearning extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            loading: true,
            courseToRedirect: null,
            mostRecentCourse: null,
            assignedCourses: [],
            selfEnrolledCourses: [],
        };
    }

    componentDidMount() {
        this.loadUserCourses();
    }

    loadUserCourses() {
        const apiName = 'courses';
        const path = '/users/courses';
        
        API.get(apiName, path)
            .then((response) => {
                let mostRecentCourse;
                let assignedCourses = [];
                let selfEnrolledCourses = [];
                response.forEach(course => {
                    let transformedCourse = {
                        id: course.CourseID,
                        lastAccessed: course.LastAccessed,
                        assignedBy: course.AssignedBy,
                    }

                    if (!!transformedCourse.assignedBy) {
                        assignedCourses.push(transformedCourse.id);
                    } else {
                        selfEnrolledCourses.push(transformedCourse.id);
                    }

                    if (!!transformedCourse.lastAccessed) {
                        if (!mostRecentCourse || mostRecentCourse.lastAccessed < transformedCourse.lastAccessed) {
                            mostRecentCourse = transformedCourse;
                        }
                    }
                });
                this.setState({
                    mostRecentCourse: mostRecentCourse.id,
                    assignedCourses: assignedCourses,
                    selfEnrolledCourses: selfEnrolledCourses,
                    loading: false,
                });
            })
            .catch((error) => {
                console.log(error.response);
            });
    }

    render() {
        return <div>
            <NavBar navigation={this.props.navigation}/>
            <div className='mylearning-wrapper'>
                {this.state.loading 
                    ? <div className='mylearning-main-container-loading'>
                        <img src={loadingGif} alt="loading..." className='mylearning-loading-gif-parent' />
                    </div> 
                    : <div className='mylearning-main-container'>
                        {!this.state.mostRecentCourse ? "" : <div>
                            <p className='mylearning-courses-header'>Recent activity</p>
                            <div className='mylearning-courses-header-decor' />
                            <MyLearningCourse courseId={this.state.mostRecentCourse} />
                        </div>}
                        <div>
                            <p className='mylearning-courses-header'>Assigned courses</p>
                            <div className='mylearning-courses-header-decor' />
                            {this.state.assignedCourses.length === 0
                                ? <div>You don't have any course assigned to you.</div>
                                : this.state.assignedCourses.map((course, index) => <MyLearningCourse key={index} courseId={course} />)
                            }
                        </div>
                        <div>
                            <p className='mylearning-courses-header'>Self-enrolled courses</p>
                            <div className='mylearning-courses-header-decor' />
                            {this.state.selfEnrolledCourses.length === 0
                                ? <div>
                                    You didn't enrolled any course.
                                    <div className='space-40'/>
                                </div>
                                : this.state.selfEnrolledCourses.map((course, index) => <MyLearningCourse key={index} courseId={course} />)
                            }
                        </div>
                    </div>}
            </div>
            <Footer />
        </div>;
    }
}