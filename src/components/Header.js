import React from "react";
import {Text,Grid,Button} from "../elements"
import { getCookie,deleteCookie } from "../shared/Cookie";

import { useSelector, useDispatch } from "react-redux";
import { actionCreators as userActions } from "../redux/modules/user";

import { history } from "../redux/configureStore";
import { apiKey } from "../shared/firebase";
import Permit from "../shared/permit";

const Header = (props) => {
    // redux적용전 확인용코드
    //const [is_login, setIsLogin] = React.useState(false); 
    // React.useEffect (()=> {// 쿠키가 있는지없는지 쿠키값 비교
    // let cookie = getCookie("user_id"); //다른이름으로 만들어서 사용해도 가능함.
    // console.log(cookie);
    // if(cookie){// cookie의 여부에 따라 is_login의 값을 업데이트
    //     setIsLogin(true);} else {setIsLogin(false);}});
    //if (is_login){ //is_login이 true일때만 보여줘라
 
    const dispatch = useDispatch();
    const is_login = useSelector((state) => state.user.is_login);


    const _sessoin_key = `firebase:authUser:${apiKey}:[DEFAULT]`;
                             //애플리케이션-세션스토리지 에있는 키값.
    //console.log(_sessoin_key)
    //console.log(sessionStorage.getItem(_sessoin_key))
    //https://sub0709.tistory.com/55 =>sessionStorage 참고사이트

    const is_sessoin = sessionStorage.getItem(_sessoin_key)?true : false;
    // _sessoin_key가 있는지 없는지 확인,
    // 있으면 로그인을 했다. 없으면 안했다.
    // 로그인 유지를하기 위해서는, 로그인 체크를해서 리덕스의 데이터에 다시한번 넣어줘야함
    // 리덕스는 새로고침하면 없어짐으로.
    
     if (is_login && is_sessoin ){ 
     return(
    <Permit>
        <React.Fragment>
        <Grid is_flex margin="4px 16px">
            <Grid>
                <Text margin="0px" size="24px" bold>My Diary</Text>
            </Grid>

            <Grid is_flex width="80%">
                <Button height="30px"  margin="0px 10px 0px 0px"  text="내정보"></Button>
                <Button height="30px"  margin="0px 10px 0px 0px"  text="알림" _onClick={()=> {
                    history.push("/noti");
                }}></Button>
                <Button height="30px"  margin="0px 32px 0px 0px"  text="로그아웃" _onClick={()=> {
                dispatch(userActions.logOutFB({}));}}></Button> 
                {/*cookie만 지우면안돼고, state도 업데이트를해줘야 ui가 변경됨*/}
            </Grid>
        </Grid>
    </React.Fragment>
    </Permit>
    )}

    return(
        <React.Fragment>
            <Grid is_flex margin="4px 16px">
                <Grid>
                    <Text margin="0px" size="24px" bold>My Diary</Text>
                </Grid>

                <Grid is_flex width="80%" >
                    <Button height="30px"  margin="0px 10px 0px 0px" text="로그인" _onClick={()=>{
                        history.push('/login')
                    }}></Button>
                    <Button  height="30px" margin="0px 50px 0px 0px"  text="회원가입" _onClick={()=>{
                        history.push('/SignUp')
                    }}></Button>
                </Grid>
            </Grid>
        </React.Fragment>
    )
};

Header.defaultProps = {}

export default Header;