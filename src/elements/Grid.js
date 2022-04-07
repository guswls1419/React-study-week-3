import React from "react";
import styled from "styled-components"

const Grid = (props) => {
    const {is_flex,
        width,
        margin,
        padding,
        bg,
        children,
        center,
        _onClick,
        border_radius,
        is_flex_rigth,
        is_flex_left,
        is_flex_bottom} = props;
    //props로 설정해준 값 가져오기

    const styles = {
        is_flex : is_flex,
        width : width,
        margin : margin,
        padding: padding,
        bg : bg,
        center:center,
        border_radius:border_radius,
        is_flex_rigth:is_flex_rigth,
        is_flex_left:is_flex_left,
        is_flex_bottom:is_flex_bottom
    }
    
    return (
        <React.Fragment>
            <GridBox {...styles} onClick={_onClick}>
                {children}
            </GridBox>
        </React.Fragment>
    )
}

Grid.defaultProps = {
    children : null,
    is_flex : false,
    is_flex_rigth : false,
    is_flex_left : false,
    is_flex_bottom : false,
    width: "100%",
    padding : false,
    margin : false,
    bg :false,
    center:false,
    border_radius:false,
    _onClick:() => {}
}

const GridBox = styled.div`
    width : ${(props) => props.width};
    height : 100%;
    box-sizing :border-box;
    ${(props) => props.padding ? `padding : ${props.padding};` : ""};
    ${(props) => props.margin ? `margin : ${props.margin};` : ""};
    ${(props) => props.bg ? ` background-color :  ${props.bg};` : ""};
    ${(props) => props.center ? `text-align : center` : ""}
    ${(props) => props.border_radius ? `border-radius : ${props.border_radius};` : ""}
    ${(props) => props.is_flex ? `display:flex; align-items : center; justify-content : space-between;` : ""};
    ${(props) => props.is_flex_rigth ? `display:flex; flex-direction: row-reverse; align-items : center; justify-content : space-between;` : ""};
    ${(props) => props.is_flex_left ? `display:flex; flex-direction: row; align-items : center; justify-content : space-between;` : ""};
    ${(props) => props.is_flex_bottom ? `display:flex; flex-direction: column; align-items : center; justify-content : space-between;` : ""};


`;


export default Grid;