import React from "react";
import Post from "../components/Post";

import { useSelector, useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/Post";
import { Grid } from "../elements";

const PostList = (props) => {
    const dispatch = useDispatch();
    const post_list = useSelector((state) => state.post.list);
    const user_info = useSelector((state) => state.user.user); //로그인한 유저
    //post 하나하나에 유저정보를 비교해보기위해 가져옴

    //console.log(post_list)

    const {history} = props;

    React.useEffect(()=> {

        if(post_list.length < 2){
            dispatch(postActions.getPostFB()); 
            // post_list페이지에 들어갈때마다 useEffect가 실행되어 데이터를 가져와
            // post의 순서가 일정하지않아, post_list의 길이가 0일때만 실행하도록해준다.
            // 0일때만이라고 했을때 상세페이지에서 메인페이지로 이동시 목록을 1개만 
            // 불러와서 2보다 작을때로 수정. (어짜피 1개만 가져오니깐)
        }
    },[]);

    return (
        <React.Fragment>
            <Grid bg={"#"} padding="20px 0px 0px 0px">
            {/* <Post/> */}
            {post_list.map((p, idx) => {
                if(p.user_info.user_id === user_info?.uid){//옵셔널체이닝(https://ko.javascript.info/optional-chaining)
                // db에 저장되어있는 유저정보와 === 현재로그인한 유저의정보가 일칭한지 비교
                return (
                    <Grid bg='#af937d' width="96%" margin="20px auto" border_radius="20px" key={p.id} _onClick={() =>{history.push(`/post/${p.id}`)}}>
                        <Post  {...p} is_me/>
                        {/* ...p => p 즉 post_list의 대한정보를 다 넘김*/}
                    </Grid>
                );
                }else{
                    return (
                        <Grid bg='#af937d' width="96%" margin="20px auto" border_radius="20px"  key={p.id} _onClick={() => {history.push(`/post/${p.id}`)}}>
                            <Post  {...p}/>
                        </Grid>
                    )
                }
                
            })}
            </Grid>
        </React.Fragment>
    );
}

export default PostList;