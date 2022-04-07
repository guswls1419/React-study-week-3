export const emailCheck = (email) => {
    //이메일 형식체크(정규식표현)

    // aa_-.123Aaa@aa.com  -이메일형식
    // 정규식은  / / -> 사이에 식을 입렵한다.
    //^ -> 첫글자만 이라는 뜻,[0-9a-zA-Z]0~9,a~z,A~Z까지다 라는 뜻.
    // ([-_.0-9a-zA-Z])* -> 숫자든,영 대문자 소문자든 특수문자든 n번 반복될수있다는 뜻.

    let _reg= /^[0-9a-zA-Z]([-_.0-9a-zA-Z])*@[0-9a-zA-Z]([0-9a-zA-Z])*.([a-zA-Z])*/;

    return _reg.test(email); //=>정규식 패턴 확인하는법


}