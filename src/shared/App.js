import './App.css';
import React from 'react';
import {BrowserRouter, Route} from "react-router-dom";
import { ConnectedRouter } from 'connected-react-router';
import { history } from '../redux/configureStore';

import PostList from "../pages.js/PostList";
import Login from "../pages.js/Login";
import SignUp from "../pages.js/SignUp";
import WritingPost from '../pages.js/WritingPost';
import PostDetail from '../pages.js/PostDetail';
import Search from './Search';
import Notification from '../pages.js/Notification';

import Header from '../components/Header';
import { Button, Grid} from '../elements';
import Permit from './permit';

import { actionCreators as useActions} from "../redux/modules/user";
import { useDispatch} from "react-redux";

import {apiKey} from "./firebase";


function App() {

    const dispatch = useDispatch();
    const _sessoin_key = `firebase:authUser:${apiKey}:[DEFAULT]`;
    const is_sessoin = sessionStorage.getItem(_sessoin_key) ? true : false ;

    React.useEffect(()=>{
        if(is_sessoin){//로그인 체크(app이 시작페이지라서 여기서 세션키값 비교 )
            dispatch(useActions.loginCheckFB());
        }
    })

    return (
        <React.Fragment>
            <Grid>
                <Header></Header>
                <ConnectedRouter history = {history}> {/*store에 만들어준 history를 사용하기위해*/}
                    <Route exact path="/" component={PostList}/>
                    <Route exact path="/login" component={Login}/>
                    <Route exact path="/SignUp" component={SignUp}/>
                    <Route exact path="/WritingPost" component={WritingPost}/>
                    <Route exact path="/WritingPost/:id" component={WritingPost}/>
                    <Route exact path="/post/:id" component={PostDetail}/>
                    <Route exact path="/Search" component={Search}/>
                    <Route exact path="/noti" component={Notification}/>
                </ConnectedRouter>
            </Grid>
            <Permit>
                    <Button is_float text='+' _onClick={() => {history.push("/WritingPost")}}></Button>
            </Permit>
        </React.Fragment>
    );
}



//thunk에서 history 사용하는 이유
//로그인 요청을 하는데 로그인이 성공 할 시 '/' 경로로 이동시키고, 
//실패 할 시 경로를 유지 하는 형태로 구현 하기 위해사용함.

export default App;
