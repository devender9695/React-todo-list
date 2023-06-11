import React from "react";
const { Component } = React;
import deleteIcon from "./delete.png";
import editIcon from "./pencil.png";

class TodoList extends Component {
  constructor() {
    super();
    this.state = {
      todos: [],
      value: "",
      isEditing: false,
      currentId: "",
      currentValue: "",
    };
  }

  componentDidMount() {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      this.setState({
        todos: JSON.parse(savedTodos),
      });
    }
  }

  componentDidUpdate() {
    const { todos } = this.state;
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  handleChange = (e) => {
    this.setState({ value: e.target.value });
  };

  handleAddTask = (e) => {
    e.preventDefault();
    const { value } = this.state;
    if (value !== "") {
      const newTask = {
        name: value,
        id: Date.now(),
        createdAt: new Date().toLocaleString(),
      };
      this.setState((prevState) => ({
        todos: [...prevState.todos, newTask],
        value: "",
      }));
    }
  };

  handleDeleteTask = (itemId) => {
    this.setState((prevState) => ({
      todos: prevState.todos.filter((todo) => todo.id !== itemId),
    }));
  };

  handleEditTodo = (id, newValue) => {
    this.setState((prevState) => ({
      todos: prevState.todos.map((todo) =>
        todo.id === id ? { ...todo, name: newValue } : todo
      ),
    }));
  };

  handleSubmitEditTodo = (e) => {
    e.preventDefault();
    const { currentId, currentValue } = this.state;
    this.handleEditTodo(currentId, currentValue);
    this.setState({ isEditing: false });
  };

  handleToggleEdit = (todo) => {
    const { id, name } = todo;
    this.setState({
      isEditing: true,
      currentId: id,
      currentValue: name,
    });
  };

  handleEditInputChange = (e) => {
    this.setState({ currentValue: e.target.value });
  };

  render() {
    const { value, todos, isEditing, currentValue } = this.state;

    const taskList = todos.map((todo) => (
      <li className="todo_item" key={todo.id}>
        <p>{todo.name}</p>
        <p>Created at: {todo.createdAt}</p>
        <div>
          <button className="btn" onClick={() => this.handleToggleEdit(todo)}>
            <img src={editIcon} alt="Edit" />
          </button>
          <button
            className="btn"
            onClick={() => this.handleDeleteTask(todo.id)}
          >
            <img src={deleteIcon} alt="Delete" />
          </button>
        </div>
      </li>
    ));

    return (
      <div>
        {!isEditing ? (
          <form onSubmit={this.handleAddTask}>
            <input
              placeholder="Type your task"
              value={value}
              onChange={this.handleChange}
              className="todo-input"
            />
            <button type="submit">+ Add task</button>
          </form>
        ) : (
          <form onSubmit={this.handleSubmitEditTodo}>
            <input
              placeholder="Edit your task"
              value={currentValue}
              name={currentValue}
              onChange={this.handleEditInputChange}
            />
            <button type="submit">Update</button>
          </form>
        )}
        <ul className="todo_wrapper">{taskList}</ul>
      </div>
    );
  }
}

export default TodoList;
