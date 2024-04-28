let image_path = "";
let img_isValid = false;
let email_isValid = false;
let password_isValid = false;
let nickname_isValid = false;
let allChecked = false;

async function uploadImage() {
    const selectedFile = document.getElementById("uploadImage").files[0];

    // 선택된 파일의 여부에 따라 <원상복구> or <이미지 업로드 & 프리뷰>
    if (selectedFile == undefined) {
        let helper = document.getElementsByClassName("helperImage")[0];
        helper.style.display = "inline-block";
        let img = document.getElementsByClassName("image")[0];
        img.src = "/assets/images/imageInput.png";

        // 유효성 상태 저장
        img_isValid = false;
        checkRegister();
    }
    else {
        console.log(selectedFile);
        const uri = await upload();
        let helper = document.getElementsByClassName("helperImage")[0];
        helper.style.display = "none";
        let img = document.getElementsByClassName("image")[0];
        img.src = uri;
        // 유효성 상태 저장
        img_isValid = true;
        image_path = uri;
        checkRegister();
    }

    // 이미지 업로드 및 path 반환용 함수
    async function upload() {
        const form = new FormData();
        form.append("file", selectedFile);
        const response = await fetch("/upload", {
            method: "POST",
            body: form
        });
        const data = await response.json();
        return data.path;
    }

}

async function emailChk() {

    let emailInput = document.getElementById("email").value;
    let helper = document.getElementsByClassName("emailHelper")[0];
    let duplChk = await isDuplicated(emailInput);
    // 유효성 필터
    if (emailInput.length < 11 || !isValid(emailInput)) {
        helper.innerText = "* 올바른 이메일 주소 형식을 입력해주세요.";
        // 유효성 상태 저장
        email_isValid = false;
        checkRegister();
    }
    else if (duplChk) {
        helper.innerText = "* 중복된 이메일입니다.";
        // 유효성 상태 저장
        email_isValid = false;
        checkRegister();

    }
    else {
        helper.innerText = "";
        // 유효성 상태 저장
        email_isValid = true;
        checkRegister();
    }

    // 이메일 정규식 유효성 검사
    function isValid(input) {
        const sample = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
        return sample.test(input);
    }
    // 이메일 중복 검사
    async function isDuplicated(input) {
        // fetch
        const response = await fetch(`http://125.130.247.176:9001/users/email?email=${input}`, {
            method: "GET",
            header: {
                "Context-Type": "application/json"
            }
        })
        const result = await response.json();
        if (response.status == "400") {
            return true;
        }
        else {
            return false;
        }
    }

}

function passwordChk() {
    let pw = document.getElementById("password").value;
    let pwHelper = document.getElementsByClassName("passwordHelper")[0];
    let re_pw = document.getElementById("passwordChk").value;
    let repwHelper = document.getElementsByClassName("repasswordHelper")[0];

    // 비밀번호 유효성 검사
    if (!pw) {
        pwHelper.innerText = "* 비밀번호를 입력해주세요.";
        // 유효성 상태 저장
        password_isValid = false;
        checkRegister();
    }
    else if (pw.length < 8 || pw.length > 20) {
        pwHelper.innerText = "* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
        // 유효성 상태 저장
        password_isValid = false;
        checkRegister();
    }
    else if (pw != re_pw) {
        pwHelper.innerText = "* 비밀번호가 다릅니다.";
        // 유효성 상태 저장
        password_isValid = false;
        checkRegister();
    }
    else {
        pwHelper.innerText = "";
        // 유효성 상태 저장
        password_isValid = true;
        checkRegister();
    }

    // 2차 비밀번호 유효성 검사
    if (!re_pw) {
        repwHelper.innerText = "* 비밀번호를 한번더 입력해주세요.";
    }
    else if (re_pw.length < 8 || re_pw.length > 20) {
        repwHelper.innerText = "* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
    }
    else if (pw != re_pw) {
        repwHelper.innerText = "* 비밀번호가 다릅니다.";
    }
    else {
        repwHelper.innerText = "";
    }

}


async function nicknameChk() {
    let nickname = document.getElementById("nickname").value;
    let nickHelper = document.getElementsByClassName("nicknameHelper")[0];
    let duplChk = await isDuplicated(nickname);

    if (!nickname) {
        nickHelper.innerText = "* 닉네임을 입력해주세요.";
        nickname_isValid = false;
        checkRegister();
    }
    else if (isValid(nickname)) {
        nickHelper.innerText = "* 뛰어쓰기를 없애주세요.";
        nickname_isValid = false;
        checkRegister();
    }
    else if (duplChk) {
        nickHelper.innerText = "* 중복된 닉네임입니다.";
        nickname_isValid = false;
        checkRegister();
    }
    else if (nickname.length >= 11) {
        nickHelper.innerText = "* 닉네임은 최대 10자까지 작성 가능합니다.";
        nickname_isValid = false;
        checkRegister();
    }
    else {
        nickHelper.innerText = "";
        // 유효성 상태 저장
        nickname_isValid = true;
        checkRegister();
    }

    // 공백 검사
    function isValid(input) {
        const sample = /[\s]/g;
        return sample.test(input);
    }
    // 닉네임 중복 검사
    async function isDuplicated(input) {
        const response = await fetch(`http://125.130.247.176:9001/users/nickname?nickname=${input}`, {
            method: "GET",
            headers: {
                "Context-Type": "application/json"
            }
        })
        if (response.status == "400") {
            return true;
        }
        else {
            return false;
        }
    }
}


// 유효성 검사가 모두 끝났을 경우 버튼 스타일 변경
function checkRegister() {
    let button = document.getElementsByClassName("signinButton")[0];
    if (img_isValid && email_isValid && password_isValid && nickname_isValid) {
        button.style.backgroundColor = "#7F6AEE";
        allChecked = true;
    }
    else {
        button.style.backgroundColor = "#ACA0EB";
        allChecked = false;
    }
}

async function register() {
    if (allChecked) {
        //회원가입
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        let nickname = document.getElementById("nickname").value;

        let params = JSON.stringify({
            "profile_image_path": image_path,
            "email": email,
            "password": password,
            "nickname": nickname
        })

        // fetch: 회원가입 API post
        const response = await fetch("http://125.130.247.176:9001/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body : params
        })

        if(response.status == "201"){
            alert("회원가입이 완료되었습니다.")
            location.replace("/community");
        }
        else{
            alert("모든 정보를 정확히 입력해주세요.");
        }
    }
}