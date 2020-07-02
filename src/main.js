import React, { Component } from 'react';
import moment from 'moment';
// ユーザー情報をインポート
import users from './userList';

//メインクラス
export default class Main extends Component {
  //最初に呼ばれる データの取得など行う
  constructor(props) {
    super(props);

    // ユーザーデーター取得
    var setUserList = Object.keys(users).map(key => users[key]);

    // ローカルのデータを取得
    var flag = JSON.parse(localStorage.getItem('flag'));// データが初期状態か確認する
    var userListDate = JSON.parse(localStorage.getItem('userList'));// ユーザーデータ
    var postListDate = JSON.parse(localStorage.getItem('postList'));// 投稿
    var selectUserDate= JSON.parse(localStorage.getItem('selectUser'));//セレクトユーザー
    var sendToUserDate= JSON.parse(localStorage.getItem('sendToUser'));//送信先ユーザー
    console.log("userListDate","postListDate","selectUserDate",userListDate,postListDate,selectUserDate);


    //２回目以降のデータ初期化
    if(flag === true){

      // 送信先ユーザーリストを作成
      var setSendUserList = []
      Object.assign(setSendUserList , setUserList);
      setSendUserList.splice([selectUserDate.id],1)

      this.state = {
        userList: setUserList,
        selectedUser: selectUserDate,
        selectedId: selectUserDate.id,
        postList: postListDate,
        newPost: '',
        disabled: true,
        sendUserList: setSendUserList,
        sendId: sendToUserDate.id,
        sendToUser: sendToUserDate,
      };
      console.log("state",this.state);
    }
    //１回目のデータ初期化
    else{

      // 送信先ユーザーリストを作成
      var setSendUserList = []
      Object.assign(setSendUserList , setUserList);
      setSendUserList.splice([0],1)

      this.state = {
        userList: setUserList,
        selectedUser: setUserList[0],
        selectedId: 0,
        postList: [],
        newPost: '',
        disabled: true,
        sendUserList: setSendUserList,
        sendId: 1,
        sendToUser: setUserList[1],
      };
      // もしデータ変更をしていない場合用にローカルに設定
      localStorage.setItem('userList',JSON.stringify(setUserList))
      localStorage.setItem('flag',JSON.stringify(true))
      localStorage.setItem('postList',JSON.stringify([]))
      localStorage.setItem('selectUser',JSON.stringify(setUserList[0]))
      localStorage.setItem('sendToUser',JSON.stringify(setUserList[1]))
    }
  }
  // 入力値関数
  onInput = (e) => {
    const inPutWord = e.target.value
    if(inPutWord.length>= 5){
      this.setState({
        newPost: inPutWord,
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
  addPost = () => {
    const {newPost,selectedUser,sendToUser} = this.state
    const updatePostList = this.state.postList

    const postTimeStamp = moment().format('YYYY/MM/DD/hh:mm:ss')

    const newPostList = {post: newPost, sender: selectedUser, receiver: sendToUser, postTime: postTimeStamp,
      applause: 0}
    console.log("newPostList",newPostList)
    updatePostList.push(newPostList)

    this.setState({
      postList: updatePostList
    });
    // ローカルステレージにデータを保存
    localStorage.setItem('postList',JSON.stringify(updatePostList))
  }
  //拍手機能
  addApplause = (index) => {
    const {selectedUser} = this.state
    const updatePost = this.state.postList
    const updateUserList = this.state.userList

    const receiverUser = updatePost[index].receiver
    const senderUser = updatePost[index].sender

    if (selectedUser.name === senderUser.name || selectedUser.name === receiverUser.name){

    }
    else{
      updatePost[index].applause = updatePost[index].applause + 1
      updateUserList[selectedUser.id].applausePoint = updateUserList[selectedUser.id].applausePoint -2
      updateUserList[senderUser.id].applaudedPoint = updateUserList[senderUser.id].applaudedPoint +1
      updateUserList[receiverUser.id].applaudedPoint = updateUserList[receiverUser.id].applaudedPoint +1
    }
    this.setState({
      postList: updatePost,
      userList: updateUserList
    });
    localStorage.setItem('postList',JSON.stringify(updatePost))
    localStorage.setItem('userList',JSON.stringify(updateUserList))
  }
  
  // ユーザー選択
  selectUser(event){
    const userList = this.state.userList
    const selectId = event.target.value
    // 送信先ユーザーのアップデート
    var updateSendUserList = []
    Object.assign(updateSendUserList, userList);
    updateSendUserList.splice([selectId],1)

    
    this.setState({
      selectedUser: userList[selectId],
      selectedId: selectId,
      sendUserList: updateSendUserList,
      sendToUser: updateSendUserList[0],
      sendId: updateSendUserList[0].id
    });
    //ローカルに保存
    localStorage.setItem('selectUser',JSON.stringify(userList[selectId]))
    localStorage.setItem('sendToUser',JSON.stringify(userList[updateSendUserList[0].id]))
  }

  selectSendToUser(event){
    const updateSentToUser = this.state.userList
    const sendToId = event.target.value
    this.setState({
      sendToUser: updateSentToUser[sendToId],
      sendId: sendToId
    });
    localStorage.setItem('sendToUser',JSON.stringify(updateSentToUser[sendToId]))
  }

  //htmlに反映
  render() {
    const { userList,sendUserList,selectedUser,sendToUser,postList } = this.state;

    const userItmes = userList.map((user) =>
      <option key={user.id} value={user.id}>
        {user.name}
      </option>
    );

    const sendUserItmes = sendUserList.map((user) =>
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
        <select size="1" value={this.state.selectedId} onChange={ (e)=>{ this.selectUser(e)} }>{userItmes}</select>
        <p>名前{selectedUser.name}</p>
        <p>拍手できるポイント:{selectedUser.applausePoint}</p>
        <p>拍手されたポイント:{selectedUser.applaudedPoint}</p>
      </div>
      <form>
        <img src={sendToUser.image} alt="ch"></img>
        <select size="1" value={this.state.sendId} onChange={ (e)=>{ this.selectSendToUser(e)} }>{sendUserItmes}</select>
        <textarea type="text" onInput={this.onInput} ></textarea>
        <button onClick={this.addPost} disabled={this.state.disabled}>登録</button>
      </form>
      <ul>
        {postList.map((post, index) => <li key={index}>
          投稿内容{post.post}-送信元{post.sender.name}-送信先{post.receiver.name}-日時{post.postTime}-拍手ポイント{post.applause}
          <button onClick={() => { this.addApplause(index) }}>拍手</button>
        </li>)}
      </ul>
    </div>);
  }
}