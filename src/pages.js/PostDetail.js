import React from "react";
import Post from "../components/Post";
import CommentWrite from "../components/CommentWrite";
import CommentList from "../components/CommentList";

import Permit from "../shared/permit";

import { useSelector,useDispatch } from "react-redux";
import { actionCreators as postAction } from "../redux/modules/Post";
import { Grid } from "../elements";

const PostDetail = (props) =>{

    const dispatch = useDispatch();
    const id = props.match.params.id;
    //id에 맞는 게시글정보를 리덕스에서 가져와서 넣어주면
    //상세페이지에 post에대한 데이터가 불려온다.
    //console.log(id);

    const user_info = useSelector((state) => state.user.user);

    const post_list = useSelector(store => store.post.list); //post전체리스트를 가지고와서
    const post_idx = post_list.findIndex(p=>p.id === id); // 인덱스번호를 찾는다.
    const post = post_list[post_idx];
    //console.log(post);

    React.useEffect(() => {//새로고침시, 리덕스 데이터가 날아감으로, 페이지 첫 로드할때 데이터를 불러온다.(db작업 x)
        
        if(post){ //만약에 post 값을 가지고 들어오는경우라면
            return; // 아래의 코드는 실행될 필요가 없으니 if문으로 처리
        }

        dispatch(postAction.getOnePostFB(id));
    },[]);



    return(
        <React.Fragment>
            <Grid bg='#af937d' width="96%" margin="10px auto" border_radius="20px">
             {post && <Post {...post} is_me={post.user_info.user_id === user_info?.uid }/>} 
             </Grid>
             {/*옵셔널체이닝: 만약에 user_info가 없으면 뒤에 uid는 읽지않음으로 오류가 안남.*/}
             {/*is_me(초기데이터)////// id 값과 uid값을 비교해서 true,false를 반환한다.*/}
             {/* 새로고침했을때 params로 id값이 잘못 넘어올수도있기때문에 post가 있을때에 실행하도록 한다. */}
            <Permit>
                <CommentWrite post_id={id}/> {/*post에 맞게 댓글이 들어가야하니깐, id값을 넘겨줘서 id값이 post와 일치하는 데이터가들어가게한다.*/} 
            </Permit>
             <CommentList post_id={id}/>
             
        </React.Fragment>
    )
}

export default PostDetail;