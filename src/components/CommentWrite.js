import React from "react";
import { Button,Grid,Input, Image,Text} from "../elements";
import { actionCreators as commentAction } from "../redux/modules/comment";
import { useDispatch, useSelector } from "react-redux";

const CommentWrite = (props) =>{
    const dispatch = useDispatch();

    const [comment_text,setCommentText] = React.useState();

    const {post_id} = props;
    const onChange = (e) => {
        setCommentText(e.target.value);
    }

    const write = () => {
        //console.log(comment_text)
        dispatch(commentAction.addCommentFB(post_id, comment_text))
        setCommentText("")
    }

    return(
        <React.Fragment>
             <Grid padding="16px" is_flex>
                 <Input placehodaer= "댓글 내용을 입력하세요." _onChange={onChange} value={comment_text} onSubmit={write} is_submit/>
                 {/* value값을 추가한이유는, 댓글창에 입력후 버튼 눌렀을때 그대로 남아있으면 안돼니깐, value값을 지정해줘서
                 그래로 날려주기 위함. */}
                 <Button width="50px" height="42px" margin="0px 5px 0px 5px" _onClick={write}
                 >작성</Button>
                 {/* 여기서 버튼 크기수정시 버튼컴포넌트에서 초기값 수정 */}
             </Grid>
        </React.Fragment>
    )
}

export default CommentWrite;