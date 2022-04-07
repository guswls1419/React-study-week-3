import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore } from "../../shared/firebase";
import "moment";
import moment from "moment";
import firebase from "firebase";
import { actionCreators as postActions } from "./Post"
import Post from "./Post";


const SET_COMMENT = "SET_COMMENT";
const ADD_COMMENT = "ADD_COMMENT";

const LOADING = "LOADING";

const setComment = createAction(SET_COMMENT, (post_id, comment_list) => ({post_id, comment_list}));
const addComment = createAction(ADD_COMMENT, (post_id, comment) => ({post_id, comment}));

const loading = createAction(LOADING, (is_loading) => ({ is_loading }));

const initialState = {
  list: {},
  is_loading: false,
};


const addCommentFB = (post_id, contents) => {//db에 contents라고 초기값 적었기때문에contents로가져옴(comment_text값)
  return function(dispatch,getState, {history}){
    const commentDB = firestore.collection("comment");
    const user_info = getState().user.user;

    let comment = {
      post_id: post_id,
      user_id: user_info.uid,
      user_name: user_info.user_name,
      user_profile: user_info.user_profile,
      contents: contents,
      insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
      }

      commentDB.add(comment).then((doc) => {//then에 들어오는건 성공했을경우니깐, 댓글 갯수증가하는작업도 같이해준다.
        const postDB = firestore.collection("post");

        const post = getState().post.list.find((l) => l.id === post_id);
        //post정보 가져오기(댓글수 업데이트 ) // 이리스트 하나에서 id가 내가가지고있는 id가 같은지확인

        const increment = firebase.firestore.FieldValue.increment(1);
        //increment(1) 에 들어가있는 숫자만큼 현재가지고있는 값에서 추가해준다.
        postDB.doc(post_id).update({comment_cnt: increment}).then((_post) => {
          dispatch(addComment(post_id, comment));

          if (post) {
            dispatch(
            postActions.editPost(post_id, {
            comment_cnt: parseInt(post.comment_cnt) + 1,
            })
            );
          }
          
        })
      })
  }
}


const getCommentFB = (post_id = null) => {// 넘겨주는 값?
    return function(dispatch, getState, {history}){

      if(!post_id){//id가 없으면 쿼리검색이 불가함으로 if문으로 막아버림
        return;
      }
      const commentDB = firestore.collection("comment");

      commentDB
      .where("post_id", "==", post_id) //id가 같은지 확인, 
      .orderBy("insert_dt","desc")//확인후 orderBy로 정렬(일시, 역순으로)
      .get().then((docs)=>{// 가져와서 then
        let list = [];

        docs.forEach((doc)=> {
          list.push({...doc.data(), id: doc.id});//comment id를 가져와서 배열을 만들어준다
        })
        
        dispatch(setComment(post_id, list)); //액션생성자에서 넘겨준값과 동일하게 넘겨줘야함
      }).catch(err => {
          window.alert("댓글정보를 가져올수가 없네요!",err);
      })
    };
};


export default handleActions(
  {// let data = {[post_id] : com_list, ...} 방을 만들어서 사용(딕셔너리) - 불필요한 데이터요청을 줄이기 위함
      [SET_COMMENT]: (state, action) => produce(state, (draft) => {//post_id로 방만들기
        draft.list[action.payload.post_id] = action.payload.comment_list;
      }),
      [ADD_COMMENT]: (state, action) => produce(state, (draft) => {
      
        draft.list[action.payload.post_id].unshift(action.payload.comment);
        console.log(action.payload.comment)
        }), 
      // [LOADING]: (state, action) => 
      // produce(state, (draft) => {
      //   draft.is_loading = action.payload.is_loading;
      // })
  },
  initialState
);

const actionCreators = {
  getCommentFB,
  setComment,
  addComment,
  addCommentFB
};

export { actionCreators };