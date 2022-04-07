import styled from 'styled-components'
import React from 'react';

const Image = (props) => {

    const {shape, src, size} = props;

    const styles = {
        src : src,
        size : size,
    }

    if(shape === "circle"){
        return (
            <ImageCircle {...styles}></ImageCircle>
        )
    }

    if(shape === "rectangle"){
        return (
            <AspectOutter>
                <AspectInner {...styles}></AspectInner>
            </AspectOutter>
        )
    }
    return (
        <React.Fragment>
            <ImageDefault {...styles}></ImageDefault>
        </React.Fragment>
    )
};

Image.defaultProps = {
    shape : "circle",
    src : "http://th1.tmon.kr/thumbs/image/f9f/661/078/258e751b2_700x700_95_FIT.jpg",
    size : 36,
};

const ImageDefault = styled.div`
    --size: ${(props) => props.size}px;  /* css변수사용법*/ 
    width : var(--size);
    height : var(--size);
    background-image : url("${(props) => props.src}");
    background-size : cover; /*원크기에 맞춰서 이미지가 딱 맞춰짐*/
`;

const AspectOutter = styled.div`
    width : 100%;
    min-width : 250px;
`;

const AspectInner = styled.div`
    position : relative;
    padding-top: 75%; /*바깥상자 넓이값이 100, 4:3 비율 맞추려고 75%로 지정*/
    overflow : hidden;
    background-image : url("${(props) => props.src}");
    background-size : cover;
`;

const ImageCircle = styled.div`
    --size: ${(props) => props.size}px;  /* css변수사용법*/ 
    width : var(--size);
    height : var(--size);
    border-radius: var(--size);

    background-image : url("${(props) => props.src}");
    background-size : cover; /*원크기에 맞춰서 이미지가 딱 맞춰짐*/
    margin : 4px;
`;

export default Image;