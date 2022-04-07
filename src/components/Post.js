import React from "react";
import {Grid, Image, Text,Button} from "../elements";
import { history } from "../redux/configureStore";
import { useDispatch,useSelector } from "react-redux";
import { actionCreators as postAction } from "../redux/modules/Post";
import { useParams } from "react-router-dom";
// import가 많아지면 지저분해 보임으로 elements 파일에 index.js파일을 만들어
// import,export 한다음, post로 가져와서 새롭게 묶어서 import해 준다.

// import Grid from "../elements/Grid";
// import Image from "../elements/Image";
// import Text from "../elements/Text";

const Post = (props) => {
 //console.log(props)

    const dispatch = useDispatch();

    
const post_list = useSelector((state) => state.post.list);

//console.log(props.id)

    const Delete = (event) => {
        const post_idx = post_list.findIndex(p=>p.id === props.id); // 인덱스번호를 찾는다.
        const post = post_list[post_idx].id;
        event.stopPropagation();

        dispatch(postAction.deletePostFB(post))
    }


    return(
        <React.Fragment>
            <Grid >
                <Grid is_flex padding = '20px 20px 0px 20px'>{/* 밑에 태그들이 Grid의 children으로 넘어감. */}
                    <Grid is_flex width ="auto">
                        <Image shape="circle" src = {props.src}/>
                        <Text bold color="#fff">{props.user_info.user_name}</Text>
                    </Grid>
                    <Grid is_flex width ="auto">
                        <Text color="#fff" margin="0px 5px 0px 0px">{props.insert_dt}</Text>
                        {props.is_me && <Button width ="auto" height="30px" padding="4px" margin="4px"
                        _onClick={(event)=> {history.push(`/WritingPost/${props.id}`)
                        event.stopPropagation();
                        }}
                        >수정</Button>} {/* 선택한 카드에 해당하는 id값에 맞는 카드의 수정페이지로 이동*/}
                        
                        {props.is_me && <Button width ="auto" height="30px" padding="4px" margin="4px"
                        
                        _onClick={Delete} >삭제</Button>}
                    </Grid>
                </Grid>


                {props.Layout === "rightImg" && (
                    <Grid is_flex_rigth padding = '20px 20px 0px 20px'>
                        <Grid padding = '20px'>
                                <Text size="18px" color="#fff" margin="0px 0px 0px 10px">{props.contents}</Text>
                        </Grid>

                        <Grid>
                            <Image shape='rectangle' src = {props.image_url}/>
                        </Grid>
                    </Grid>
                )}

                {props.Layout === "leftImg" && (
                <Grid is_flex_left padding = '20px 20px 0px 20px'>
                    <Grid padding = '20px'>
                            <Text size="18px" color="#fff" margin="0px 0px 0px 10px">{props.contents}</Text>
                    </Grid>

                    <Grid >
                        <Image shape='rectangle' src = {props.image_url}/>
                    </Grid>
                </Grid>
                )}

                {props.Layout === "bottomImg" && (
                <Grid is_flex_bottom padding = '0px 20px 0px 20px'>
                    <Grid>
                            <Text color="#fff" size="18px">{props.contents}</Text>
                    </Grid>

                    <Grid >
                        <Image shape='rectangle' src = {props.image_url}/>
                    </Grid>
                </Grid>
                )}



                <Grid padding = '20px'>
                    <Text color="#fff" margin='0px 0px 0px 10px' bold>댓글 {props.comment_cnt}개</Text>
                </Grid>
                
                    {/* <div>user profile / user name / insert_dt / is_me (edit btn)</div>
                    <div>contents</div> 
                    <div>image</div>
                    <div>comment cnt</div> */}
                
            </Grid>
        </React.Fragment>
    );
}

Post.defaultProps = { // 기본적으로 필요한 props를 미리 넘겨놓는방식()
    user_info : {
         user_name: "HyunJin",
         user_profile : "http://th1.tmon.kr/thumbs/image/f9f/661/078/258e751b2_700x700_95_FIT.jpg"
    },
    image_url : "http://th1.tmon.kr/thumbs/image/f9f/661/078/258e751b2_700x700_95_FIT.jpg",
    contents : "귀여운 오리",
    comment_cnt : 10,
    inputType : "typeBottom",
    insert_dt : "2022-04-01 15:00:00",
    is_me :false,
};

export default Post;