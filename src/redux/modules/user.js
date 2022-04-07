import {createAction, handleActions} from "redux-actions"; // actions,reducer편하게만들어주는거
import produce from "immer";

import { setCookie,getCookie,deleteCookie } from "../../shared/Cookie";
import { auth } from "../../shared/firebase";
import firebase from "firebase/app";

//actions
const LOG_IN = "LOG_IN";
const LOG_OUT = "LOG_OUT";
const GET_USER = "GET_USER";
const SET_USER = "SET_USER";

//actions creators
//const logIn = createAction(LOG_IN,(user) => ({user})); 
const logOut = createAction(LOG_OUT,(user) => ({user}));
const getUser = createAction(GET_USER, (user) => ({user}));
const setUser = createAction(SET_USER, (user) => ({user}));
//createAction 을 사용하면 기존의 type:xxx,xxxx => 이런식으로 안쓰고,
// 간결하게 줄여쓸수 있다.


//initialState
const initialState = {
    user: null,
    is_login :false,
}

const user_initial = {
    user_name : 'HyunJin',

}

//middleware actions

//로그인
const loginFB = (id, pwd) => {
    return function (dispatch, getState, {history}){

        auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then((res)=>{
            auth
            .signInWithEmailAndPassword(id, pwd)
            .then((user) => { console.log(user);
                dispatch(setUser({
                    user_name: user.user.displayName, 
                    id: id, 
                    user_profile: "",
                    uid: user.user.uid,//세션스토리지에 있는 고유 키값
               
                }))
                    history.push('/');
            })//로그인할때 넘겨줄값
            
            
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
      
                console.log(errorCode, errorMessage);
            });
        })
        
            }
        }


// const loginAction = (user) => {
//     return function (dispatch,getState,{history}){
//         console.log(history);
//         dispatch(setUser(user));
//         history.push('/');
//     } -> 리덕스 바로 데이터값넣는 로그인 코드로, 
        //파이어베이스랑 연동시 필요x
// };


//회원가입
const signupFB = (id, pwd, user_name) => {
    return function (dispatch, getState, {history}){
  
      auth // 파이어베이스에서 가져온 값
        .createUserWithEmailAndPassword(id, pwd)
        //신규 계정의 비밀번호를 정확하게 입력했는지, 비밀번호가 복잡성 조건을 충족하는지 검사하는 함수
        .then((user) => {//.then 하면 성공했을때 이쪽으로 들어온다라는 뜻
  
          console.log(user);
          
          //닉네임을 넘겨주지않았기때문에 닉네임 업데이트
          auth.currentUser.updateProfile({ //바꾸고싶은내용입력
            displayName: user_name, //닉네임
          }).then(()=>{//.then 하면 성공했을때 이쪽으로 들어온다라는 뜻
            dispatch(setUser({
                user_name: user_name, 
                id: id, 
                user_profile: '',
                uid: user.user.uid //세션스토리지에 있는 고유 키값
            
            }));
            history.push('/');//메인페이지로 이동
          }).catch((error) => {//에러가나면 콘솔로 에러를 알려줌
            console.log(error);
          });
         
  
          console.log(user);
          // Signed in
          // ...
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
  
          alert(errorCode, errorMessage);
          // ..
        });
  
    }
  }
         //회원가입하면 바로 로그인이되는데 이걸 이용해서
          //로그인한 사용자의 정보를 업데이트 해주었다.
          // 닉네임까지 완전히 변한 다음에야 로그인처리를 함.
          // 리덕스에 데이터를 넣고, history로 main페이지로 이동.

//세션키로 로그인체크
const loginCheckFB = () => {
    return function (dispatch, getState, {history}){
        auth.onAuthStateChanged((user)=>{//해당하는유저가 있나없나 확인하는함수
            if(user){
                dispatch(setUser({
                    user_name: user.displayName, 
                    id: user.email, 
                    user_profile: '',
                    uid: user.uid,
                })
            );
                // 이미 로그인이 되어있는상태라면 세션이 어느정도 정보를 가지고있을것이기에
                // 파이어베이스에 저장된 데이터를 파이어베이스 인증의 함수를 사용해서
                // 값을가지고와서 다시 리덕스에 넣어주는 로그인 체크함수
            }else{
                dispatch(logOut()); // 로그인이 안돼어있으면 로그아웃시킨다.
            }
            // 로그인체크는 페이지의 가장 첫 시작점인 app.js에서 실행되어야한다.

        })
    }
}

const logOutFB = () => {
    return function (dispatch,getState,{history}){
        auth.signOut().then(()=>{
            dispatch(logOut());
            history.replace('/'); //머물러선안돼는 페이지일수도 있어서
                            // push가 아닌 replace를사용
                            // replace는 괄호안에적어둔거랑 바꿔치기한다는 뜻.
        })
    }
};



//reducer

//immer : 불변성을 유지시켜준다 ex) a를 받으면 a-1를 만든다.
//immer가 복사본을 produce 에게 값을 넘겨준다.
export default handleActions({          /*원본값*//*어떤 작업을 하고싶은지 (draft)로 받아온다.-> 복사한값을 넘겨줄 명*/
    // [LOG_IN] : (state, action) => produce(state, (draft)=>{//원본값을 넘겨줘야 복사를 해서 사용할수있다.
    //     setCookie("is_login", "success" /*원래는 토큰이 들어가야함*/);
    //     draft.user = action.payload.user; 
    //     draft.is_login = true;
    //     //createAction을 사용하면 action에서 넘어오는값을 action.user 이렇게 받는게아니라,
    //     //전부 payload 로 받는다. (내가 보낸 데이터)
    // }), 

    //==============================================================================
    //LOG_IN => 사용하지 않는이유 : 로그인과, 회원가입시 모두 회원정보가 리덕스에 들어가야해서
    // SET_USER으로 합치기위해 LOG_IN은 사용하지않고 SET_USER만 사용한다.
    //==============================================================================


    [SET_USER] : (state, action) => produce(state, (draft)=>{//원본값을 넘겨줘야 복사를 해서 사용할수있다.
        setCookie("is_login", "success" /*원래는 토큰이 들어가야함*/);
        draft.user = action.payload.user; 
        draft.is_login = true;
        //createAction을 사용하면 action에서 넘어오는값을 action.user 이렇게 받는게아니라,
        //전부 payload 로 받는다. (내가 보낸 데이터)
    }),
    [LOG_OUT] : (state, action) => produce(state, (draft) => {
        deleteCookie("is_login");
        draft.user =null; // 로그아웃되면 다시 초기값으로 변경해줌
        draft.is_login = false;
    }),
    [GET_USER] : (state, action) => produce(state, (draft) => {}),
    
},
    initialState
);

//handleActions 를 사용하면 기존의 swich(action.type){case "LOG_IN" : {state.user=action.user;}}
//처럼 안쓰고 좀더 간결하게 쓸수있다.




// action creator export   => 해줘야 컴포넌트에 가져다가 쓸수있음.
const actionCreators = {
    //logIn,
    logOut,
    getUser,
    //loginAction,
    signupFB,
    loginFB,
    loginCheckFB,
    logOutFB,
};

export {actionCreators};