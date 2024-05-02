import { setCookie } from "../utils/cookie.js";
import {API} from "../config.js";

window.login = async function login() {
    // 입력칸 데이터 변수에 저장
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    const loginBody = { "email": email, "password": password };

    const response = await fetch(`${API.login}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(loginBody)
    })
    const result = await response.json();
    if (response.status == 200) {
        setCookie("id", result.data.id);
        setCookie("image_path", result.data.profile_image_path);
        success();
    }
    else if (response.status == 404) {
        alert("계정 정보를 찾을 수가 없습니다.");
        helperText();
    }
    else {
        alert("로그인에 실패하였습니다.");
        helperText();
    }
}

function helperText() {
    let text = document.getElementsByClassName("helperText")[0];
    text.innerText = "*입력하신 계정 정보가 정확하지 않습니다."
}

function success() {
    let button = document.getElementsByClassName("loginButton")[0];
    button.style.backgroundColor = "#7F6AEE";
    let text = document.getElementsByClassName("helperText")[0];
    text.innerText = "*로그인 성공. 3초 후 메인화면으로 이동합니다."
    setTimeout(function () {
        location.replace("/community/main");
    }, 300);
}
