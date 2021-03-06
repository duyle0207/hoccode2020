import React, { Component } from "react";
import Split from "react-split";
import MiniTaskDesc from "./body/MiniTaskDesc";
import MiniTaskHeader from "./header/MiniTaskHeader";
// import CodeEditor from "./body/CodeEditor";
import ResultPanel from "./body/ResultPanel";
import TestsPanel from "./body/TestsPanel";
import Snackbar from '@material-ui/core/Snackbar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import DoneIcon from '@material-ui/icons/Done';

import "./minitask.css";
//import MediaQuery from "react-responsive";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";

import js_beautify from "js-beautify";

import RotateLeftIcon from '@material-ui/icons/RotateLeft';

import DescriptionIcon from '@material-ui/icons/Description';

import {
  submitUpdateMinitask,
  setUndefinedNextMinitask
} from "../../js/actions/userAction";
import HashLoader from "react-spinners/HashLoader";

//Code editor
import AceEditor from "react-ace";
// import brace from 'brace';
import 'brace/theme/github';
import 'brace/theme/twilight';
import 'brace/theme/monokai';

import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/snippets/java";

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import Checkbox from '@material-ui/core/Checkbox';
import Slide from '@material-ui/core/Slide';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Typography from '@material-ui/core/Typography';
import Notfoundpage from '../roomPractice/Notfoundpage';
// import Fade from '@material-ui/core/Fade';
// import { getUser } from "../../js/actions/userAction";

import { sendMsg } from "../../websocket";

class MiniTaskPage extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      minitask: {},
      result: {},
      userCode: "",
      isLoading: false,
      isLoadingComponent: true,
      open: false,
      isUserStudy: false,
      isUserFight: false,
      // variable for numbers of doing with get code point.
      numbers_doing: 0,
      completedMinitask: [],
      theme: "textmate",
      isAutocomplete: false,
      user_minitask_practice: {},
      isLoadingCode: true,
      // stopwatch
      days: 0,
      hour: 0,
      minute: 0,
      second: 0,
      //
      minitaskListId: [],
      minitaskUser: {},
      userFight: {},
      fightminitaskdone: [],
      startTime: " ",
      //
      contestStatus: '',
      isUserJoinFight: '',
      //
      isUserCompleteFight: '',
      // time complete
      dayComplete: 0,
      hourComplete: 0,
      minuteComplete: 0,
      secondComplete: 0,
    };

    this.executeCode = this.executeCode.bind(this);
    this.submitCode = this.submitCode.bind(this);
    this.submitCodePractice = this.submitCodePractice.bind(this);
    this.submitCodeFight = this.submitCodeFight.bind(this);
    this.updateUserCode = this.updateUserCode.bind(this);
    this.resetCode = this.resetCode.bind(this);
    this.createFileTest = this.createFileTest.bind(this);
  }

  componentDidMount() {
    this.props.setUndefinedNextMinitask();

    var { history } = this.props;
    console.log(this.state.minitask);
    var pathname = history.location.pathname;
    console.log(pathname);
    const {
      match: { params }
    } = this.props;

    if (pathname.startsWith("/tasks/")) {
      this.setState({ isUserStudy: true });
    }

    if (pathname.startsWith("/fight/")) {
      this.setState({ isUserFight: true });
      axios.get(`http://localhost:8081/api/v1/curd/is-user-done-fight/${params.fightId}`).then(res => {
        console.log(res.data);
        this.setState({ isUserCompleteFight: res.data }, () => {
          axios
            .get(`http://localhost:8081/api/v1/curd/getone-userfight/${params.fightId}`)
            .then(res => {
              const { isUserCompleteFight } = this.state;
              console.log(isUserCompleteFight);
              console.log(res.data);
              if (isUserCompleteFight) {
                var miliSecComplete = new Date(res.data.end_time) - new Date(res.data.start_time);

                var secondComplete = Math.floor((miliSecComplete / 1000) % 60),
                  minuteComplete = Math.floor((miliSecComplete / (1000 * 60)) % 60),
                  hourComplete = Math.floor((miliSecComplete / (1000 * 60 * 60)) % 24);

                var dayComplete = Math.floor(miliSecComplete / (24 * 60 * 60 * 1000));

                this.setState({
                  dayComplete,
                  secondComplete,
                  minuteComplete,
                  hourComplete,
                });
              } else {
                var miliSec = new Date() - new Date(res.data.start_time);

                var seconds = Math.floor((miliSec / 1000) % 60),
                  minutes = Math.floor((miliSec / (1000 * 60)) % 60),
                  hours = Math.floor((miliSec / (1000 * 60 * 60)) % 24);

                var days = Math.floor(miliSec / (24 * 60 * 60 * 1000));

                const date = new Date(res.data.start_time).getTime();
                console.log(date);
                this.setState({
                  userFight: res.data,
                  startTime: res.data.start_time,
                  days: days,
                  hour: hours,
                  minute: minutes,
                  second: seconds
                })
              }
            });
        });
      });
      axios
        .get(`http://localhost:8081/api/v1/curd/listminitaskfight/${params.fightId}`)
        .then(res => {
          const dt = res.data;
          const IdMinitask = [];

          for (var i = 0; i < dt.length; i++) {

            IdMinitask.push(dt[i])

          }
          this.setState({ minitaskListId: IdMinitask })
          // console.log(this.state.minitaskListId);
        });

      axios.get(`http://localhost:8081/api/v1/curd/isUserJoinFight/${params.fightId}/`).then(isUserJoin => {
        // console.log(isUserJoin);
        this.setState({
          isUserJoinFight: isUserJoin.data,
        });
      });

      axios.get(`http://localhost:8081/api/v1/curd/fights/${params.fightId}`).then(res => {
        var code;
        const fight = res.data;
        if ((new Date() < new Date(fight.time_start))) {
          code = -1;
        }
        if ((new Date() > new Date(fight.time_start)) && (new Date() < new Date(fight.time_end))) {
          // Đang diển ra
          code = 0;
        }
        if ((new Date() > new Date(fight.time_end))) {
          code = 1;
        }
        this.setState({ contestStatus: code }, () => {
          axios.get(`http://localhost:8081/api/v1/curd/isUserJoinFight/${params.fightId}/`).then(isUserJoin => {
            // console.log(isUserJoin);
            this.setState({
              isUserJoinFight: isUserJoin.data,
            });
          });
        });
      });

      axios
        .get(`http://localhost:8081/api/v1/curd/getall-minitask/${params.fightId}`)
        .then(res => {
          const dt = res.data;
          const IdMinitaskDone = [];

          for (var i = 0; i < dt.length; i++) {
            IdMinitaskDone.push(dt[i].minitask_id)
          }
          this.setState({ fightminitaskdone: IdMinitaskDone })
          // console.log(this.state.fightminitaskdone);
        });


      //set start time for user
      // var today = new Date();
      // var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
      // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      // var dateStart = date + ' ' + time;
      // this.setState({ startTime: this.state.userFight.start_time });


      // axios
      // .get(`http://localhost:8081/api/v1/curd/getone-minitask/${params.fightId}/${params.minitaskId}/`)
      // .then(res=>{
      //   console.log(res.data);
      //   this.setState({minitaskUser: res.data})
      //   console.log(this.state.minitaskUser);
      // })


    }
    // console.log(params);
    // console.log(this.state.isUserFight);

    axios
      .get(`http://localhost:8081/api/v1/minitasks/${params.minitaskId}`)
      .then(res => {
        const minitask = res.data;
        document.title = minitask.mini_task_name;
        const numbers = minitask.numbers_doing
        // console.log(numbers);
        this.setState((state, props) => ({
          minitask: minitask,
          isLoadingComponent: false
        }));
        this.setState((state, props) => ({
          minitask: minitask
        }));
        // setTimeout(() => {
        //   console.log(this.state.minitask);
        // }, 0);
        /* if(minitask.user_code !== ''){ // if user have ever code in this minitassk, load user code
        this.setState((state, props) => ({
          userCode: minitask.user_code
        }));
      }
      else{ 
        this.setState((state, props) => ({
          userCode: minitask.template_code
        }));
      } */
        // console.log(this.state.user_minitask_practice);
        this.setState((state, props) => ({
          userCode: (this.state.isUserStudy && this.state.user_minitask_practice.status === "done") ?
            this.state.user_minitask_practice.user_code : minitask.template_code
        }));
        // console.log(this.state.userCode);

        this.setState({ numbers_doing: numbers });
        // console.log(this.state.numbers_doing);
      });

    axios
      .get(`http://localhost:8081/api/v1/auth/completeminitask`)
      .then(res => {
        const completed = res.data;
        this.setState({ completedMinitask: completed })
        // console.log(this.state.completedMinitask);
      });
    // setTimeout(()=>{console.log(this.state.minitask.mini_task_desc)},2000)

    //set up stopwatch clock
    setInterval(() => {
      this.setState((state, props) => {
        return {
          hour: state.hour === 59 ? state.hour + 1 : state.hour,
          minute: state.second === 59 ? state.minute + 1 : state.minute,
          second: state.second === 59 ? 0 : state.second + 1
        };
      });
    }, 1000);
    // console.log("MODE");
    // console.log(this.state.isUserFight);
    // console.log(this.state.isUserStudy);
  }

  send = (id) => {
    console.log("send");
    sendMsg(JSON.stringify({
      fight_id: id,
      user_id: "",
      minitask_id: "",
      point: 0,
      request: "get-leader-board",
    }))
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.match.params.minitaskId !== this.props.match.params.minitaskId
    ) {
      this.props.setUndefinedNextMinitask();
      console.log("next ");
      this.setState((state, props) => ({
        result: {}
      }));
      axios
        .get(
          `http://localhost:8081/api/v1/minitasks/${this.props.match.params.minitaskId}`
        )
        .then(res => {
          const minitask = res.data;
          const numbers = minitask.numbers_doing
          this.setState((state, props) => ({
            minitask: minitask,
            isLoadingComponent: false
          }));
          this.setState((state, props) => ({
            minitask: minitask
          }));

          this.setState((state, props) => ({
            userCode: (this.state.isUserStudy && this.state.user_minitask_practice.status === "done") ?
              this.state.user_minitask_practice.user_code : minitask.template_code
          }));
          // console.log(this.state.userCode);
          this.setState({ numbers_doing: numbers });
        });
      // do something
    }
  }
  updateUserCode(value) {
    // is props of <codeEditor/> to update usercode wwhen edit in editor
    console.log(value);
    this.setState({ userCode: value });
  }

  beautifyCode(value) {
    var formatCode = js_beautify(value, { max_preserve_newlines: 2 });
    // console.log(formatCode);

    this.setState((state, props) => ({
      userCode: formatCode
    }));
    this.handleClickSnack();
  }

  handleClickSnack = () => {
    this.setState({ open: true });
  };

  handleCloseSnack = () => {
    this.setState({ open: false });
  };

  handleChangeTheme = (event) => {
    this.setState({ theme: event.target.value })
  }

  handleChangeAutoComplete = () => {
    this.setState({ isAutocomplete: !this.state.isAutocomplete });
  }

  resetCode() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success comfirmFesetCodeBtn",
        cancelButton: "btn btn-danger cancelCodeBtn"
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons
      .fire({
        title: "Bạn có chắc chắn muốn xóa code đã lưu?",
        text: "Bạn sẽ không thể hoàn tác!",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy!",
        reverseButtons: true
      })
      .then(result => {
        if (result.value) {
          this.setState((state, props) => ({
            userCode: minitask.template_code
          }));
          swalWithBootstrapButtons.fire("Đã reset!", "", "success");
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire("Đã hủy", "", "error");
        }
      });
    const { minitask } = this.state;
  }

  createFileTest(minitask) {
    let junit4 = ``;

    if (minitask.id !== undefined) {
      if (minitask.output_type_func.includes("[]") === true) {
        junit4 = `import static org.junit.Assert.assertArrayEquals;\n    import org.junit.Test;\n    import org.junit.runners.JUnit4;\n    public class TestFixture {\n    public TestFixture(){}\n `;
        minitask.unit_tests.forEach((unit_test, index) => {
          let inputs = "";
          unit_test.inputs.forEach(input => {
            if (input.type.includes("[]") === true) {
              // if input is array, add new input.type before input.value // new int[] {1,2,3,4}
              inputs += `new ${input.type} ${input.value},`;
            } else {
              inputs += `${input.value},`;
            }
          });

          let inputsFormat = inputs.substring(0, inputs.length - 1);
          if (minitask.output_type_func === "double[]") {
            junit4 += ` @Test\n    public void myTestFunction${index +
              1}(){\n    Solution s = new Solution();\n  assertArrayEquals("test ${index +
              1}", new ${minitask.output_type_func} ${
              unit_test.expected_output
              }, s.${minitask.name_func}(${inputsFormat}),0);\n  }\n`;
          } else {
            junit4 += ` @Test\n    public void myTestFunction${index +
              1}(){\n    Solution s = new Solution();\n  assertArrayEquals("test ${index +
              1}", new ${minitask.output_type_func} ${
              unit_test.expected_output
              }, s.${minitask.name_func}(${inputsFormat}));\n  }\n`;
          }
        });
        junit4 += `}`;
      } else {
        junit4 = `import static org.junit.Assert.assertEquals;\n    import org.junit.Test;\n    import org.junit.runners.JUnit4;\n    public class TestFixture {\n    public TestFixture(){}\n `;
        minitask.unit_tests.forEach((unit_test, index) => {
          let inputs = "";
          unit_test.inputs.forEach(input => {
            if (input.type.includes("[]") === true) {
              // if input is array, add new input.type before input.value // new int[] {1,2,3,4}
              inputs += `new ${input.type} ${input.value},`;
            } else {
              inputs += `${input.value},`;
            }
          });
          let inputsFormat = inputs.substring(0, inputs.length - 1);
          if (minitask.output_type_func === "double") {
            junit4 += ` @Test\n    public void myTestFunction${index +
              1}(){\n    Solution s = new Solution();\n  assertEquals("test ${index +
              1}", ${unit_test.expected_output}, s.${
              minitask.name_func
              }(${inputsFormat}),0);\n  }\n`;
          } else if (minitask.output_type_func === "String") {
            junit4 += ` @Test\n    public void myTestFunction${index +
              1}(){\n    Solution s = new Solution();\n  assertEquals("test ${index +
              1}", "${unit_test.expected_output}", s.${
              minitask.name_func
              }(${inputsFormat}));\n  }\n`;
          } else {
            junit4 += ` @Test\n    public void myTestFunction${index +
              1}(){\n    Solution s = new Solution();\n  assertEquals("test ${index +
              1}", ${unit_test.expected_output}, s.${
              minitask.name_func
              }(${inputsFormat}));\n  }\n`;
          }
        });
        junit4 += `}`;
      }
    }
    return junit4;
  }

  executeCode() {
    this.setState((state, props) => ({
      result: {}
    }));
    const { minitask } = this.state;
    //console.log(this.state.userCode);
    let junit4 = this.createFileTest(minitask);

    let code = `import java.lang.Math; \n public class Solution {\n    public Solution(){}\n    ${this.state.userCode}\n    }`;
    this.setState((state, props) => ({
      isLoading: true
    }));

    console.log(junit4);
    //console.log(code);
    axios
      .post("http://codejava.tk/runner", {
        code: code,
        test: junit4
      })
      .then(
        function (response) {
          console.log(response);
          const error = response.data.stderr;
          const stdout = response.data.stdout;

          this.setState((state, props) => ({
            result: {
              error: error,
              stdout: stdout
            }
          }));
          this.setState((state, props) => ({
            isLoading: false
          }));
        }.bind(this)
      )
      .catch(
        function (error) {
          this.setState((state, props) => ({
            isLoading: false,
            result: {
              errorRuntime: error
            }
          }));
          console.log(error);
        }.bind(this)
      );
  }

  submitCodePractice() {
    this.setState((state, props) => ({
      result: {}
    }));
    const { minitask } = this.state;
    //console.log(this.state.userCode);
    let junit4 = this.createFileTest(minitask);

    let code = `import java.lang.Math; \n public class Solution {\n    public Solution(){}\n    ${this.state.userCode}\n    }`;

    const {
      match: { params }
    } = this.props;
    console.log(params.taskId)
    console.log(this.state.minitask.task_id);
    // this.props.submitUpdateMinitask(
    //   this.state.minitask.id,
    //   params.taskId,
    //   params.courseId
    // );

    this.setState((state, props) => ({
      isLoading: true
    }));

    console.log(code);
    console.log(junit4);

    axios
      .post("http://codejava.tk/runner", {
        code: code + "\n\n// " + new Date() + "\n\n// " + new Date(),
        test: junit4
      })
      .then(
        function (response) {
          console.log(response.data.stdout);
          console.log(response.data.stderr === "");
          const error = response.data.stderr;
          const stdout = response.data.stdout;
          this.setState((state, props) => ({
            result: {
              error: error,
              stdout: stdout
            }
          }));
          console.log(error);
          this.setState((state, props) => ({
            isLoading: false
          }));

          if (this.state.result.stdout.WASSUCCESSFUL === "true") {
            axios.post("http://localhost:8081/api/v1/curd/runPracticeCode", {
              id: "",
              user_id: "",
              minitask_id: this.state.minitask.id,
              status: "done",
              user_code: code,
            }).then(res => {
              console.log(res.data);
            });
            Swal.fire({
              type: "success",
              title: `Chúc mừng, bạn đã hoàn thành bài thực hành này`,
              width: 600,
              padding: "3em",
              customClass: "hidden_alert",
              backdrop: `
                rgba(0,0,123,0.4)
                url("${require("./giphy.gif")}") 
                center center
                no-repeat
              `
            });
            toast("Chúc mừng, bạn đã hoàn thành bài thực hành này!", {
              containerId: "B"
            });
          } else {
            axios.post("http://localhost:8081/api/v1/curd/runPracticeCode", {
              id: "",
              user_id: "",
              minitask_id: this.state.minitask.id,
              status: "tried",
              user_code: "",
            }).then(res => {
              console.log(res.data);
            });
          }
        }.bind(this)
      )
      .catch(
        function (error) {
          this.setState((state, props) => ({
            isLoading: false,
            result: {
              errorRuntime: error
            }
          }));
          console.log(error);
        }.bind(this)
      );
  }

  submitCode() {
    this.setState((state, props) => ({
      result: {}
    }));
    const { minitask } = this.state;
    //console.log(this.state.userCode);
    let junit4 = this.createFileTest(minitask);

    let code = `import java.lang.Math; \n public class Solution {\n    public Solution(){}\n    ${this.state.userCode}\n    }`;

    const {
      match: { params }
    } = this.props;
    console.log(params.taskId)
    console.log(this.state.minitask.task_id);
    // this.props.submitUpdateMinitask(
    //   this.state.minitask.id,
    //   params.taskId,
    //   params.courseId
    // );

    this.setState((state, props) => ({
      isLoading: true
    }));

    console.log(code);
    console.log(junit4);

    // axios({
    //   method: 'post',
    //   headers: { 
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //   },
    //   url: 'http://localhost:8080/',
    //   data: { 
    //     code: code,
    //     test: junit4,
    //   }
    // }).then((res)=>{
    //   console.log(res);
    // })

    axios
      .post("http://codejava.tk/runner", {
        code: code + "\n\n// " + new Date() + "\n\n// " + new Date(),
        test: junit4
      })
      .then(
        function (response) {
          console.log(response.data.stdout);
          console.log(response.data.stderr === "");
          const error = response.data.stderr;
          const stdout = response.data.stdout;
          this.setState((state, props) => ({
            result: {
              error: error,
              stdout: stdout
            }
          }));
          this.setState((state, props) => ({
            isLoading: false
          }));

          if (this.state.result.stdout.WASSUCCESSFUL === "true") {
            var completed = this.state.completedMinitask
            var listID = [];
            for (var i in completed) {
              listID.push(completed[i].id)
            }
            console.log(listID);
            if (completed !== null && listID.indexOf(this.state.minitask.id) === -1) {
              var newNumbers = this.state.minitask;
              newNumbers.numbers_doing = this.state.numbers_doing - 1
              this.setState({ minitask: newNumbers });
              axios
                .put(
                  `http://localhost:8081/api/v1/curd/minitasks/${this.state.minitask.id}`,
                  newNumbers
                )
                .then(res => {
                  // const course = res.data;
                  // this.setState({ course: course });
                });

              console.log(this.state.numbers_doing);
            }
            if (this.state.numbers_doing > 0) {
              console.log(this.state.minitask.task_id);
              this.props.submitUpdateMinitask(
                this.state.minitask.id,
                params.taskId,
                params.courseId
              );
              Swal.fire({
                type: "success",
                title: `Chúc mừng, bạn đã hoàn thành bài thực hành này`,
                width: 600,
                padding: "3em",
                customClass: "hidden_alert",
                backdrop: `
                  rgba(0,0,123,0.4)
                  url("${require("./giphy.gif")}") 
                  center center
                  no-repeat
                `
              });
              toast("Chúc mừng, bạn đã hoàn thành bài thực hành này!", {
                containerId: "B"
              });
            } else {
              toast("Bạn làm đúng nhưng hết lượt cộng điểm cho bài thực hành này", {
                containerId: "B"
              });
            }
          } else {
            // Run code failed
            axios.post(`http://localhost:8081/api/v1/auth/update-user-course-w-run-failed/${params.courseId}`).then(res=>{
              console.log(res.data);
            });
          }
        }.bind(this)
      )
      .catch(
        function (error) {
          this.setState((state, props) => ({
            isLoading: false,
            result: {
              errorRuntime: error
            }
          }));
          console.log(error);
        }.bind(this)
      );
  }

  // code fight submit handle
  submitCodeFight() {
    this.setState((state, props) => ({
      result: {}
    }));
    const { minitask } = this.state;
    //console.log(this.state.userCode);
    let junit4 = this.createFileTest(minitask);

    let code = `import java.lang.Math; \n public class Solution {\n    public Solution(){}\n    ${this.state.userCode}\n    }`;

    const {
      match: { params }
    } = this.props;
    console.log(params.taskId)
    console.log(this.state.minitask.task_id);
    // this.props.submitUpdateMinitask(
    //   this.state.minitask.id,
    //   params.taskId,
    //   params.courseId
    // );

    this.setState((state, props) => ({
      isLoading: true
    }));

    console.log(code);
    console.log(junit4);

    axios
      .get(`http://localhost:8081/api/v1/curd/getone-minitask/${params.fightId}/${this.state.minitask.id}/`)
      .then(res => {
        console.log(res.data);
        this.setState({ minitaskUser: res.data })
        console.log(this.state.minitaskUser);
      })

    axios
      .post("http://codejava.tk/runner", {
        code: code + "\n\n// " + new Date() + "\n\n// " + new Date(),
        test: junit4
      })
      .then(
        function (response) {
          console.log(response.data.stdout);
          console.log(response.data.stderr === "");
          const error = response.data.stderr;
          const stdout = response.data.stdout;
          this.setState((state, props) => ({
            result: {
              error: error,
              stdout: stdout
            }
          }));
          console.log(error);
          this.setState((state, props) => ({
            isLoading: false
          }));

          console.log(this.state.minitaskUser.status);
          var today = new Date();
          var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
          var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
          var dateTime = date + ' ' + time;

          if (this.state.result.stdout.WASSUCCESSFUL === "true") {
            if (this.props.user.id !== this.state.minitaskUser.user_id &&
              params.fightId !== this.state.minitaskUser.fight_id &&
              this.state.minitaskUser.minitask_id !== this.state.minitask.id) {
              axios.get(`http://localhost:8081/api/v1/curd/handle-user-done-fight/${params.fightId}`).then(res => {
                console.log(res.data);
              });
              axios.post("http://localhost:8081/api/v1/curd/runfightminitask", {
                id: "",
                fight_id: params.fightId,
                user_id: this.props.user.id,
                minitask_id: this.state.minitask.id,
                status: "done",
                tried: 1,
                start_time: this.state.startTime,
                end_time: dateTime
              }).then(res => {
                console.log(res.data);
                //add code point for users
                var newFightUser = this.state.userFight;
                newFightUser.point = this.state.minitask.code_point + newFightUser.point
                axios.put(`http://localhost:8081/api/v1/curd/add-point/${this.state.userFight.id}`, newFightUser)
                  .then(res => {
                    console.log(res.data);
                    this.send(params.fightId)
                  });
              });
            } else {
              console.log("Đã tồn tại minitask user fight");
              var newStatus = this.state.minitaskUser
              if (newStatus.status !== "done") {
                newStatus.status = "done"
                newStatus.tried += 1
                // axios.get(`http://localhost:8081/api/v1/curd/handle-user-done-fight/${params.fightId}`).then(res => {
                //   console.log(res.data);
                // });

                // Fix here

                newStatus.end_time = dateTime
                this.setState({ minitaskUser: newStatus })
                axios.put(`http://localhost:8081/api/v1/curd/updatestatus/${this.state.minitaskUser.id}`, newStatus)
                  .then(res => {
                    console.log(res.data);
                    //add code point for users
                    var newFightUser = this.state.userFight;
                    newFightUser.point = this.state.minitask.code_point + newFightUser.point
                    axios.put(`http://localhost:8081/api/v1/curd/add-point/${this.state.userFight.id}`, newFightUser)
                      .then(res => {
                        console.log(res.data);
                        this.send(params.fightId);
                      });
                  });
              }
            }
            Swal.fire({
              type: "success",
              title: `Chúc mừng, bạn đã hoàn thành bài thực hành này`,
              width: 600,
              padding: "3em",
              customClass: "hidden_alert",
              backdrop: `
                  rgba(0,0,123,0.4)
                  url("${require("./giphy.gif")}") 
                  center center
                  no-repeat
                `
            });
            toast("Chúc mừng, bạn đã hoàn thành bài thực hành này!", {
              containerId: "B"
            });
          } else {
            if (this.props.user.id !== this.state.minitaskUser.user_id &&
              params.fightId !== this.state.minitaskUser.fight_id &&
              this.state.minitaskUser.minitask_id !== this.state.minitask.id) {
              axios.post("http://localhost:8081/api/v1/curd/runfightminitask", {
                id: "",
                fight_id: params.fightId,
                user_id: this.props.user.id,
                minitask_id: this.state.minitask.id,
                status: "tried",
                tried: this.state.minitaskUser.tried + 1,
                start_time: dateTime
              }).then(res => {
                console.log(res.data);
                this.send(params.fightId);
              });
            } else {
              newStatus = this.state.minitaskUser;
              newStatus.tried += 1
              this.setState({ minitaskUser: newStatus })
              axios.put(`http://localhost:8081/api/v1/curd/updatestatus/${this.state.minitaskUser.id}`, newStatus)
                .then(res => {
                  this.send(params.fightId);
                });
            }
          }
        }.bind(this)
      )
      .catch(
        function (error) {
          this.setState((state, props) => ({
            isLoading: false,
            result: {
              errorRuntime: error
            }
          }));
          this.send(params.fightId);
          console.log(error);
        }.bind(this)
      );
  }

  renderCodingTime = (isUserCompleteFight) => {
    if (!isUserCompleteFight) {
      return <Typography style={{ fontSize: 16, fontWeight: 600 }}>
        Thời gian: {this.state.days < 10 ? "0" + this.state.days : this.state.days} ngày &nbsp;
               {this.state.hour < 10 ? "0" + this.state.hour : this.state.hour} giờ &nbsp;
               {this.state.minute < 10 ? "0" + this.state.minute : this.state.minute} phút &nbsp;
               {this.state.second < 10 ? "0" + this.state.second : this.state.second} giây
      </Typography>
    } else {
      return <Typography style={{ fontSize: 16, fontWeight: 600 }}>
        Thời gian: {this.state.dayComplete < 10 ? "0" + this.state.dayComplete : this.state.dayComplete} ngày &nbsp;
              {this.state.hourComplete < 10 ? "0" + this.state.hourComplete : this.state.hourComplete} giờ &nbsp;
              :{this.state.minuteComplete < 10 ? "0" + this.state.minuteComplete : this.state.minuteComplete} phút &nbsp;
              {this.state.secondComplete < 10 ? "0" + this.state.secondComplete : this.state.secondComplete} giây
      </Typography>
    }
  }

  render() {
    const { minitask, result, theme, isLoadingCode, contestStatus, isUserJoinFight, isUserFight, isUserCompleteFight, isUserStudy } = this.state;
    const { isLoadingComponent } = this.state;
    const {
      match: { params }
    } = this.props;
    function renderPassedTestCount() {
      if (result !== undefined) {
        if (result.stdout !== undefined) {
          if (result.stdout.WASSUCCESSFUL !== undefined) {
            return (
              <React.Fragment>
                {result.stdout.RUNCOUNT - result.stdout.GETFAILURECOUNT}/
                {result.stdout.RUNCOUNT}
              </React.Fragment>
            );
          }
        }
      }
    }

    let btnSubmit;
    if (isUserStudy) {
      btnSubmit = (<Button variant="contained" startIcon={<DescriptionIcon />}
        style={{ backgroundColor: "#7BC043" }} onClick={this.submitCode} disabled={this.state.isLoading} color="primary">
        Nộp bài
      </Button>)
    }
    else if (isUserFight) {
      btnSubmit = (<Button variant="contained" startIcon={<DescriptionIcon />}
        style={{ backgroundColor: "#7BC043" }} onClick={this.submitCodeFight} disabled={this.state.isLoading} color="primary">
        Nộp bài
      </Button>)
    } else {
      btnSubmit = (<Button variant="contained" startIcon={<DescriptionIcon />}
        style={{ backgroundColor: "#7BC043" }} onClick={this.submitCodePractice} disabled={this.state.isLoading} color="primary">
        Nộp bài
      </Button>)
    }

    if (isUserFight && !isLoadingComponent) {
      console.log("Check: " + isUserFight + " - " + isLoadingComponent);
      if (contestStatus === 1 || !isUserJoinFight) {
        console.log("Check 2: " + contestStatus + " - " + isUserJoinFight);
        return <Notfoundpage />;
      }
    }

    return (
      <React.Fragment>
        <div className="fit layout-code">
          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            key={`bottom,center`}
            open={this.state.open}
            onClose={this.handleCloseSnack}
            ContentProps={{
              "aria-describedby": "message-id"
            }}
            className="success"
            autoHideDuration={2000}

            // style={{    backgroundColor: "#43a047"            }}
            message={<span id="message-id">Thành công</span>}
          />
          {/* fit->  postion: absolute, top, bottom,left, right:0 ****   .layout-code{ display: flex;flex-direction: column;
        } */}
          <div className="layout-code-header">
            <MiniTaskHeader
              minitaskName={minitask.mini_task_name}
              history={this.props.history}
            />
          </div>
          <Divider />
          {this.state.isUserFight && !isLoadingComponent ? (
            <div className="container">
              <div className="btn-minitask" style={{ margin: "0 auto", display: "inline-block", marginLeft: 10, position: "relative" }}>
                <Slide in={true} direction="right" {...(true ? { timeout: 1400 } : {})}>
                  <ButtonGroup variant="contained" size="large" aria-label=" contained primary button group">
                    {this.state.minitaskListId.map((object, i) => {
                      if (this.state.fightminitaskdone.includes(object.id) === true) {
                        return (
                          <Button obj={object} key={i}
                            component={Link} to={`/fight/${params.fightId}/minitask/${object.id}`} className="btn-minitask-item"
                            style={{ marginRight: 6, borderRadius: 3, backgroundColor: "#3f51b5 ", border: "1px solid #3f51b5 ", fontSize: 13 }}>
                            <DoneIcon style={{ color: "#fff" }} fontSize="medium"></DoneIcon>
                          </Button>
                        )
                      } else {
                        return (
                          <Button obj={object} key={i}
                            component={Link} to={`/fight/${params.fightId}/minitask/${object.id}`} className="btn-minitask-item"
                            style={{
                              marginRight: 6, borderRadius: 3, border: "1px solid #65656d", fontSize: 13,
                              backgroundColor: object.id === params.minitaskId ? "#7278D6" : ""
                            }}>{i + 1}</Button>
                        )
                      }
                    })}
                  </ButtonGroup>
                </Slide>
              </div>
              <Slide in={true} direction="left" {...(true ? { timeout: 1400 } : {})}>
                <div style={{ float: "right", marginRight: 10 }}>
                  <div className="stopwatch" style={{ color: "#D94A38", fontSize: 16, fontWeight: 600 }}>
                    {this.renderCodingTime(isUserCompleteFight)}
                  </div>
                </div>
              </Slide>
            </div>
          ) : null}

          {isLoadingComponent && isLoadingCode ? (
            <div
              className="sweet-loading"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100vh"
              }}
            >
              <HashLoader
                sizeUnit={"px"}
                size={50}
                color={"#AEA8A8"}
                loading={isLoadingComponent}
              />
            </div>
          ) : (
              <div className="layout-code-body">
                {/* layout-code-body->   position: relative;flex-grow: 1;*/}
                <div className="split-panel fit">
                  <div className="stretch fit">
                    {/*  <MediaQuery minDeviceWidth={701}>*/}
                    <Split
                      className="splitHorizontal"
                      sizes={[25, 75]}
                      minSize={0}
                      expandToMin={false}
                      gutterSize={4}
                      gutterAlign="center"
                      snapOffset={30}
                      dragInterval={1}
                      direction="horizontal"
                      cursor="col-resize"
                    >
                      <div className="split-panel-first ">
                        <MiniTaskDesc
                          mini_task_desc={minitask.mini_task_desc}
                          code_point={minitask.code_point}
                          level={minitask.level}
                          minitaskName={minitask.mini_task_name}
                        />
                      </div>
                      <div className="split-panel-second ">
                        <div className="coding-area">
                          <Split
                            className="splitVertical"
                            sizes={[50, 50]}
                            minSize={100}
                            expandToMin={false}
                            gutterSize={4}
                            gutterAlign="center"
                            snapOffset={30}
                            dragInterval={1}
                            direction="vertical"
                            cursor="row-resize"
                          >
                            <div>
                              <div className="codeEditor">
                                {/* <CodeEditor
                                  userCode={this.state.userCode}
                                  updateUserCode={this.updateUserCode}
                                /> */}
                                <Box display="flex" p={1} bgcolor="background.paper">
                                  <Slide in={true} {...(true ? { timeout: 700 } : {})}>
                                    <Box ml={1}>
                                      <InputLabel id="demo-simple-select-label">Theme</InputLabel>
                                      <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={theme}
                                        onChange={this.handleChangeTheme}
                                        style={{ width: 100 }}
                                      >
                                        <MenuItem value={"textmate"}>Textmate</MenuItem>
                                        <MenuItem value={"github"}>Github</MenuItem>
                                        <MenuItem value={"monokai"}>Monokai</MenuItem>
                                      </Select>
                                    </Box>
                                  </Slide>
                                  <Slide in={true} {...(true ? { timeout: 1400 } : {})}>
                                    <Box ml={3} width="100%">
                                      <InputLabel id="demo-simple-select-label">Autocomplete</InputLabel>
                                      <Checkbox
                                        checked={this.state.isAutocomplete}
                                        color="primary"
                                        onChange={this.handleChangeAutoComplete}
                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                      />
                                    </Box>
                                  </Slide>
                                  <Slide in={true} direction="left" {...(true ? { timeout: 1400 } : {})}>
                                    <Box p={1} flexShrink={0}>
                                      <Button variant="contained" onClick={this.resetCode} startIcon={<RotateLeftIcon />} disabled={this.state.isLoading} color="primary">
                                        Reset code
                                    </Button>
                                    </Box>
                                  </Slide>
                                </Box>
                                <Box mt={1} style={{ height: '500pz' }}>
                                  <AceEditor
                                    mode="java"
                                    theme={theme}
                                    onChange={this.updateUserCode}
                                    // name="blah2"
                                    fontSize={14}
                                    showPrintMargin={true}
                                    // editorProps={{ $blockScrolling: true }}
                                    enableBasicAutocompletion={this.state.isAutocomplete}
                                    enableLiveAutocompletion={this.state.isAutocomplete}
                                    enableSnippets={true}
                                    value={this.state.userCode}
                                    showLineNumbers={true}
                                    width="100%"
                                    // height="50%"
                                    tabSize={0}
                                  />
                                </Box>
                                {/* <div
                                  className="reset_code"
                                  style={{
                                    position: "absolute",
                                    bottom: 10,
                                    right: 20,
                                    zIndex: 9
                                  }}
                                >
                                  <button
                                    onClick={this.resetCode}
                                    style={{
                                      fontSize: 12,
                                      padding: "6px 8px",
                                      cursor: "pointer",
                                      background: "#ef5350",
                                      fontWeight: "bold"
                                    }}
                                  >
                                    Reset code
                                </button>
                                </div> */}
                                {/* <div
                                  className="reset_code"
                                  style={{
                                    position: "absolute",
                                    bottom: 10,
                                    right: 110,
                                    zIndex: 9
                                  }}
                                >
                                  <button
                                    onClick={() =>
                                      this.beautifyCode(this.state.userCode)
                                    }
                                    style={{
                                      fontSize: 12,
                                      padding: "6px 8px",
                                      cursor: "pointer",
                                      background: "#3d5afe",
                                      fontWeight: "bold"
                                    }}
                                  >
                                    Beautifier code
                                </button>
                                </div> */}
                              </div>
                            </div>
                            <Grid container xs={12} md={12} sm={12}>
                              <Grid item xs={10} md={10} sm={10}>
                                <div className="resultPanel">
                                  {this.state.result.stdout !== undefined ||
                                    this.state.result.errorRuntime !== undefined ? (
                                      <ResultPanel
                                        unit_tests={minitask.unit_tests} // truyền unit test vô chỉ là tạm thời, chứ unitest này phải lấy từ result
                                        result={this.state.result}
                                      />
                                    ) : (
                                      <TestsPanel
                                        isLoading={this.state.isLoading}
                                        unit_tests={minitask.unit_tests}
                                      />
                                    )}
                                </div>
                              </Grid>
                              <Divider />
                              <Grid container style={{ backgroundColor: "white" }} justify="center" alignContent="flex-start" item xs={2} md={2} sm={2}>
                                <div
                                  className="runtest-area"
                                  style={{
                                    // minHeight: "40px",
                                    // padding: "10px 20px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "flex-end"
                                  }}
                                >
                                  <div style={{ marginLeft: 20, color: "#4DBF9D" }}>
                                    {renderPassedTestCount()}
                                  </div>
                                  <div style={{ marginLeft: 30 }}>
                                    {/* <button
                            className={`execute_btn ${this.state.isLoading &&
                              "disable_btn"}`}
                            style={{ display: "flex", alignItems: "center" }}
                            onClick={this.executeCode}
                            disabled={this.state.isLoading}
                          >
                            {this.state.isLoading
                              ? "Đang thực thi"
                              : "Thực thi"}
                            <img
                              src={require("./play-button.svg")}
                              alt=""
                              style={{ height: "10px", marginLeft: "3px" }}
                            ></img>
                          </button> */}
                                  </div>
                                  <Slide in={true} direction="left" {...(true ? { timeout: 1400 } : {})}>
                                    <Box>
                                      {btnSubmit}
                                    </Box>
                                  </Slide>
                                  {this.props.user.next_minitask !== undefined ? (
                                    <div style={{ marginLeft: 30, fontSize: 12 }}>
                                      {this.props.user.next_minitask.id === "" ? (
                                        <Link
                                          to={`/profile/courses/${params.courseId}/tasks`}
                                          style={{
                                            textDecoration: "none",
                                            color: "#595959"
                                          }}
                                        >
                                          Qua bài mới
                                        </Link>
                                      ) : (
                                          <Link
                                            to={`/tasks/${this.props.user.next_minitask.id}/${params.courseId}/${params.taskId}`}
                                            style={{
                                              textDecoration: "none",
                                              color: "#595959"
                                            }}
                                          >
                                            Qua bài mới
                                          </Link>
                                        )}
                                    </div>
                                  ) : (
                                      <div></div>
                                    )}
                                </div>
                              </Grid>
                            </Grid>
                          </Split>
                        </div>
                      </div>
                    </Split>{" "}
                    {/* </MediaQuery>*/}
                    {/* <MediaQuery maxDeviceWidth={700}>
                  {" "}
                  <div
                    style={{
                      top: "50%",
                      left: "50%",
                      position: "fixed",
                      transform: `translate(-50%,-50%)`,
                      textAlign: "center"
                    }}
                  >
                    Không hỗ trợ code bằng điện thoại
                  </div>
                </MediaQuery> */}
                  </div>
                </div>
              </div>
            )}

          <ToastContainer
            enableMultiContainer
            containerId={"B"}
            position={toast.POSITION.TOP_RIGHT}
          />
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.rootReducer.auth,
  errors: state.rootReducer.errors,
  user: state.rootReducer.user
});

export default connect(mapStateToProps, {
  submitUpdateMinitask,
  setUndefinedNextMinitask
})(MiniTaskPage);
