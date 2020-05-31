import React, { Component } from "react";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todoList: [],
      activeItem: {
        id: null,
        title: "",
        completed: false
      },
      editing: false
    };
  }

  getCookie = name => {
    var cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      var cookies = document.cookie.split(";");
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  componentWillMount() {
    this.fetchTasks();
  }

  fetchTasks = () => {
    console.log("fetching....");

    fetch("http://127.0.0.1:8000/api/task-list/")
      .then(response => response.json())
      .then(data =>
        this.setState({
          todoList: data
        })
      );
  };

  handleChange = e => {
    let name = e.target.name;
    let value = e.target.value;
    console.log("value :" + value);

    this.setState({
      activeItem: {
        ...this.state.activeItem,
        title: value
      }
    });
  };

  handleSubmit = e => {
    e.preventDefault(); // stop form-reload
    console.log("item: ", this.state.activeItem);

    let url = `http://127.0.0.1:8000/api/task-create/`;

    if (this.state.editing == true) {
      url = `http://127.0.0.1:8000/api/task-update/${this.state.activeItem.id}`;
      this.setState({
        editing: false
      });
    }

    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(this.state.activeItem)
    })
      .then(response => {
        this.fetchTasks();
        this.setState({
          activeItem: {
            id: null,
            title: "",
            completed: false
          }
        });
      })
      .catch(function(error) {
        console.log("ERROR: ", error);
      });
  };

  startEdit = task => {
    this.setState({
      activeItem: task,
      editing: true
    });
  };

  startDelete = task => {
    fetch(`http://127.0.0.1:8000/api/task-delete/${task.id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json"
      }
    })
      .then(response => {
        this.fetchTasks();
      })
      .catch(function(error) {
        console.log("ERROR: ", error);
      });
  };

  strikeUnstrike = task => {
    task.completed = !task.completed;

    fetch(`http://127.0.0.1:8000/api/task-update/${task.id}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({ completed: task.completed, title: task.title })
    })
      .then(response => {
        this.fetchTasks();
      })
      .catch(function(error) {
        console.log("ERROR: ", error);
      });
    console.log("task", task.completed);
  };

  render() {
    let tasks = this.state.todoList;
    console.log(tasks);
    let self = this;
    return (
      <div className="container">
        <div id="task-container">
          <h2 className="text-center">Todo Lists</h2>
          <div id="form-wrapper">
            <form onSubmit={this.handleSubmit} id="form">
              <div className="flex-wrapper">
                <div style={{ flex: 6 }}>
                  <input
                    type="text"
                    onChange={this.handleChange}
                    id="title"
                    value={this.state.activeItem.title}
                    className="form-control"
                    name="title"
                    placeholder="Add Your New Task"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <input
                    type="submit"
                    id="add"
                    className="btn btn-warning"
                    name="Add"
                    value="Add"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
        <div id="list-wrapper">
          {tasks.map(function(task, index) {
            return (
              <div key={index} className="task-wrapper flex-wrapper">
                <div
                  onClick={() => self.strikeUnstrike(task)}
                  style={{ flex: 7 }}
                >
                  {task.completed == false ? (
                    <span>{task.title}</span>
                  ) : (
                    <strike>
                      {task.title}
                      <sup class="badge badge-success">Done</sup>
                    </strike>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <button
                    onClick={() => self.startEdit(task)}
                    className="btn btn-sm btn-info"
                  >
                    <svg
                      class="bi bi-pencil-square"
                      width="1em"
                      height="1em"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M15.502 1.94a.5.5 0 010 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 01.707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 00-.121.196l-.805 2.414a.25.25 0 00.316.316l2.414-.805a.5.5 0 00.196-.12l6.813-6.814z" />
                      <path
                        fill-rule="evenodd"
                        d="M1 13.5A1.5 1.5 0 002.5 15h11a1.5 1.5 0 001.5-1.5v-6a.5.5 0 00-1 0v6a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5v-11a.5.5 0 01.5-.5H9a.5.5 0 000-1H2.5A1.5 1.5 0 001 2.5v11z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                <div style={{ flex: 1 }}>
                  <button
                    onClick={() => {
                      if (window.confirm("Delete the item?")) {
                        self.startDelete(task);
                      }
                    }}
                    className="btn btn-sm btn-danger delete"
                  >
                    <svg
                      clD:\project-upcoming\development\challan\frontend\src\App.cssass="bi bi-backspace"
                      width="1em"
                      height="1em"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M6.603 2h7.08a1 1 0 011 1v10a1 1 0 01-1 1h-7.08a1 1 0 01-.76-.35L1 8l4.844-5.65A1 1 0 016.603 2zm7.08-1a2 2 0 012 2v10a2 2 0 01-2 2h-7.08a2 2 0 01-1.519-.698L.241 8.65a1 1 0 010-1.302L5.084 1.7A2 2 0 016.603 1h7.08z"
                        clip-rule="evenodd"
                      />
                      <path
                        fill-rule="evenodd"
                        d="M5.83 5.146a.5.5 0 000 .708l5 5a.5.5 0 00.707-.708l-5-5a.5.5 0 00-.708 0z"
                        clip-rule="evenodd"
                      />
                      <path
                        fill-rule="evenodd"
                        d="M11.537 5.146a.5.5 0 010 .708l-5 5a.5.5 0 01-.708-.708l5-5a.5.5 0 01.707 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default App;
