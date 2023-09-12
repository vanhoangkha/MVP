import React, { useState, useEffect, useRef } from "react";
import "./Learn.css";
import "video-react/dist/video-react.css";
import { API, Auth, Storage } from "aws-amplify";
import { Helmet } from "react-helmet";
import NavBar from "../../components/NavBar/NavBar";
import {
  AppLayout,
  BreadcrumbGroup,
  SideNavigation,
  Toggle,
  Button,
  RadioGroup,
  Alert,
  Checkbox,
} from "@cloudscape-design/components";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { csv } from "csvtojson";
import Papa from "papaparse";

import {
  Player,
  LoadingSpinner,
  BigPlayButton,
  ControlBar,
  ReplayControl,
  ForwardControl,
  PlaybackRateMenuButton,
  VolumeMenuButton,
  FullscreenToggle,
} from "video-react";

import {
  IoChevronBack,
  IoChevronForward,
  IoExpand,
  IoContract,
  IoClose,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoTimeOutline,
  IoEllipseSharp,
  IoCheckmarkSharp,
} from "react-icons/io5";
import { Navigate } from "react-router-dom";

import loadingGif from "../../assets/images/loading.gif";

const DEBUG = true;
const MAX_ANSWERS = 6;
const landingPageUrl = "https://dev.dfpjafbqllhh1.amplifyapp.com/";

function PageMetadata(props) {
  return (
    <Helmet>
      <title>{props.courseName}</title>
    </Helmet>
  );
}

function LoadingContainer() {
  return (
    <div fluid="true" className="learn-parent-loading">
      <img src={loadingGif} alt="loading..." className="learn-loading-gif" />
    </div>
  );
}

function ContentLoading() {
  return (
    <div className="learn-player-loading">
      <img src={loadingGif} alt="loading..." className="learn-loading-gif" />
    </div>
  );
}

function LectureContent(props) {
  switch (props.lecture.lecture.type) {
    case "Video":
      return (
        <VideoContent
          videoSrc={props.lecture.lecture.content}
          setTimeLeft={props.setTimeLeft}
          handleFullScreen={props.handleFullScreen}
          handleVideoEnded={props.handleVideoEnded}
          lectureId={props.lecture.lecture.id}
          countView={props.countView}
        />
      );
    case "Workshop":
      return (
        <LabContent
          desc={props.lecture.lecture.workshopDesc}
          url={props.lecture.lecture.workshopUrl}
          architect={props.lecture.lecture.content}
          openLink={props.openLink}
          countView={props.countView}
          markLectureCompleted={props.markLectureCompleted}
        />
      );
    case "Document":
      return (
        <DocumentContent
          desc={props.lecture.lecture.desc}
          url={props.lecture.lecture.content}
          openLink={props.openLink}
        />
      );
    case "Survey":
      return (
        <SurveyContent
          desc={props.lecture.lecture.desc}
          url={props.lecture.lecture.content}
          openLink={props.openLink}
          name={props.lecture.lecture.name}
        />
      );
    case "Quiz":
      return (
        <QuizContent
          desc={props.lecture.lecture.desc}
          url={props.lecture.lecture.content}
          // openLink={props.openLink}
          name={props.lecture.lecture.name}
          // questions={props.lecture.lecture.questions}
          nextLecture={props.nextLecture}
          markLectureCompleted={props.markLectureCompleted}
          setQuestionLength={props.setQuestionLength}
          countView={props.countView}
        />
      );
    default:
      return <></>;
  }
}

class VideoContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoSrc: null,
      updateView: false,
      // uploading: false,
    };
    this.uploadingRef = React.createRef();
    this.uploadingRef.current = false;
  }

  componentDidMount() {
    this.getVideoURL(this.props.videoSrc);
    this.player.subscribeToStateChange(this.handleStateChange.bind(this));
    this.player.actions.toggleFullscreen = () => {
      this.props.handleFullScreen();
    };
  }

  handleStateChange(state) {
    this.props.setTimeLeft(Math.floor(state.duration - state.currentTime));
    if (state.ended) this.props.handleVideoEnded();
    // if (!this.uploadingRef.current && !this.state.updateView && state.currentTime / state.duration > 0.05) {
    //   this.countView()
    // }
    if (state.currentTime / state.duration > 0.05) {
      this.props.countView();
    }
  }

  // countView() {
  //   this.uploadingRef.current = true;
  //   let lectureId = this.props.lectureId
  //   const apiName = "courses";
  //   const path = "/lectures/" + lectureId;
  //   API.put(apiName, path, { body: {} })
  //     .then((response) => {
  //       this.setState((prevState) => ({ ...prevState, updateView: true }));
  //       this.uploadingRef.current = false;
  //       console.log(this.state.updateView);
  //     })
  //     .catch((error) => {
  //       console.log(error.response);
  //       this.uploadingRef.current = false;
  //     });
  // }

  getVideoURL = async (key) => {
    const signedURL = await Storage.get(key, { level: "public" });
    this.setState({ videoSrc: signedURL });
  };

  render() {
    return (
      <Player
        ref={(player) => {
          this.player = player;
        }}
        className="learn-transparent-player"
        autoPlay
        playsInline
        fluid={false}
        height="100%"
        width="100%"
        src={this.state.videoSrc}
      >
        <LoadingSpinner />
        <BigPlayButton position="center" />
        <ControlBar>
          <ReplayControl seconds={5} order={2.1} />
          <ForwardControl seconds={5} order={2.2} />
          <PlaybackRateMenuButton
            rates={[2, 1.5, 1.25, 1, 0.9, 0.75]}
            order={7}
          />
          <VolumeMenuButton order={8} />
          <FullscreenToggle disabled />
        </ControlBar>
      </Player>
    );
  }
}

function LabContent(props) {
  const [architectUrl, setArchitecUrl] = useState("");
  useEffect(() => {
    Storage.get(props.architect, { level: "public" }).then((res) =>
      setArchitecUrl(res)
    );
    props.countView();
    props.markLectureCompleted()
  });
  return (
    <div className="learn-lab-content-container">
      <>
        <div className="learn-lab-content-desc">{props.desc}</div>
        <div className="learn-lab-content-link">
          <button
            onClick={() => {
              props.openLink(props.url);
            }}
          >
            {props.url}
          </button>
        </div>
        <div className="learn-lab-architech" style={{ textAlign: "center" }}>
          <img src={architectUrl} />
        </div>
      </>
    </div>
  );
}

function DocumentContent(props) {
  return (
    <div className="learn-lab-content-container">
      <div className="learn-lab-content-desc">{props.desc}</div>
      <div className="learn-lab-content-link">
        <button
          onClick={() => {
            props.openLink(props.url);
          }}
        >
          {props.url}
        </button>
      </div>
    </div>
  );
}

function SurveyContent(props) {
  return (
    <div className="learn-lab-content-container">
      <div className="learn-lab-content-desc">{props.desc}</div>
      <div className="learn-lab-content-link">
        <button
          onClick={() => {
            props.openLink(props.url);
          }}
        >
          {props.url}
        </button>
      </div>
    </div>
  );
}

class QuizContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: null,
      quizStarted: false,
      quizDone: false,
      quizPassed: false,
      currentQuestionAnswered: false,
      currentQuestion: 0,
      selectedAnswer: null,
      selectedMultiAnswer: [],
      checkedAnswer: Array(6).fill(false),
      correctedAnswer: 0,
    };
  }

  convertCSVtoJSON = async (key) => {
    var commonConfig = { delimiter: ";" };
    const signedURL = await Storage.get(key, { level: "public" });
    // const response = await fetch(signedURL);

    // console.log(response)
    // const responseJson = await response.json();
    // const responseJson = await csv().fromStream(response);

    Papa.parse(signedURL, {
      ...commonConfig,
      header: true,
      download: true,
      complete: (result) => {
        this.setState({ questions: Array.from(result.data) });
        this.props.setQuestionLength(result.data.length);
        console.log(result.data)
        // this.convertJSONToObject(result.data)
      },
    });
  };

  getAnswerRadio = () => {
    let answers = [];
    for (let i = 0; i < 6; i++) {
      if (this.state.questions[this.state.currentQuestion][`A${i}`]) {
        answers.push({
          value: i,
          label: this.state.questions[this.state.currentQuestion][`A${i}`],
          disable: this.state.currentQuestionAnswered,
        });
      }
    }
    return answers;
  };

  getAnswerCheckBox = () => {
    const checkboxGroup = [];
    for (let i = 0; i < 6; i++) {
      if (this.state.questions[this.state.currentQuestion][`A${i}`]) {
        checkboxGroup.push(
          <Checkbox
            onChange={({ detail }) => {
              let preChecked = this.state.checkedAnswer;
              preChecked[i] = detail.checked;
              this.setState({ checkedAnswer: preChecked });
              this.setState((prevState) => ({
                selectedMultiAnswer: [...prevState.selectedMultiAnswer, i],
              }));
              console.log(this.state.checkedAnswer);
            }}
            checked={this.state.checkedAnswer[i]}
            disabled={this.state.currentQuestionAnswered}
          >
            {this.state.questions[this.state.currentQuestion][`A${i}`]}
          </Checkbox>
        );
      }
    }
    return checkboxGroup;
  };

  checkAnswer = () => {
    if (
      this.state.questions[
        this.state.currentQuestion
      ].Multichoice.localeCompare("1") === 0
    ) {
      let i = 0, j = 0;
      while (i < this.state.selectedMultiAnswer.length && j < MAX_ANSWERS) {
        if (
          this.state.selectedMultiAnswer[i] ===
          parseInt(this.state.questions[this.state.currentQuestion][`C${j}`])
        ) {
          i++;
          j++;
        } else {
          return false;
        }
      }

      if (
        j < MAX_ANSWERS - 1 &&
        this.state.questions[this.state.currentQuestion][`C${j}`]
      ) {
        return false;
      }

      if (
        i < this.state.selectedMultiAnswer.length - 1 &&
        this.state.selectedMultiAnswer[i]
      ) {
        return false;
      }

      return true;
    } else {
      if (
        this.state.selectedAnswer ===
        parseInt(this.state.questions[this.state.currentQuestion]["C0"])
      ) {
        return true;
      }

      return false;
    }
  };
  componentDidMount() {
    this.convertCSVtoJSON(this.props.url);
    this.props.countView();
  }

  render() {
    // let questions = this.props.questions;
    // console.log(questions)
    // console.log(
    //   !!this.state.selectedAnswer
    //     ? questions[this.state.currentQuestion].answers[
    //         this.state.selectedAnswer
    //       ].correct
    //     : "Hihi"
    // );

    return (
      <div className="learn-lab-content-container learn-lab-content-container-quiz">
        {/* <div className="learn-lab-content-desc learn-lab-content-quiz">
          {!this.state.quizStarted ? (
            <div className="learn-lab-content-question">{this.props.desc}</div>
          ) : this.state.quizDone ? (
            this.state.quizPassed ? (
              <div className="learn-lab-content-question">
                Congratulation! You passed the quiz.
              </div>
            ) : (
              <div className="learn-lab-content-question">
                Unfortunately you didn't pass. Keep trying!
              </div>
            )
          ) : !this.state.currentQuestionAnswered ? (
            <div>
              <div className="learn-lab-content-question">
                {questions[this.state.currentQuestion].question}
              </div>
              <RadioGroup
                onChange={({ detail }) =>
                  this.setState({ selectedAnswer: detail.value })
                }
                value={this.state.selectedAnswer}
                items={questions[this.state.currentQuestion].answers.map(
                  (answer, index) => {
                    return {
                      value: index,
                      label: answer.text,
                    };
                  }
                )}
              />
            </div>
          ) : (
            <div>
              <Alert
                statusIconAriaLabel="Success"
                type={
                  questions[this.state.currentQuestion].answers[
                    this.state.selectedAnswer
                  ].correct
                    ? "success"
                    : "error"
                }
              >
                {
                  questions[this.state.currentQuestion].answers[
                    this.state.selectedAnswer
                  ].explain
                }
              </Alert>
              <div className="space-20" />
              <div className="learn-lab-content-question">
                {questions[this.state.currentQuestion].question}
              </div>
              <RadioGroup
                onChange={({ detail }) =>
                  this.setState({ selectedAnswer: detail.value })
                }
                value={this.state.selectedAnswer}
                items={questions[this.state.currentQuestion].answers.map(
                  (answer, index) => {
                    return {
                      value: index,
                      label: answer.text,
                      disabled: true,
                    };
                  }
                )}
              />
            </div>
          )}
        </div>
        <div className="learn-lab-quiz-control">
          <div className="learn-lab-quiz-control-left">
            {this.state.quizStarted && !this.state.quizDone
              ? "Question " +
                (this.state.currentQuestion + 1) +
                "/" +
                this.props.questions.length
              : ""}
          </div>
          <div className="learn-lab-quiz-control-right">
            {!this.state.quizStarted ? (
              <Button
                variant="primary"
                className="btn-orange"
                onClick={() =>
                  this.setState({
                    quizStarted: true,
                    quizDone: false,
                    quizPassed: false,
                    currentQuestionAnswered: false,
                    currentQuestion: 0,
                    selectedAnswer: null,
                    correctedAnswer: 0,
                  })
                }
              >
                Start Quiz
              </Button>
            ) : this.state.quizDone ? (
              this.state.quizPassed ? (
                <Button
                  variant="primary"
                  className="btn-orange"
                  onClick={() => {
                    this.props.markLectureCompleted();
                    this.props.nextLecture();
                  }}
                >
                  Finish
                </Button>
              ) : (
                <Button
                  variant="primary"
                  className="btn-orange"
                  onClick={() =>
                    this.setState({ quizStarted: false, quizDone: false })
                  }
                >
                  Retry
                </Button>
              )
            ) : !this.state.currentQuestionAnswered ? (
              <Button
                variant="primary"
                className="btn-orange"
                onClick={() => {
                  if (this.state.selectedAnswer !== null)
                    this.setState({ currentQuestionAnswered: true });
                }}
              >
                Answer
              </Button>
            ) : (
              <Button
                variant="primary"
                className="btn-orange"
                onClick={() => {
                  let currentQuestion = this.state.currentQuestion;
                  let nextQuestion = this.state.currentQuestion + 1;
                  let correctedAnswer =
                    this.state.correctedAnswer +
                    (questions[currentQuestion].answers[
                      this.state.selectedAnswer
                    ].correct ===
                      true);

                  this.setState({ correctedAnswer: correctedAnswer });

                  console.log(correctedAnswer);

                  if (nextQuestion >= this.props.questions.length) {
                    this.setState({
                      quizDone: true,
                      quizPassed: correctedAnswer === questions.length,
                    });
                  } else {
                    this.setState({
                      currentQuestion: nextQuestion,
                      currentQuestionAnswered: false,
                      selectedAnswer: null,
                    });
                  }
                }}
              >
                Next
              </Button>
            )}
          </div>
        </div> */}
        <div className="learn-lab-content-desc learn-lab-content-quiz">
          {!this.state.quizStarted ? (
            <div className="learn-lab-content-question">{this.props.desc}</div>
          ) : this.state.quizDone ? (
            this.state.quizPassed ? (
              <div className="learn-lab-content-question">
                Congratulation! You passed the quiz.
              </div>
            ) : (
              <div className="learn-lab-content-question">
                Unfortunately you didn't pass. Keep trying!
              </div>
            )
          ) : !this.state.currentQuestionAnswered ? (
            <div>
              <div className="learn-lab-content-question">
                {this.state.questions[this.state.currentQuestion].Question}
              </div>
              {this.state.questions[
                this.state.currentQuestion
              ].Multichoice.localeCompare("1") < 0 ? (
                <div>
                  <RadioGroup
                    onChange={
                      ({ detail }) =>
                        this.setState({ selectedAnswer: detail.value })
                      // console.log(detail.value)
                    }
                    value={this.state.selectedAnswer}
                    // items={this.getAnswerRadio()}
                    items={(() => {
                      let answers = [];
                      for (let i = 0; i < 6; i++) {
                        if (
                          this.state.questions[this.state.currentQuestion][
                            `A${i}`
                          ]
                        ) {
                          answers.push({
                            value: i,
                            label:
                              this.state.questions[this.state.currentQuestion][
                                `A${i}`
                              ],
                          });
                        }
                      }
                      console.log(answers);
                      return answers;
                    })()}
                  />
                </div>
              ) : (
                this.getAnswerCheckBox()
              )}
            </div>
          ) : (
            <div>
              <Alert
                statusIconAriaLabel="Success"
                type={this.checkAnswer() ? "success" : "error"}
              >
                {this.state.questions[
                  this.state.currentQuestion
                ].Multichoice.localeCompare("1") === 0
                  ? this.state.selectedMultiAnswer.map(
                      (ans) =>
                        <div >
                          {this.state.questions[this.state.currentQuestion][`E${ans}`]}
                        </div>
                    )
                  : this.state.questions[this.state.currentQuestion][
                      `E${this.state.selectedAnswer}`
                    ]}
              </Alert>
              <div className="space-20" />
              <div className="learn-lab-content-question">
                {this.state.questions[this.state.currentQuestion].Question}
              </div>
              {this.state.questions[
                this.state.currentQuestion
              ].Multichoice.localeCompare("1") < 0 ? (
                <RadioGroup
                  onChange={({ detail }) =>
                    this.setState({ selectedAnswer: detail.value })
                  }
                  value={this.state.selectedAnswer}
                  items={this.getAnswerRadio()}
                />
              ) : (
                this.getAnswerCheckBox()
              )}
            </div>
          )}
        </div>
        <div className="learn-lab-quiz-control">
          <div className="learn-lab-quiz-control-left">
            {this.state.quizStarted && !this.state.quizDone
              ? "Question " +
                (this.state.currentQuestion + 1) +
                "/" +
                this.state.questions.length
              : ""}
          </div>
          <div className="learn-lab-quiz-control-right">
            {!this.state.quizStarted ? (
              <Button
                variant="primary"
                className="btn-orange"
                onClick={() =>
                  this.setState({
                    quizStarted: true,
                    quizDone: false,
                    quizPassed: false,
                    currentQuestionAnswered: false,
                    currentQuestion: 0,
                    selectedAnswer: null,
                    selectedMultiAnswer: [],
                    checkedAnswer: Array(6).fill(false),
                    correctedAnswer: 0,
                  })
                }
              >
                Start Quiz
              </Button>
            ) : this.state.quizDone ? (
              this.state.quizPassed ? (
                <Button
                  variant="primary"
                  className="btn-orange"
                  onClick={() => {
                    this.props.markLectureCompleted();
                    this.props.nextLecture();
                  }}
                >
                  Finish
                </Button>
              ) : (
                <Button
                  variant="primary"
                  className="btn-orange"
                  onClick={() =>
                    this.setState({ quizStarted: false, quizDone: false })
                  }
                >
                  Retry
                </Button>
              )
            ) : !this.state.currentQuestionAnswered ? (
              <Button
                variant="primary"
                className="btn-orange"
                onClick={() => {
                  if (
                    this.state.selectedAnswer !== null ||
                    this.state.selectedMultiAnswer.length > 0
                  )
                    this.setState({ currentQuestionAnswered: true });
                }}
              >
                Answer
              </Button>
            ) : (
              <Button
                variant="primary"
                className="btn-orange"
                onClick={() => {
                  let currentQuestion = this.state.currentQuestion;
                  let nextQuestion = this.state.currentQuestion + 1;
                  let correctedAnswer = this.state.correctedAnswer;
                  correctedAnswer += this.checkAnswer() ? 1 : 0;
                  this.setState({
                    correctedAnswer: correctedAnswer,
                  });

                  console.log(correctedAnswer);

                  if (nextQuestion >= this.state.questions.length) {
                    this.setState({
                      quizDone: true,
                      quizPassed:
                        correctedAnswer === this.state.questions.length,
                    });
                  } else {
                    this.setState({
                      currentQuestion: nextQuestion,
                      currentQuestionAnswered: false,
                      selectedAnswer: null,
                    });
                  }
                }}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

function MainContent(props) {
  const handle = useFullScreenHandle();
  const [fullscreen, setFullscreen] = useState(false);
  const [autoNext, setAutoNext] = useState(true);
  const [timeLeft, setTimeLeft] = useState(100);
  const [updateView, setUpdateView] = useState(false);
  const uploadingRef = useRef(false);

  // console.log("updateView", updateView)
  const countView = async () => {
    if (!updateView && !uploadingRef.current) {
      uploadingRef.current = true;
      let lectureId = props.lecture.lecture.id;
      const apiName = "courses";
      const path = "/lectures/" + lectureId;
      API.put(apiName, path, { body: {} })
        .then((response) => {
          console.log("count view done");
          setUpdateView(true);
          uploadingRef.current = false;
          props.countViewForCourse();
        })
        .catch((error) => {
          uploadingRef.current = false;
          console.log(error);
        });
    }
  };

  useEffect(() => {
    setUpdateView(false);
  }, [props.lecture]);

  return (
    <FullScreen handle={handle}>
      <div
        className={
          fullscreen
            ? "learn-content-parent full-screen"
            : "learn-content-parent"
        }
      >
        <div className="learn-content-main">
          {props.loading ? (
            <ContentLoading />
          ) : (
            <LectureContent
              lecture={props.lecture}
              openLink={(url) => {
                setFullscreen(false);
                window.open(url, "_blank").focus();
              }}
              setTimeLeft={(timeLeft) => {
                setTimeLeft(timeLeft);
              }}
              handleFullScreen={() => {
                if (fullscreen) handle.exit();
                else handle.enter();
                setFullscreen(!fullscreen);
              }}
              handleVideoEnded={() => {
                props.markLectureCompleted();
                if (autoNext && !props.isLast) {
                  setTimeLeft(100);
                  props.nextLecture();
                }
              }}
              nextLecture={props.nextLecture}
              markLectureCompleted={props.markLectureCompleted}
              setQuestionLength={props.setQuestionLength}
              countView={countView}
            />
          )}
        </div>
        <div className="learn-content-control">
          <div className="learn-content-control-left">
            {props.isFirst ? (
              <button
                className="learn-content-control-btn content-control-btn-disabled"
                disabled
              >
                <IoChevronBack />
              </button>
            ) : (
              <button
                className="learn-content-control-btn"
                onClick={props.prevLecture}
              >
                <IoChevronBack />
              </button>
            )}
            {props.isLast ? (
              <button
                className="learn-content-control-btn content-control-btn-disabled"
                disabled
              >
                <IoChevronForward />
              </button>
            ) : (
              <button
                className="learn-content-control-btn"
                onClick={props.nextLecture}
              >
                <IoChevronForward />
              </button>
            )}
            <Toggle
              Todo
              className="learn-auto-next-control"
              id="toggle-check"
              type="checkbox"
              variant="outline-secondary"
              checked={autoNext}
              onChange={(e) => setAutoNext(!autoNext)}
            >
              Auto Next
              {autoNext ? (
                <IoCheckmarkCircleOutline className="learn-auto-next-control-icon" />
              ) : (
                <IoCloseCircleOutline className="learn-auto-next-control-icon" />
              )}
            </Toggle>
          </div>
          <div className="learn-content-control-right">
            <button
              className="learn-content-control-btn"
              onClick={() => {
                if (fullscreen) handle.exit();
                else handle.enter();
                setFullscreen(!fullscreen);
              }}
            >
              {fullscreen ? <IoContract /> : <IoExpand />}
            </button>
          </div>
        </div>
        {autoNext && !props.isLast && timeLeft !== null && timeLeft <= 5 ? (
          <div className="learn-next-lecture">
            <div className="learn-next-lecture-count">{timeLeft}</div>
            <div className="learn-next-lecture-right">
              <div>
                <div className="learn-next-lecture-header">Next</div>
                <button
                  className="learn-next-lecture-cancel"
                  onClick={() => {
                    setAutoNext(false);
                  }}
                >
                  <IoClose />
                </button>
              </div>
              <div className="learn-next-lecture-name">
                {props.nextLectureName}
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </FullScreen>
  );
}

export default class Learn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: null,
      loading: true,
      course: null,
      lecture: {
        chapterId: 0,
        lectureId: 0,
        lecture: null,
      },
      questionsLength: 0,
      nextLectureName: "",
      completedLectures: [],
    };
  }

  getHashParams() {
    return {
      course: window.location.hash.split("/")[2],
      lecture: window.location.hash.split("/")[4],
    };
  }

  setHashParams(course, lecture) {
    if (!lecture) window.location.hash = "/learn/" + course;
    else window.location.hash = "/learn/" + course + "/lecture/" + lecture;
  }

  setLocalStorage(course, lecture) {
    if (!!course) localStorage.setItem("AWSLIBVN_COURSE", course);
    if (!!course && !!lecture)
      localStorage.setItem("AWSLIBVN_LECTURE" + course, lecture);
  }

  getLocalStorage(course) {
    if (!course) course = localStorage.getItem("AWSLIBVN_COURSE");
    return {
      course: course,
      lecture: localStorage.getItem("AWSLIBVN_LECTURE" + course),
    };
  }

  loadLectureById(lectureId) {
    this.state.course.chapters.forEach((chapter, chapterIndex) => {
      chapter.lectures.forEach((lecture, lectureIndex) => {
        if (lecture.lectureId === lectureId) {
          this.loadLecture(chapterIndex, lectureIndex);
        }
      });
    });
  }

  loadLecture(chapterIndex, lectureIndex) {
    let lectureId =
      this.state.course.chapters[chapterIndex].lectures[lectureIndex].lectureId;

    const apiName = "courses";
    const path = "/lectures/" + lectureId;
    const init = {};

    this.setState({ loading: true });

    API.get(apiName, path, init)
      .then((response) => {
        this.setState(
          {
            lecture: {
              chapterId: chapterIndex,
              lectureId: lectureIndex,
              lecture: {
                id: response.ID,
                content: response.Content,
                desc: response.Desc,
                name: response.Name,
                type: response.Type,
                viewed: response.Viewed,
                questions: response.Questions,
                workshopUrl: response.WorkshopUrl,
                workshopDesc: response.WorkshopDescription,
              },
            },
            loading: false,
            nextLectureName: this.getNextLectureName(
              chapterIndex,
              lectureIndex
            ),
          },
          () => {
            let hashParams = this.getHashParams();
            this.setHashParams(hashParams.course, response.ID);
            this.setLocalStorage(hashParams.course, response.ID);

            if (
              this.state.lecture.lecture.type === "lab" ||
              this.state.lecture.lecture.type === "survey" ||
              this.state.lecture.lecture.type === "document"
            ) {
              this.markLectureCompleted(this.state.lecture.lecture.id);
            }
          }
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }

  loadCourse() {
    let hashParams = this.getHashParams();

    let course = hashParams.course;
    let lecture = hashParams.lecture;
    if (!course) {
      let localParams = this.getLocalStorage();
      course = localParams.course;
      lecture = localParams.lecture;
    } else if (!lecture) {
      let localParams = this.getLocalStorage(course);
      lecture = localParams.lecture;
    }

    if (!course && !DEBUG) {
      window.location.href = landingPageUrl;
    }

    const apiName = "courses";
    const path = "/courses/" + course;
    const init = {};

    API.get(apiName, path, init)
      .then((response) => {
        let course = {
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
          totalLecture: 0,
        };

        let chapters = course.chapters;
        let firstLectureIndex = 0;
        let hashChapterIndex = -1;
        let hashLectureIndex = -1;
        while (chapters[0].lectures[firstLectureIndex].type === "section")
          firstLectureIndex++;

        for (let i = 0; i < chapters.length; i++) {
          chapters[i].length = 0;
          chapters[i].lectures[0].realIndex = 0;

          if (chapters[i].lectures[0].type !== "section")
            chapters[i].length += chapters[i].lectures[0].length;

          for (let j = 1; j < chapters[i].lectures.length; j++) {
            if (chapters[i].lectures[j - 1].type === "section") {
              chapters[i].lectures[j].realIndex =
                chapters[i].lectures[j - 1].realIndex;
            } else {
              chapters[i].lectures[j].realIndex =
                chapters[i].lectures[j - 1].realIndex + 1;
            }

            if (chapters[i].lectures[j].type !== "section") {
              chapters[i].length += chapters[i].lectures[j].length;
            }
          }
        }

        chapters.forEach((chapter) => {
          chapter.lectures.forEach(
            (lecture) => (course.totalLecture += lecture.type !== "section")
          );
        });

        if (!!lecture)
          for (let i = 0; i < chapters.length; i++) {
            for (let j = 0; j < chapters[i].lectures.length; j++) {
              if (chapters[i].lectures[j].lectureId === lecture) {
                hashChapterIndex = i;
                hashLectureIndex = j;
              }
            }
          }

        this.setState(
          {
            course: {
              id: course.id,
              name: course.name,
              chapters: chapters,
              firstLectureIndex: firstLectureIndex,
              totalLecture: course.totalLecture,
            },
          },
          () => {
            this.loadUserLecture();
            if (hashLectureIndex === -1) this.loadLecture(0, firstLectureIndex);
            else this.loadLecture(hashChapterIndex, hashLectureIndex);
          }
        );
      })
      .catch((error) => {
        console.log(error);
        if (!DEBUG) window.location.href = landingPageUrl;
      });
  }

  loadUserCourse() {
    let hashParams = this.getHashParams();
    let course = hashParams.course;

    const apiName = "courses";
    const path = "/users/courses/" + course;

    API.get(apiName, path)
      .then((response) => {
        response.LastAccessed = new Date().getTime();
        
        const apiName = "courses";
        const path = "/users/courses/";
        const myInit = {
          body: response,
        };

        API.put(apiName, path, myInit)
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error.response);
          });
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  loadUserLecture() {
    const apiName = "courses";
    const path = "/users/lectures/" + this.state.userId;

    API.get(apiName, path)
      .then((response) => {
        let completedLectures = [];
        response.forEach((userLecture) => {
          this.state.course.chapters.forEach((chapter) => {
            if (
              chapter.lectures.filter(
                (lecture) => lecture.lectureId === userLecture.LectureID
              ).length > 0
            ) {
              completedLectures.push(userLecture.LectureID);
            }
          });
        });
        this.setState({
          completedLectures: completedLectures,
        });
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  prevLecture() {
    let chapterId = this.state.lecture.chapterId;
    let lectureId = this.state.lecture.lectureId;

    lectureId--;
    if (lectureId < 0) {
      chapterId--;
      lectureId = this.state.course.chapters[chapterId].lectures.length - 1;
    }

    while (
      this.state.course.chapters[chapterId].lectures[lectureId].type ===
      "section"
    ) {
      lectureId--;
      if (lectureId < 0) {
        chapterId--;
        lectureId = this.state.course.chapters[chapterId].lectures.length - 1;
      }
    }

    this.loadLecture(chapterId, lectureId);
  }

  nextLecture() {
    let chapterId = this.state.lecture.chapterId;
    let lectureId = this.state.lecture.lectureId;

    lectureId++;
    if (lectureId === this.state.course.chapters[chapterId].lectures.length) {
      if (chapterId < this.state.course.chapters.length - 1) {
        chapterId++;
        lectureId = 0;
      } else {
        return;
      }
    }

    while (
      this.state.course.chapters[chapterId].lectures[lectureId].type ===
      "section"
    ) {
      lectureId++;
      if (lectureId === this.state.course.chapters[chapterId].lectures.length) {
        chapterId++;
        lectureId = 0;
      }
    }

    this.loadLecture(chapterId, lectureId);
  }

  getNextLectureName(chapterId, lectureId) {
    lectureId++;
    if (lectureId === this.state.course.chapters[chapterId].lectures.length) {
      chapterId++;
      lectureId = 0;
    }

    while (
      chapterId < this.state.course.chapters.length &&
      this.state.course.chapters[chapterId].lectures[lectureId].type ===
        "section"
    ) {
      lectureId++;
      if (lectureId === this.state.course.chapters[chapterId].lectures.length) {
        chapterId++;
        lectureId = 0;
      }
    }

    return chapterId < this.state.course.chapters.length &&
      lectureId < this.state.course.chapters[chapterId].lectures.length
      ? this.state.course.chapters[chapterId].lectures[lectureId].name
      : "";
  }

  async markLectureCompleted(lectureId) {
    if (!this.state.completedLectures.includes(lectureId)) {
      this.setState((prevState) => {
        if (!prevState.completedLectures.includes(lectureId))
          prevState.completedLectures.push(lectureId);
        const apiName = "courses";
        const path = "/users/lectures";
        const myInit = {
          body: {
            UserID: this.state.userId,
            LectureID: lectureId,
            Status: "COMPLETED",
          },
        };

        API.put(apiName, path, myInit)
          .then((response) => {
            // console.log(response);
          })
          .catch((error) => {
            console.log(error.response);
          });
        return prevState;
      });
    }
  }

  async ionViewCanEnter() {
    try {
      await Auth.currentAuthenticatedUser();
      this.setState({
        loggedIn: true,
      });
    } catch {
      this.setState({
        loggedIn: false,
      });
    }
  }

  async loadUserId(callback) {
    let credentials = await Auth.currentUserCredentials();
    this.setState(
      {
        userId: credentials.identityId,
      },
      callback
    );
  }

  componentDidMount() {
    this.ionViewCanEnter();
    this.loadUserId(() => this.loadCourse());
    // this.loadCourse();
    this.loadUserCourse();
  }

  formatTime(timeInSecond) {
    let minute = Math.floor(timeInSecond / 60);
    let second = timeInSecond % 60;

    if (minute < 10) minute = "0" + minute;
    if (second < 10) second = "0" + second;

    return minute + ":" + second;
  }

  setQuestionLength = (length) => {
    let newLecture = {
      ...this.state.lecture,
      lecture: { ...this.state.lecture.lecture, length: length },
    };
    this.setState({ lecture: newLecture });
  };

  countViewForCourse = () => {
    let courseId = this.state.course.id;
    const apiName = "courses";
    const path = "/courses/" + courseId;
    API.put(apiName, path, { body: {} })
      .then((response) => {
        console.log("count view done");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return this.state.loggedIn === false ? (
      <Navigate to="/auth" />
    ) : (
      <div>
        <NavBar
          navigation={this.props.navigation}
          title="Cloud Solutions Journey"
        />
        <AppLayout
          headerSelector="#h"
          navigation={
            <SideNavigation
              activeHref={
                !this.state.lecture || !this.state.lecture.lecture
                  ? ""
                  : this.state.lecture.lecture.id
              }
              header={{
                text: !this.state.course ? "" : this.state.course.name,
              }}
              onFollow={(event) => {
                if (!event.detail.external) {
                  event.preventDefault();
                  if (!!event.detail.href) {
                    if (event.detail.href === "#certificate") {
                      window.open(
                        "/#/cert/" + window.location.hash.split("/")[2],
                        "_blank"
                      );
                    } else {
                      this.loadLectureById(event.detail.href);
                    }
                  }
                }
              }}
              items={
                !this.state.course || !this.state.course.chapters
                  ? []
                  : [
                      {
                        type: "link",
                        href:
                          this.state.completedLectures.length /
                            this.state.course.totalLecture >=
                          0.8
                            ? "#certificate"
                            : "",
                        text:
                          this.state.completedLectures.length /
                            this.state.course.totalLecture >=
                          0.8 ? (
                            <span className="learn-navigation-progress-completed">
                              Completed {this.state.completedLectures.length}{" "}
                              out of {this.state.course.totalLecture} lectures{" "}
                              <IoCheckmarkSharp />
                            </span>
                          ) : (
                            <span className="learn-navigation-progress">
                              Completed {this.state.completedLectures.length}{" "}
                              out of {this.state.course.totalLecture} lectures
                            </span>
                          ),
                      },
                    ].concat(
                      this.state.course.chapters.map((chapter) => {
                        let chapterToRender = {
                          type: "section",
                          text: (
                            <div className="learn-navigation-chapter">
                              {chapter.name}{" "}
                              <span>
                                <IoTimeOutline />{" "}
                                {this.formatTime(chapter.length)}
                              </span>
                            </div>
                          ),
                          defaultExpanded:
                            !!this.state.lecture &&
                            !!this.state.lecture.lecture &&
                            chapter.lectures.filter(
                              (lecture) =>
                                lecture.lectureId ===
                                this.state.lecture.lecture.id
                            ).length > 0,
                          items: chapter.lectures.map((lecture) => {
                            return {
                              type: "link",
                              text:
                              lecture.type === "section" ? (
                                <div className="text-bold">
                                  {" "}
                                  {lecture.name.toUpperCase()}{" "}
                                </div>
                              ) : (
                                <div className="learn-navigation-lecture">
                                  <div style={{ width: "80%"}}>
                                  {this.state.completedLectures.includes(
                                    lecture.lectureId) ? <IoEllipseSharp /> : <IoEllipseSharp style={{visibility:"hidden"}}/>}
                                  {lecture.name}{" "}
                                  </div>
                                  <span className="learn-navigation-badge">
                                    {lecture.length > 0
                                      ? this.formatTime(lecture.length)
                                      : ""}
                                  </span>
                                </div>
                              ),
                              href: lecture.lectureId,
                              // info:
                              //   lecture.type === "section" ? (
                              //     ""
                              //   ) : this.state.completedLectures.includes(
                              //       lecture.lectureId
                              //     ) ? (
                              //     <span className="learn-navigation-badge">
                              //       <IoEllipseSharp />
                              //       {lecture.length > 0 ? this.formatTime(lecture.length) : ""}
                              //     </span>
                              //   ) : (
                              //     <span className="learn-navigation-badge">
                              //       {lecture.length > 0 ? this.formatTime(lecture.length) : ""}
                              //     </span>
                              //   ),
                            };
                          }),
                        };
                        return chapterToRender;
                      })
                    )
              }
            />
          }
          breadcrumbs={
            <BreadcrumbGroup
              items={[
                {
                  text: "My Learning",
                  href: "#/mylearning",
                },
                {
                  text: !this.state.course ? "" : this.state.course.name,
                },
              ]}
              ariaLabel="Breadcrumbs"
            />
          }
          content={
            !this.state.course ? (
              <LoadingContainer />
            ) : (
              <div fluid="true" className="learn-parent-container">
                <PageMetadata courseName={this.state.course.name} />

                <div className="learn-video-player-container">
                  <div className="learn-board">
                    <div className="learn-board-header">
                      {!this.state.lecture.lecture ? (
                        ""
                      ) : (
                        <div>
                          {this.state.lecture.lecture.name}
                          <span className="learn-quiz-length">
                            {this.state.lecture.lecture.type === "quiz"
                              ? " (" +
                                this.state.lecture.lecture.length +
                                " questions)"
                              : ""}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="learn-board-content">
                      <MainContent
                        loading={this.state.loading}
                        lecture={this.state.lecture}
                        nextLectureName={this.state.nextLectureName}
                        isFirst={
                          this.state.lecture.chapterId === 0 &&
                          this.state.course.chapters[
                            this.state.lecture.chapterId
                          ].lectures[this.state.lecture.lectureId].realIndex ===
                            0
                        }
                        isLast={
                          this.state.lecture.chapterId ===
                            this.state.course.chapters.length - 1 &&
                          this.state.lecture.lectureId ===
                            this.state.course.chapters[
                              this.state.lecture.chapterId
                            ].lectures.length -
                              1
                        }
                        markLectureCompleted={() => {
                          this.markLectureCompleted(
                            this.state.lecture.lecture.id
                          );
                        }}
                        prevLecture={() => {
                          this.prevLecture();
                        }}
                        nextLecture={() => {
                          this.nextLecture();
                        }}
                        setQuestionLength={this.setQuestionLength}
                        countViewForCourse={this.countViewForCourse}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          }
          disableContentPaddings={true}
        />
      </div>
    );
  }
}
