import React from "react";
import {useSelector} from "react-redux";
import { apiKey } from "./firebase";

const Permit = (props) => { 
//로그인했을때 보이는 아이들모아둔 컴포넌트(세션으로 값비교 로그인여부확인)
    const is_login = useSelector(state => state.user.is_login);
    const _sessoin_key = `firebase:authUser:${apiKey}:[DEFAULT]`;
    const is_sessoin = sessionStorage.getItem(_sessoin_key) ? true : false;

    
    if (is_login && is_sessoin ){ 
    return (
        <React.Fragment>
            {props.children}
        </React.Fragment>
    )
    }
    
    return null;

}


export default Permit;