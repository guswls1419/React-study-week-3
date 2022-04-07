import React from "react";
import {Grid, Text, Input, Button} from "../elements";
import styled from "styled-components"
import { useDispatch } from "react-redux";
import { actionCreators as useActions} from "../redux/modules/user"; 
import { emailCheck } from "../shared/common";

const SignUp = (props) => {

    const dispatch = useDispatch();

    const [id, setId] = React.useState("");
    const [pwd, setPwd] = React.useState("");
    const [pwd_check, setPwdCheck] = React.useState("");
    const [user_name, setUserName] = React.useState("");

    const Signup = () => {

        

        if(id === '' || pwd === '' || user_name === ''){//id,pwd,user_name 입력란 공백체크
            window.alert("아이디, 닉네임, 비밀번호를 모두 입력하세요.")
            return;// 실행안한다는 뜻
        }

        if(!emailCheck(id)){
            window.alert("이메일 형식이 맞지않습니다.")
            return;
        }

        if(pwd !== pwd_check){ // 비밀번호랑 비밀번호 확인의 값 비교
            window.alert("비밀번호와 비밀번호 확인이 일치하지않습니다.")
            return; // 실행안한다는 뜻
        }

        dispatch(useActions.signupFB(id,pwd,user_name));
    }

    return (
        <React.Fragment>
            <Grid padding="16px">
                <Text size="32px" bold="bold">회원가입</Text>

                <Grid padding="16px 0px">
                    <Input
                        label="아이디"
                        placehodaer="아이디를 입력하세요."
                        _onChange = {(e) =>{
                            setId(e.target.value);
                            }}/>
                </Grid>
                <Grid padding="16px 0px">
                    <Input
                        label="닉네임"
                        placehodaer="닉네임을 입력하세요."
                        _onChange= {(e) =>{
                            setUserName(e.target.value);
                            }}/>
                </Grid>
                <Grid padding="16px 0px">
                    <Input
                        label="비밀번호"
                        placehodaer="비밀번호 입력하세요."
                        type="password"
                        _onChange={(e) =>{
                            setPwd(e.target.value);
                            }}/>
                </Grid>

                <Grid padding="16px 0px">
                    <Input
                        label="비밀번호"
                        placehodaer="비밀번호를 확인하세요."
                        type="password"
                        _onChange={(e) =>{
                            setPwdCheck(e.target.value);
                        }}/>
                </Grid>

                <Button
                    text='회원가입하기'
                    _onClick={Signup}></Button>
            </Grid>
        </React.Fragment>
    );
};

export default SignUp;