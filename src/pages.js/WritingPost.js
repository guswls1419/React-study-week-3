import React from "react";
import {Grid, Text, Button, Image, Input} from "../elements";
import Upload from "../shared/Upload";

import {useSelector, useDispatch} from "react-redux";
import {actionCreators as postActions} from "../redux/modules/Post";
import {actionCreators as imageActions} from "../redux/modules/image";

const WritingPost = (props) => {
    const dispatch = useDispatch();
    const is_login = useSelector((state) => state.user.is_login); // 유저정보,로그인
    const preview = useSelector((state) => state.image.preview); //이미지프리뷰
    const post_list = useSelector((state) => state.post.list); // 포스트에들어가는 값

    const post_id = props.match.params.id; // 주소창에 parms로 넘어오는 id 값
    const is_edit = post_id
        ? true
        : false;

    console.log(props.match.params.id)

    const {history} = props;

    let _post = is_edit // true면? post_list.find((p) => p.id === post_id) // post_list에서 post_id값과 같은 값을 가져와라 : null; //false라면 null(수정페이지가아닌 메인페이지에 머뭄)

    const [contents, setContents] = React.useState(
        _post ? _post.contents : "" //post정보가 있으면 해당하는 post의 컨텐츠내용을 넣어준다.
    );

    const [Layout, setLayout] = React.useState(_post ? _post.inputType : "bottomImg" );
    console.log(Layout)

    React.useEffect(() => { // 파이어스토어에서 넣어서 가져오는거 아니기때문에
        if (is_edit && !_post) { // post정보가없으면 뒤로가기해버린다. (리덕스에있는 값은 새로고침하면 날아감으로 )
            window.alert("포스트 정보가 없어요!");
            history.goBack();

            return;
        }

        if (is_edit) { // 수정시 이미지 가져오기 위에서 post있는지 확인을 마쳤기에 따로 확인안해도됨
            dispatch(imageActions.setPreview(_post.image_url));
        }
    }, []);

    const changeContents = (e) => {
        setContents(e.target.value);
    };

    const addPost = () => {
        if (contents === "" || preview === "") {
            window.alert("게시글 작성을 모두 입력하세요.")
            return;
        }
        dispatch(postActions.addPostFB(contents,Layout));
    };

    const editPost = () => { //post가없을때 수정하기함수
        dispatch(postActions.editPostFB(post_id, {contents: contents}));
    }

    const LayoutTypes = (e) => {
        console.log(e.target.value)
        setLayout(e.target.value)
        
    }


    if (!is_login) {
        return (
            <Grid margin="100px 0px" padding="16px" center="center">
                <Text size="32px" bold="bold">
                    앗! 잠깐!
                </Text>
                <Text size="16px">로그인 후에만 글을 쓸 수 있어요!</Text>
                <Button
                    _onClick={() => {
                        history.replace("/");
                    }}>
                    로그인 하러가기
                </Button>
            </Grid>
        );
    }

    return (
        <React.Fragment>
            <Grid padding="16px">
                <Text margin="0px" size="36px" bold="bold">
                    {
                        is_edit
                            ? "게시글 수정"
                            : "게시글 작성"
                    }{/*post가 있을때는 수정, 없을때는 작성*/}
                </Text>
                <Upload/>
            </Grid>
            <Grid padding="0px 16px 0px 16px">
                <Text margin="0px 0px 15px 0px" size="24px" bold="bold">
                    레이아웃 선택
                </Text>
           

            {/* 오른쪽 이미지 */}
            <Grid>
                    <input type='radio' 
                           name='radio'
                           onChange={LayoutTypes}
                           checked={Layout === 'rightImg'}
                           value='rightImg'
                           id='rightImg'
                           style={{marginBottom:"20px"}}/>
                    <label for='rightImg'>오른쪽에 이미지 왼쪽에 텍스트</label>
                <Grid is_flex_rigth>
                    <Grid padding = '20px 20px 0px 20px'>
                        <Text size="18px">Text 입력란</Text>
                    </Grid>
                    <Image
                        shape="rectangle"
                        src={preview
                            ? preview
                            : "http://via.placeholder.com/400x300"}/>
                </Grid>
                </Grid>
            {/* 왼쪽 이미지 */}
            <input type='radio' 
                           name='radio'
                           onChange={LayoutTypes}
                           checked={Layout === 'leftImg'}
                           value='leftImg'
                           id='leftImg'
                           style={{margin:"20px 0px 20px 0px"}}/>
                    <label for='leftImg'>왼쪽에 이미지 오른쪽에 텍스트</label>
                <Grid is_flex_left>
                    <Grid padding = '20px 20px 0px 20px'>
                    <Text size="18px">Text 입력란</Text>
                    </Grid>
                    <Image
                        shape="rectangle"
                        src={preview
                            ? preview
                            : "http://via.placeholder.com/400x300"}/>
                </Grid>

            {/* 아래 이미지 */}
            <input type='radio' 
                           name='radio'
                           onChange={LayoutTypes}
                           checked={Layout === 'bottomImg'}
                           value='bottomImg'
                           id='bottomImg'
                           style={{marginTop:"20px"}}/>
                    <label for='bottomImg'>하단에 이미지 상단에 텍스트</label>
                <Grid is_flex_bottom>
                    <Grid padding = '0px 20px 0px 20px'>
                    <Text size="18px">Text 입력란</Text>
                    </Grid>
                    <Image
                        shape="rectangle"
                        src={preview
                            ? preview
                            : "http://via.placeholder.com/400x300"}/>
                </Grid>
            </Grid>
            <Grid padding="16px">
                <Input value={contents}
                    //이전작성값이 수정시 같이 넘어오도록
                    _onChange={changeContents} label="게시글 내용" placeholder="게시글 작성" multiLine="multiLine"/>
            </Grid>

            <Grid padding="16px">
                {
                    is_edit
                        ? (<Button text="게시글 수정" _onClick={editPost}></Button>)
                        : (<Button text="게시글 작성" _onClick={addPost}></Button>)
                }{/*post가 있을때는 수정, 없을때는 작성*/}
            </Grid>
        </React.Fragment>
    );
};

export default WritingPost;
