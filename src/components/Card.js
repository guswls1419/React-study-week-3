import React from "react";
import { Grid, Image, Text } from "../elements";


const Card = (props) => {

    const {image_url, user_name, post_id} = props;

    return(
        <Grid padding="16px"  margin="10px auto" is_flex bg="#fff" border_radius="13px" >
        <Grid width="auto" margin="0px 8px 0px 0px">
            <Image size={85} shape="square" image_url={image_url}></Image>
        </Grid>
        <Grid>
            <Text>
                <b>{user_name}</b>님이 게시글에 댓글을 남겼습니다 :)
            </Text>
        </Grid>
    </Grid>
    
    )

}

    Card.defaultProps = {
        image_url : "",
        user_name : "",
        post_id : null,
    }


export default Card;