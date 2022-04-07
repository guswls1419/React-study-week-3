import React from "react";
import styled from "styled-components"


const Button = (props) => {

  const {text, _onClick,is_float,children,margin,width,padding,height} = props;

    
      if(is_float){
      return(
        <React.Fragment>
          <FloatBtn onClick={_onClick}>{text? text : children}</FloatBtn>
        </React.Fragment>
      )}

        const styles = {
          margin :margin,
          width :width,
          padding :padding,
          height:height
        };

        return (
            <React.Fragment>
                    <LoginBtn {...styles} onClick={_onClick}>{text? text : children}</LoginBtn>
            </React.Fragment>
        );
    };

    Button.defaultProps = {
      text : false ,
      _onClick: () =>{},
      is_float:false,
      margin :false,
      width : '100%',
      height : "50px",
      padding : "12px 0px"
    };
 
    const LoginBtn = styled.button`
        width : ${(props)=> props.width};
        background-color : #856246;
        color : #fff;
        height : ${(props)=> props.height};
        box-sizing : border-box;
        border : none;
        border-radius:6px;
        text-align:center;
        ${(props) => (props.margin ? `margin: ${props.margin}` :' ')};
    `;

const FloatBtn = styled.button`
//padding:16px;
box-sizing:border-box;
    border:none;
    background-color : #856246;
    width:50px;
    height : ${(props)=> props.height};
    border-radius:50px;
    font-size: 36px;
    font-weight:800;
    color:white;
    text-align:center;
    position : fixed;
    right:16px;
    bottom:50px;
    vertical-align : middle;

`;


export default Button;