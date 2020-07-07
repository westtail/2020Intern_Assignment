import React, { Component } from 'react';
import moment from 'moment';
import ReactTooltip from 'react-tooltip'
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

    //２回目以降のデータ初期化
    if(flag === true){

      // 送信先ユーザーリストを作成
      var setSendUserList = []
      Object.assign(setSendUserList , setUserList);
      setSendUserList.splice([selectUserDate.id],1)

      this.state = {
        userList: userListDate,
        selectedUser: selectUserDate,
        selectedId: selectUserDate.id,
        postList: postListDate,
        newPost: '',
        disabled: true,
        sendUserList: setSendUserList,
        sendId: sendToUserDate.id,
        sendToUser: sendToUserDate,
      };
    }
    //１回目のデータ初期化
    else{

      // 送信先ユーザーリストを作成
      var setFirstSendUserList = []
      Object.assign(setFirstSendUserList , setUserList);
      setFirstSendUserList.splice([0],1)

      this.state = {
        userList: setUserList,
        selectedUser: setUserList[0],
        selectedId: 0,
        postList: [],
        newPost: '',
        disabled: true,
        sendUserList: setFirstSendUserList,
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
    const {newPost,selectedUser,sendToUser,userList} = this.state
    const updatePostList = this.state.postList
    const postTimeStamp = moment().format('YYYY/MM/DD/hh:mm:ss')

    const applauseList = Object.keys(userList).map(key => [userList[key].name,0])

    // 投稿情報をオブジェクトとして保存
    const newPostList = {post: newPost, sender: selectedUser, receiver: sendToUser, postTime: postTimeStamp,
      applause: applauseList,　applauseSum: 0, applauseDisabled: true}

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

    if (selectedUser.name === senderUser.name || selectedUser.name === receiverUser.name || updateUserList[selectedUser.id].applausePoint <= 0 || updatePost[index].applause[selectedUser.id][1] >= 15){

    }
    else{
    updatePost[index].applause[selectedUser.id][1] = updatePost[index].applause[selectedUser.id][1] + 1
    updateUserList[selectedUser.id].applausePoint = updateUserList[selectedUser.id].applausePoint -2
    updateUserList[senderUser.id].applaudedPoint = updateUserList[senderUser.id].applaudedPoint +1
    updateUserList[receiverUser.id].applaudedPoint = updateUserList[receiverUser.id].applaudedPoint +1
    updatePost[index].applauseSum = Object.keys(updatePost[index].applause).map(key => updatePost[index].applause[key][1])
    updatePost[index].applauseSum = updatePost[index].applauseSum.reduce(function(a, x){return a + x;})

    }
    if(updateUserList[selectedUser.id].applausePoint <= 0 || updatePost[index].applause[selectedUser.id][1] >= 15){
      updatePost[index].applauseDisabled = true
    }
    
    this.setState({
      selectedUser: updateUserList[selectedUser.id],
      postList: updatePost,
      userList: updateUserList
    });
    localStorage.setItem('selectUser',JSON.stringify(updateUserList[selectedUser.id]))
    localStorage.setItem('postList',JSON.stringify(updatePost))
    localStorage.setItem('userList',JSON.stringify(updateUserList))
  }
  
  // ユーザー選択
  selectUser(event){
    const userList = this.state.userList
    const selectId = event.target.value
    const checkList = this.state.postList
    // 送信先ユーザーのアップデート
    var updateSendUserList = []
    Object.assign(updateSendUserList, userList);
    updateSendUserList.splice([selectId],1)

    Object.keys(checkList).map(key => {
      if(userList[selectId].name === checkList[key].sender.name || userList[selectId].name === checkList[key].receiver.name || userList[selectId].applausePoint <= 0 || checkList[key].applause[selectId][1] >= 15){
        checkList[key].applauseDisabled = true
      }
      else{
        checkList[key].applauseDisabled = false
      }})
    this.setState({
      selectedUser: userList[selectId],
      selectedId: selectId,
      sendUserList: updateSendUserList,
      sendToUser: updateSendUserList[0],
      sendId: updateSendUserList[0].id,
      postList: checkList
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
    <div className = "main">
      <div>
        <h1>称賛アプリ</h1>
      </div>

      <div className = "user">
        <div className= "userImage">
          <img src={selectedUser.image} alt="user"></img>
          <div className= "chengeUser ">
            <select size="1" value={this.state.selectedId} onChange={ (e)=>{ this.selectUser(e)} }>{userItmes}</select>
          </div>
        </div>
        <div className= "userParameter">
          <p>拍手できるポイント:{selectedUser.applausePoint}</p>
          <p>拍手されたポイント:{selectedUser.applaudedPoint}</p>
        </div>
      </div>

      <div className = "sendUser">
        <div className = "sendUserImage">
          <img src={sendToUser.image} alt="ch"></img>
          <div className = "chengeSendUser">
            <select size="1" value={this.state.sendId} onChange={ (e)=>{ this.selectSendToUser(e)} }>{sendUserItmes}</select>
          </div>
        </div>
        <div className = "inputPostForm">
          <form>
            <textarea type="text" onInput={this.onInput} ></textarea>
            <button onClick={this.addPost} disabled={this.state.disabled}>投稿</button>
          </form>
        </div>
      </div>

      <div className = "post">
      <h5>投稿</h5>
        <ul>
          {postList.map((post, index) => <li key={index}>
            <p className = "postpost">投稿内容 : {post.post}</p>
            <p data-tip={post.applause} data-for='global' className = "postpoint">
              拍手ポイント{post.applauseSum}
              <button data-tip={post.applause} data-for='global' onClick={() => { this.addApplause(index) }} disabled={post.applauseDisabled} >拍手</button>
            </p>
            <p className = "postdatea">
              送信元 :  {post.sender.name}<br></br>
              送信先 :  {post.receiver.name}<br></br>
              日時 :  {post.postTime}<br></br>
            </p>
            <ReactTooltip id='global'  aria-haspopup = 'true' getContent={(dataTip) => `拍手してくれた人  ${dataTip}`}/>
          </li>)}
        </ul>
      </div>
    </div>);
  }
}