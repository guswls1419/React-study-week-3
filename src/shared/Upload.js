import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../elements";
import { storage } from "./firebase";
import {actionCreators as imageActions} from "../redux/modules/image";


const Upload = (porps) => {
//유저 프로필 및 게시글작성등 여러 컴포넌트에서 사용될수있음으로
// upload 컴포넌트로 따로 빼서 사용

    const dispatch = useDispatch();
    const is_uploading = useSelector(state => state.image.uploading); 
    // 인풋에 파일있으면 버튼안눌리게해주는 장치 (파일있으면 true,없으면false)
    const fileInput = React.useRef();

    const selectFile = (e) => { // 인풋에 접근이 잘되는지 확인용 코드 (이미지파일)
        console.log(e);
        console.log(e.target);
        console.log(e.target.files[0]);

        console.log(fileInput.current.files[0]);

        const reader = new FileReader(); 
        // 파일내용을 일어와서 내용물을 미리볼수있다

        const file = fileInput.current.files[0]; // 파일하나
        //ref로 이미지파일 불러옴
        reader.readAsDataURL(file); //파일리더사용법 reader.(메소드)(가져올파일)


        reader.onloadend = () => { // 읽기가 끝났을때 결과를 받아오는것
            //console.log(reader.result);
            dispatch(imageActions.setPreview(reader.result));
            //프리뷰를 세팅,넣어주게 해줌
        }

    }

    const uploadFB = () => {
        let image = fileInput.current.files[0];
        dispatch(imageActions.uploadImageFB(image));
    }


    return (
        <React.Fragment>
            <input type="file" onChange={selectFile} ref={fileInput} disabled={is_uploading}/>
            <Button _onClick={uploadFB}>업로드하기</Button>
        </React.Fragment>
    )
}

export default Upload;