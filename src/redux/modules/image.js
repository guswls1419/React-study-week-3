import {createAction, handleActions} from "redux-actions";
import produce from "immer";

import {storage} from "../../shared/firebase";

const UPLOADING = "UPLOADING";
const UPLOAD_IMAGE = "UPLOAD_IMAGE";
const SET_PREVIEW = "SET_PREVIEW"; // 미리보기

const uploading = createAction(UPLOADING, (uploading) => ({uploading}));
const uploadImage = createAction(UPLOAD_IMAGE, (image_url) => ({image_url}));
const setPreview = createAction(SET_PREVIEW, (preview) => ({preview}));

const initialState = {
    image_url: '',
    uploading: false,
    preview: null,
}



const uploadImageFB = (image) => {// 파이어 베이스에 업로드
    return function(dispatch, getState, {history}){
        
        dispatch(uploading(true));// 파일을 업로드 하기전상태일때 true, 파일을 다불러왔을때 false

         const _upload = storage.ref(`images/${image.name}`).put(image); // => 업로드
        //파일 이름을 포함해서 참조를 건다.
         _upload.then((snapshot) => {
           console.log(snapshot); //업로드가 끝나면 알려줘라
           //dispatch(uploading(false)) handleActions 부분에 선언
           //업로드가 완료되면 사실상업로드가 끝난거니까 굳이 여기서 선언 x 
           
           snapshot.ref.getDownloadURL().then((url) => {
               dispatch(uploadImage(url));
             console.log(url);
           });
         });

    }
}

//reducer
export default handleActions({
    [UPLOAD_IMAGE]: (state, action) => produce(state, (draft) => {
        draft.image_url = action.payload.image_url;
        draft.uploading = false; 
    }),
    [UPLOADING]: (state, action) => produce(state, (draft) => {
       draft.uploading = action.payload.uploading;
    }),
    [SET_PREVIEW]: (state, action) => produce(state, (draft) => {
      draft.preview = action.payload.preview;
    })
}, initialState);

const actionCreators = {
  uploadImage,
  uploadImageFB,
  setPreview,
};

export {actionCreators};

