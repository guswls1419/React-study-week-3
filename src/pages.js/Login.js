import React, { useState } from "react";
import {Input,Text,Grid,Button} from "../elements"
import { getCookie,setCookie,deleteCookie } from "../shared/Cookie";

import { useDispatch } from "react-redux";
import { actionCreators as useActions} from "../redux/modules/user"; //as를 사용하면 별명을 주는것.
import { emailCheck } from "../shared/common";

const Login = (props) => {

    const dispatch = useDispatch();
        //action을 쓰기위해 가져오는 함수

    const [id,setId] = React.useState('');
    const [pwd,setPwd] = React.useState('');

    const login = (props) => {
        if(id === '' || pwd === '' ){//id,pwd 입력란 공백체크
            window.alert("아이디/비밀번호를 입력하세요.")
            return;// 실행안한다는 뜻
        }

        if(!emailCheck(id)){
            window.alert("이메일 형식이 맞지않습니다.")
        }

        dispatch(useActions.loginFB(id, pwd)); //dispatch안에는 액션생성함수를 넣어준다.

        // console.log(getCookie("user_id"));
        // setCookie("user_id", "perl",3); 쿠키확인을 위한 가상코드
        // setCookie("user_pwd", "pppp",3)


    }


  

    return (
        <React.Fragment>
            <Grid padding = "16px">
                <Text size="32px" bold>로그인</Text>

                <Grid padding = "16px 0px">
                    <Input label ="아이디"
                    placehodaer = "아이디를 입력하세요." 
                    _onChange= {(e) =>{
                        setId(e.target.value);
                        }}/>
                </Grid>
                <Grid padding = "16px 0px">
                    <Input label ="비밀번호"
                    placehodaer = "비밀번호를 입력하세요."
                    type="password"
                    _onChange= {(e) =>{
                        setPwd(e.target.value);
                        }}/>
                </Grid>
                <Button text='로그인하기' 
                _onClick={login}></Button>
            </Grid>
        </React.Fragment>
    );
};


export default Login;