import React from "react";
import {Text,Grid} from "../elements"
import styled from "styled-components"


const Input = (props) => {

    const {label, placehodaer,_onChange, type, multiLine,value, is_submit, onSubmit} = props;

    if(multiLine){//로그인 한 유저
        return(
            <Grid>
                {label ? "" : <Text margin ="0px" >{label}</Text>}
                <ElTextarea 
                value={value}
                rows={10} //textarea의 높이를 조정해주는 속성
                placeholder={placehodaer}
                onChange={_onChange}/>
            </Grid>
        )}
        

    return (
        <React.Fragment>
            <Grid>
                {label ? "" : <Text margin ="0px" >{label}</Text>}
                {/* {label && <Text margin ="0px" >{label}</Text>} => 라벨이 있을때만 써라
                이렇게도 사용 가능함*/}
                { is_submit ? 
                (
                <ElInput type={type}
                placeholder={placehodaer} 
                onChange={_onChange} 
                value={value}
                onKeyPress={(e) => {
                    if(e.key === "Enter"){
                      onSubmit(e);}
                  }}/>
                )
                : (
                <ElInput type={type}
                placeholder={placehodaer} 
                onChange={_onChange} />
                )}

            </Grid>
        </React.Fragment>
    )
};

Input.defaultProps = {
   multiLine : false,
   label : false,
   placehodaer : '텍스트를 입력하세요.',
   type:"text",
   is_submit: false, // 뭔가 작성해서 보내는게있니?
   onSubmit: () => {},
   _onChange : () => {},
   value:""
}

const ElInput = styled.input`
    border : 1px solid #212121;
    width : 100%;
    padding: 12px 4px;
    box-sizing : border-box;
`;

const ElTextarea = styled.textarea`
    border : 1px solid #212121;
    width : 100%;
    padding: 12px 4px;
    box-sizing : border-box;
`;


export default Input;