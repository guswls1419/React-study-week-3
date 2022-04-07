import React from "react";
import _ from "lodash";

const Search = () => {

    // const onChange = (e) => {
    //     console.log(e.target.value);
    //     debounce(e)
    // }

        const debounce = _.debounce((k) => console.log("디바운스! :::", k), 1000);
        // _안에 있는 debounce를 불러와서 debounce할 값을 넣고 어떻게 처리한것인지 넣고
                    // 마지막엔 얼마나 기다렸다 실행할지 시간 값을 밀리초 단위로 적는다.
        const keyPress = React.useCallback(debounce, []);// (함수, [변할기준점])
                        // 함수를 어디에다가 저장해둔다(메모이제이션)
        const onChange = (e) => {
        keyPress(e.target.value);}

        // const throttle = _.throttle((k) => console.log("쓰로틀! :::", k), 1000);
        // const keyPress = React.useCallback(throttle, []);
        // const onChange1 = (e) => {
        // keyPress(e.target.value);
        // };


    return (
        <div>
            <input type="text" onChange ={onChange}/>
        </div>
    )
};

export default Search;