const getCookie = (name) => {// 키값 기준으로 쿠키에 저장된 값을 가져오는 함수
    let value = "; " + document.cookie;   // 쿠키 값을 가져온다.

    let parts = value.split(`; ${name}=`) //aa=xx ; user_id=aaa;  =>  ex). [aa=xx / aaa; accc=ddsd]
     // 키 값을 기준으로 파싱한다.

    if(parts.length === 2 ){//찾는 쿠키가 없을수도있어서, if문사용
        //찾는쿠키가없으면 아무것도 쪼개지지 않을것이기에 배열의 길이를 2와 비교
        //pop : 배열의 마지막 요소를 떼어온다. 원본배열에서는 마지막요소가 사라지고 pop값으로 반환된다.
        // shift : 배열의 맨첫번째 것을 떼어온다.

        return parts.pop().split(";").shift();

    }
}
// 쿠키에 저장하는 함수
const setCookie = (name, value, exp=5 ) => {

        let date = new Date();// 날짜를 만들어준다.
        date.setTime(date.getTime() + exp*24*60*60*1000);
          // 저장
        document.cookie = `${name}=${value}; expores = ${date.toUTCString()}`;
}

//exp=5 의 뜻, exp라는것을 인수로 받아오지않아도, setCookie함수는 exp파라미터를 쓸수있다(기본값 미리지정)
//날짜를 나타낼때는 밀리초(숫자), 문자 2가지로 나타낼수있는데
//toUTCString = 문자로 , getTime = 밀리초로 해당 함수들로 나타낼수있다.
//getTime 은 숫자로만 가져오기때문에 setTime을 사용하여 객체의 일시를 지정해줄수있다.
// 사용법 : date.setTime(date.getTime(), + 언제로 갈껀지 원하는 시간 ) ex.10,000초 뒤 



// 만료일을 예전으로 설정해 쿠키를 지운다.
const deleteCookie = (name) => {
    let date = new Date("2020-01-01").toUTCString();

    console.log(date);

    document.cookie = name+"=; expires="+date;
}

export {getCookie,setCookie,deleteCookie};


// 이름만가지고 쿠키값을 나눠서 가져오려면, split 을 사용하여 가져올수있다.