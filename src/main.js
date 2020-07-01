import React, { Component } from 'react';
// ユーザー情報をインポート
import users from './userList';


//メインクラス
export default class Main extends Component {
  //最初に呼ばれる データの取得など行う
  constructor(props) {
    super(props);

    // データを初期
    var jsonFlag= localStorage.getItem('flag');
    var flag = JSON.parse(jsonFlag);

    // ローカルのデータを取得
    var postDate = JSON.parse(localStorage.getItem('post'));// 投稿
    var selectUserDate= JSON.parse(localStorage.getItem('selectUser'));//セレクトユーザー

    // オブジェクト情報を取得
    var setUserList = Object.keys(users).map(key => users[key]);
    console.log("post","selectuser","flag",postDate, selectUserDate,flag)

    // 初期データの時とそれ以外で判定
    if(flag === true){
      this.state = {
        userList: setUserList,
        selectedUser: selectUserDate,
        id: selectUserDate.id,
        posts: postDate,
        newPost: '',
        disabled: true
      };
      console.log("state",this.state);
    }
    else{
      this.state = {
        userList: setUserList,
        selectedUser: setUserList[0],
        id: 0,
        posts: [],
        newPost: '',
        disabled: true
      };
      localStorage.setItem('flag',JSON.stringify(true))
      localStorage.setItem('post',JSON.stringify([]))
      localStorage.setItem('selectUser',JSON.stringify(setUserList[0]))
    }
    //console.log("date",tododate)
  }
  // 入力値関数
  onInput = (e) => {
    const word = e.target.value
    console.log(word.length)
    if(word.length>= 5){
      this.setState({
        newPost: e.target.value,
        disabled: false
      });
    }
    else{
      this.setState({
        disabled: true
      });
    }
  }
  // 追加関数
  addTodo = () => {
    const {posts,newPost} = this.state
    const updatePost = this.state.posts

    updatePost.push(newPost)
    this.setState({
      posts: updatePost
    });
    // ローカルステレージにデータを保存
    localStorage.setItem('post',JSON.stringify(posts))
  }
  //削除関数
  removeTodo = (index) => {
    const { posts } = this.state;
    const updatePost = this.state.posts
    
    updatePost.splice(index,1)
    console.log(index,updatePost)
    this.setState({
      posts: updatePost
    });
    localStorage.setItem('post',JSON.stringify(posts))
  }
  
  // ユーザー選択
  selectUser(event){
    const updateuser = this.state.userList
    const id = event.target.value
    console.log('id',id);
    
    //updateuser[id].point = updateuser[id].point + 10
    this.setState({
      selectedUser: updateuser[id],
      id: id
    });
    //ローカルに保存
    localStorage.setItem('selectUser',JSON.stringify(updateuser[id]))
  }

  //htmlに反映
  render() {
    const { posts,userList,selectedUser } = this.state;

    const userItmes = userList.map((user) =>
      <option key={user.id} value={user.id}>
        {user.name}
      </option>
    );

    //html表示部分
    return (
    <div>
    <h1>称賛アプリ</h1>
      <div>
        <img src={selectedUser.image} alt="user"></img>
        <select size="1" value={this.state.id} onChange={ (e)=>{ this.selectUser(e)} }>{userItmes}</select>
        <p>名前{selectedUser.name}</p>
        <p>拍手できるポイント:{selectedUser.applausePoint}</p>
        <p>拍手されたポイント:{selectedUser.applaudedPoint}</p>
      </div>
      <form>
        <textarea type="text" onInput={this.onInput} ></textarea>
        <button onClick={this.addTodo} disabled={this.state.disabled}>登録</button>
      </form>
      <ul>
        {posts.map((post, index) => <li key={index}>
          {post}
          <button onClick={() => { this.removeTodo(index) }}>削除</button>
        </li>)}
      </ul>
    </div>);
  }
}