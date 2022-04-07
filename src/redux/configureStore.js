import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { createBrowserHistory } from "history";
import { connectRouter } from "connected-react-router";

import User from "./modules/user";
import Post from "./modules/Post";
import Image from "./modules/image";
import Comment from "./modules/comment";

export const history = createBrowserHistory();
// store에 history 넣기

//rootReducer
const rootReducer = combineReducers({
  user: User, //내가만든 reducer를 combineReducers 이용해서 넣어준것.
                  // reducer 만들때마다 추가해주는곳.
  post: Post,
  image: Image,
  comment: Comment,
  router: connectRouter(history),
      // 위에서 만든 history를 reducer에 넣어줌으로써 
    // 스토리에 브라우저 history가 모두 저장되게 된다.
});

// 미들웨어 만들기
const middlewares = [thunk.withExtraArgument({history:history})];  // 해당배열에는 내가 사용할 미들웨어를 하나씩 모두 넣는곳
//withExtraArgument : 다른인수를 추가로 넘겨준다. (thunk안에 내장되어있다.)
//액션생성 - 미들웨어 - 외부api - 미들웨어 - reducer순으로 처리가 됨으로
// 미들웨어에도 history를 넘겨준다.

const env = process.env.NODE_ENV;
// 지금이 어느 환경인 지 알려준다. (개발환경(development), 프로덕션(배포)환경(production) ...)

if (env === "development") { //env가 개발환경일때 logger를 가지고온다.
  const { logger } = require("redux-logger");
  middlewares.push(logger);
}
// 개발환경에서는 logger라는 걸 사용
// require : 패키지 쓰려고 가지고올때 쓰는것
// logger은 리덕스안에있는 스토어(데이터)가 콘솔에 직힘
// 사용자한테 리덕스 스토어 보여주지않고 개발환경에서만 사용 할것이고(개발자가 편하려고 사용하는것이기때문)
// import하면 프로젝트 사이즈만 커지기때문에 if문 안에서만 사용하려고 import가 아닌 require로 가져온다.

//rddux devTools설정
const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__//REDUX_DEVTOOLS가 깔려있냐는말
  //자바스크립트는 v8 엔진이 돌아가면 브라우저가 아니라도 돌아감으로 (브라우저가 아니면 윈도우라는 객체가 없음.)
  // 브라우저일때만 돌려주라는 구문임.
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

    // 미들웨어 묶어주기
    const enhancer = composeEnhancers(applyMiddleware(...middlewares));
    //composeEnhancers를 사용해서, applyMiddleware로
   // 지금까지 선언한 모든 미들웨어를 사용한다고 설정해주고
    // enhancer라는 명으로 묶어주는 것

    let store = (initialStore) => createStore(rootReducer, enhancer);
// initialStore(기본store)를 받아다가 createStore으로 reducer와 미들웨어를 묶어서 store으로 만든다.
    export default store();


    