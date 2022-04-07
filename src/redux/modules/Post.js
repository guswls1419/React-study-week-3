import { createAction, handleActions } from "redux-actions";
import {produce} from "immer";
import { bindActionCreators } from "redux";
import { firestore, storage } from "../../shared/firebase";
import moment from "moment";

import { actionCreators as imageActions } from "./image";

const SET_POST = "SET_POST"; // 생성
const ADD_POST = "ADD_POST"; // 추가
const EDIT_POST = "EDIT_POST";//수정
const DELETE_POST = "DELETE_POST";//삭제

const setPost = createAction(SET_POST,(post_list) => ({post_list}));
const addPost = createAction(ADD_POST,(post) => ({post}));
const editPost = createAction(EDIT_POST,(post_id,post) => ({post_id,post})); 
const deletePost = createAction(DELETE_POST,(post_id) => ({post_id})); 
//수정하려면 id가있어야 어떤걸 수정할지 알수있다, 그리고 확인할 post정보가 필요



const initialState = {// 리듀서가 사용할 애
    list : [], 
    paging:{start: null, next:null, size:3},
    is_lodading : false,
    Layout : "bottomImg",
}

const initialPost = { // 게시글 하나에 대해 기본적으로 들어가야하는 값
//     id: 0,
//     user_info : { 리덕스에 이미 들어있는값들
//         user_name: "HyunJin",
//         user_profile : "http://th1.tmon.kr/thumbs/image/f9f/661/078/258e751b2_700x700_95_FIT.jpg"
//    },
   image_url : "http://th1.tmon.kr/thumbs/image/f9f/661/078/258e751b2_700x700_95_FIT.jpg",
   contents : "귀여운 오리",
   comment_cnt : 0,
   Layout : "bottomImg",
   insert_dt : moment().format("YYYY-MM-DD hh:mm:ss"),
   //moment를사용하면 오늘 날짜시간을 알수있다. (자바스크립트 라이브러리)
  //format은 moment에 내장되어있는 함수로, 날짜형식을 지정할수있다.

   // insert_dt : "2022-04-01 15:00:00",
};


//middleware actions

//삭제
const deletePostFB = (post_id) => {//post의 값이 없을경우 바로 튕겨내버리기 위해 기본값을 null으로 준다.
    return function (dispatch, getState, {history}){ 

   //console.log(post_id)

    if (!post_id) {
       // console.log("게시물 정보가 없어요!");
        return;
      }

    const postDB = firestore.collection("post"); 
        postDB.doc(post_id).delete().then(() => {
            dispatch(deletePost(post_id))
            history.replace('/');
        }).catch((error) => {
            window.alert("삭제에 문제가 있습니다.")
           // console.log("삭제에 문제가 있습니다.", error);
            
        });

    }

}


// 실제로도 파이어베이스에 값이 바뀌어야하기때문에
const editPostFB = (post_id = null , post = {}) => {//post의 값이 없을경우 바로 튕겨내버리기 위해 기본값을 null으로 준다.
    return function (dispatch, getState, {history}){ 
        //이미지를 수정하는사람이있고 아닌사람이 있을수 있기때문에 
        //프리뷰,post에들어있는 기본이미지,유저가 업로드한 이미지를 모두 비교해서
        //수정된 값이 있는지없는지 확인한다.

    if(!post_id){//post id가 없으면 오류가 나기때문에 조건문을 걸어준다.
        window.alert("게시물 정보가 없어요!")
        return;
    }
    const _image = getState().image.preview; //프리뷰에 있는 이미지 값
    //console.log(_image)
    
    const _post_idx = getState().post.list.findIndex(p =>p.id === post_id); //post에들어있는 기본이미지값의 인덱스
    const _post = getState().post.list[_post_idx];
   // console.log(_post)

    const postDB = firestore.collection("post"); //수정할 콜렉션을 가져온다.

    

        if(_image === _post.image_url){ //프리뷰에 있는 이미지와 지금 선택한 포스트의 이미지가 같은지 확인
                                        //같으면 이미지 수정한것없으니 게시글만 수정하면됨
            postDB.doc(post_id).update(post).then(doc => {// db에서 해당 id값만가져와서 수정
                dispatch(editPost(post_id, {...post}))
                history.replace('/');
            }) ;

            return;
        }else{ // 프리뷰랑 post에 저장되어있는 이미지가 같지않은경우
              // add하는것과 같이 이미지를 먼저 업로드하고 이미지 다운로드 url을 받아서 쓴다.
            const user_id = getState().user.user.uid;
            const _upload = storage
                .ref(`images/${user_id}_${new Date().getTime()}`)
                .putString(_image, "data_url");//이미지 업로드
                //이미지 타입이 string,// 중복된이름의 값이 들어오지않도록 유저의 id랑 시간을 묶어서 가져온다.
                //getTime 은 밀리초단위
                // 묶을때는  _ 나  : 을 사용해서 묶을수 있다.

            _upload.then(snapshot => {
            snapshot.ref.getDownloadURL().then(url => {// 성공하면 보여주는값
               // console.log(url); // 다운로드 url로 데이터모양 만들기

                return url; //  return url하고 .then을 사용하면 url을 가져다 쓸수가 있다.
            }).then(url => { //체인을 묶어주는것
                postDB.doc(post_id)
                .update({...post, image_url:url})// 이미지 업로드
                .then(doc => {// db에서 해당 id값만가져와서 수정
                    dispatch(editPost(post_id, {...post, image_url:url}))//게시글내용와 이미지 모두 수정
                    history.replace('/');
                }) ;
            }).catch((err)=>{
                window.alert("이미지 업로드에 문제가 있습니다.")
               // console.log("이미지 업로드에 문제가 있습니다.", err)
            })

            })

        }

    }

}


const addPostFB = (contents="",Layout="") => { // 이미 유저정보는 리덕스에 들어가있는상태
    return function (dispatch, getState, {history}){
           // console.log(dispatch, getState)
        const _user = getState().user.user;
        
        const postDB = firestore.collection("post")
        const user_info = {//리덕스에 이미 저장되어있는값
            user_name : _user.user_name,
            user_id : _user.uid,
            user_profile : _user.user_profile
        }
        const _post = {// 위에 만들어놓은값 가져오기
            ...initialPost,
            contents:contents,
            Layout:Layout,
            insert_dt : moment().format("YYYY-MM-DD hh:mm:ss")
            // 위에도 만들어놨는데 또 선언하는건, 만들어지는 시점때문이다.
            //ddPostFB함수가 실행이되어야만 insert_dt이 만들어지기때문
        };//console.log(Layout)

        const _image = getState().image.preview;
        // 이미지를 게시글 작성할때 같이 넘기기 위해 프리뷰가져오기

       // console.log(_image)
       // console.log(typeof _image)

        const _upload = storage.ref(`images/${user_info.user_id}_${new Date().getTime()}`)
                        .putString(_image, "data_url");//이미지 업로드
        //이미지 타입이 string,// 중복된이름의 값이 들어오지않도록 유저의 id랑 시간을 묶어서 가져온다.
        //getTime 은 밀리초단위
        // 묶을때는  _ 나  : 을 사용해서 묶을수 있다.

        _upload.then(snapshot => {
            snapshot.ref.getDownloadURL().then(url => {// 성공하면 보여주는값
               // console.log(url); // 다운로드 url로 데이터모양 만들기

                return url; //  return url하고 .then을 사용하면 url을 가져다 쓸수가 있다.
            }).then(url => { //체인을 묶어주는것
                postDB.add({...user_info, ..._post, image_url:url}).then((doc) =>{//추가된값, 추가된 doc에는id가 들어온다.
                    let post = {user_info, ..._post, id:doc.id, image_url:url} //파이어스토어에 넣는 모양새 맞춰서 넣기
                    dispatch(addPost(post)); //모양새 맞춰준 데이터값
                    history.replace('/');

                    dispatch(imageActions.setPreview(null));
                    //파일 업로드하고 프리뷰 안지워주면 
                    // 이미 리덕스에 프리뷰가 저장되어있어 업로드한사진이아닌
                    // 프리뷰사진이 계속 나오므로, 프리뷰를 null값으로 바꿔준다.
                })
                .catch((err)=>{//에러가 났을경우
                    window.alert("post작성에 실패했습니다")
                  //  console.log("post작성에 실패했습니다", err)
                });
            }).catch((err)=>{
                window.alert("이미지 업로드에 문제가 있습니다.")
               // console.log("이미지 업로드에 문제가 있습니다.", err)
            })

        })


        // console.log({...user_info, ..._post}) 
        // return; //위에서 리턴하면 아래쪽은 실행이안된다. 데이터 확인용

       
        //콜렉션에 데이터를 추가할때 add를 사용해서 추가한다 ~~~.add({asdfdf})
    }
}



const getPostFB = () => {
    return function (dispatch, getState, {history}){
        const postDB = firestore.collection("post"); //파이어스토어에있는 데이터에 접근
        postDB.get().then((docs)=>{ //postDB.get하면 데이터들이 들어온다(docs로 받아옴)
            let post_list = [];
            docs.forEach((doc)=>{//docs 를forEach로 돌려서 하나하나 가져온다
               //console.log(doc.id,doc.data())

            // // 파이어스토어의 데이터와, 현재 프로젝트내에 데이터가 상이함으로 맞춰주는작업
            // let _post = {
            //     id : doc.id,
            //     ...doc.data() //doc에 있는데이터를 모두 data로 넣어준다.
            // };

            // let post = { //파이어스토어에서 가져오는 값
            //     id : doc.id,
            //     user_info : {
            //         user_name: _post.user_name,
            //         user_profile : _post.user_profile,
            //         user_id : _post.user_id
            //    },
            //    image_url :  _post.image_url,
            //    contents :  _post.contents,
            //    comment_cnt :  _post.comment_cnt,
            //    insert_dt :  _post.insert_dt,
            // };

            //고수의 코드
            let _post = doc.data(); //doc에 있는데이터를 모두 data로 넣어준다.
                   
                let post = Object.keys(_post).reduce((acc,cur)=> {
                    //키값만 뽑아서 배열만들기
                    if(cur.indexOf("user_") !== -1){
                        return {...acc, user_info: {...acc.user_info,[cur]: _post[cur]}
                    };
                    }
                    return{ ...acc,[cur]:_post[cur]};
                },{id: doc.id, user_info: {}});


                post_list.push(post);//setpost로 값을 넘겨야해서 
                                    //forEach로만든 post의 값이 모두 하나의 배열에 들어가야한다.
            })
           // console.log(post_list);

            dispatch(setPost(post_list));
        })
    }
}

//댓글창
const getOnePostFB = (id) => { //id사용해서 db에서 데이터 가져오기
    return function(dispatch, getState, {history}){
        const postDB = firestore.collection("post");
        postDB.doc(id).get().then(doc => {
          //  console.log(doc);
          //  console.log(doc.data());
        

        let _post = doc.data(); //doc에 있는데이터를 모두 data로 넣어준다.
                   
        let post = Object.keys(_post).reduce((acc,cur)=> { // 데이터형식 맞춰주는작업
            //키값만 뽑아서 배열만들기
            if(cur.indexOf("user_") !== -1){
                return {...acc, user_info: {...acc.user_info,[cur]: _post[cur]}
            };
            }
            return{ ...acc,[cur]:_post[cur]};
        },{id: doc.id, user_info: {}}
        );

           dispatch(setPost([post])); 
        })
    }
}



//recucer
export default handleActions(
    {
        [SET_POST] : (state, action) => produce(state, (draft) => {
            draft.list.push(...action.payload.post_list);

            draft.list = draft.list.reduce((acc,cur) => {
                if(acc.findIndex(a => a.id === cur.id) === -1){//post id가 현재 가지고있는id와 같은지 찾고 post에서의 인덱스 반환
                                                        //-1이 나오면 중복된값이 없다는 뜻
                return [...acc, cur]; // 중복된 값이 없을때 [기존배열, 현재값 ]
                }else{
                    acc[acc.findIndex(a => a.id === cur.id)] = cur; //중복된값은 최근값으로 덮어씌우는작업
                    return acc; //누적된 값이니 중복값추가안한고 누적된값고대로
                }
              },[]);        

              if(action.payload.paging){ //페이징 처리 확인
                draft.paging = action.payload.paging;
              }
            draft.paging = action.payload.paging;
            draft.is_lodading = false;

          // post하나를 가져오는데, 다시 목록창으로 넘어갔을경우, 조금전 post가 포함되어있을수있어서, 중복값 제거
        }), //draft에있는 list를 post_list로 넘어온값으로 바꾼다.

        [ADD_POST] : (state, action) => produce(state, (draft) => {
            draft.list.unshift(action.payload.post); //push를 하면 젤 뒤쪽에 붙음으로 unshift를 해준다.
        }),
        [EDIT_POST] : (state, action) => produce(state, (draft) => {
            let idx = draft.list.findIndex((p) => p.id === action.payload.post_id); //id로 뭘고칠지 찾아서 수정해야하는데,EDIT_POST작성 후 파이어베이스에서 데이터를 가져온다.
            
            draft.list[idx] = {...draft.list[idx], ...action.payload.post};
        }),// 수정해야할 post id 값 의 post값을 다 가져온다.

        [DELETE_POST] : (state, action) => produce(state, (draft) => {
        //     let idx = draft.list.findIndex((p) => p.id === action.payload.post_id); //id로 뭘고칠지 찾아서 수정해야하는데,EDIT_POST작성 후 파이어베이스에서 데이터를 가져온다.
        //     let a = draft.list[idx]
        //    return state.set(draft.list, draft.list.delete(a))
        draft.list = draft.list.filter((a) => a.id !== action.payload.post_id);
        })//필터함수로 action에서 넘겨준 id값을 찾아 제외시킨다.
    }, initialState
);

const actionCreators = {
    setPost,
    addPost,
    editPost,
    getPostFB,
    addPostFB,
    editPostFB,
    getOnePostFB,
    deletePostFB
}

export {actionCreators}