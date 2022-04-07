import React from "react";
import {Grid,Image,Text} from "../elements";

import { useDispatch,useSelector } from "react-redux";
import { actionCreators as commentActions } from "../redux/modules/comment";

const CommentList = (props) =>{

    const dispatch = useDispatch();
    const comment_list = useSelector(state => state.comment.list);

    const {post_id} = props;

    React.useEffect(() => {

        if(!comment_list[post_id]){//만약 comment_list가 없으면 dispatch로 가져와라
            dispatch(commentActions.getCommentFB(post_id));
        }
    },[]);

    if(!comment_list[post_id] || !post_id){// post id가 없을때나, 안넘어왔을때 오류방지
        return null;
    }

    return(
        <React.Fragment>
            <Grid padding='16px'>
                {comment_list[post_id].map(c => {// 가지고 온 값을 가지고 map돌려서 반복해서 붙여준다.
                    return <CommentItem  key={c.id} {...c}/>;// 코멘트 정보{...c}
                })}
            </Grid>
        </React.Fragment>
    )
}

CommentList.defaultProps = {
    post_id: null,
}


export default CommentList;

const CommentItem = (props) => {

    const {user_profile, user_name, user_id, post_id,insert_dt,contents} = props;
    return (
            <Grid is_flex>
                <Grid is_flex width='auto'>
                    <Image shape='circle'/>
                    <Text bold>{user_name}</Text>
                </Grid>
                <Grid is_flex margin="0px 20px">
                    <Text margin="0px">{contents}</Text>
                    <Text margin="0px">{insert_dt}</Text>
                </Grid>
            </Grid>
    )
}


CommentItem.defaultProps = {
    user_profile: "",
    user_name : "hyunjin",
    user_id : "",
    post_id : 1,
    contents: "너무어렵다 React...",
    insert_dt: '2022-04-04 16:13:00'
}