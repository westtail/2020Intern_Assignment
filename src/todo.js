import React, { Component } from 'react';

//todoクラス
export default class Todo extends Component {
  //最初に呼ばれる
  constructor(props) {
    super(props);
    var jsontodo= localStorage.getItem('todo');
    var tododate = JSON.parse(jsontodo);
    // データを初期
    this.state = {
      todos: tododate,
      name: ''
    };
    //console.log("date",tododate)
  }
  // 入力値関数
  onInput = (e) => {
    this.setState({
      name: e.target.value
    });
  }
  // 追加関数
  addTodo = () => {
    const { todos, name } = this.state;
    const updatetodo = this.state.todos
    updatetodo.push(name)
    this.setState({
      todos: updatetodo
    });
    var obj = JSON.stringify(todos);
    localStorage.setItem('todo',obj)
  }

  removeTodo = (index) => {
    const { todos, name } = this.state;
    this.setState({
      todos: [...todos.slice(0, index), ...todos.slice(index + 1)]
    });
  }
  //htmlに反映
  render() {
    const { todos } = this.state;

    //html表示部分
    return (<div>
      <input type="text" onInput={this.onInput} />
      <button onClick={this.addTodo} >登録</button>
      <ul>
        {todos.map((todo, index) => <li key={index}>
          {todo}
          <button onClick={() => { this.removeTodo(index) }}>削除</button>
        </li>)}
      </ul>
    </div>);
  }
}