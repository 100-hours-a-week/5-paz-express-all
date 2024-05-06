import {getCookie, deleteCookie} from "../../utils/cookie.js";
import {API} from "../../config.js";

// 초기 데이터 로딩
setInfo();
async function setInfo() {
    const cookie_image = getCookie("image_path");
    document.getElementsByClassName("dropdownBtn")[0].src = cookie_image;
}

// 비밀번호 변경
window.save = async function save() {
    let state = passwordChk();
    let password = document.getElementById("password").value;
    if (state) {
        const params = JSON.stringify({ "password": password });
        let response = await fetch(`${API.users}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: params,
            credentials: 'include',
        })
        if (response.status == 200) {
            let toast = document.getElementById("save");
            toast.classList.add("active");
            setTimeout(function () {
                toast.classList.remove("active");
            }, 1000);
        }
        else if(response.status == 404){
            alert("유저를 찾을 수 없습니다");
        }
        else{
            alert("비밀번호 변경에 실패하였습니다.");
        }


    }

}

// 비밀번호 유효성 체크
window.passwordChk = function passwordChk() {
    let pw = document.getElementById("password").value;
    let pwHelper = document.getElementsByClassName("passwordHelper")[0];
    let re_pw = document.getElementById("passwordChk").value;
    let repwHelper = document.getElementsByClassName("repasswordHelper")[0];

    // 비밀번호 유효성 검사
    if (!pw) {
        pwHelper.innerText = "* 비밀번호를 입력해주세요.";
        // 유효성 상태 저장
        document.getElementsByClassName("modify")[0].style.backgroundColor = "#ACA0EB";
    }
    else if (pw.length < 8 || pw.length > 20) {
        pwHelper.innerText = "* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
        // 유효성 상태 저장
        document.getElementsByClassName("modify")[0].style.backgroundColor = "#ACA0EB";
    }
    else if (pw != re_pw) {
        pwHelper.innerText = "* 비밀번호가 다릅니다.";
        // 유효성 상태 저장
        document.getElementsByClassName("modify")[0].style.backgroundColor = "#ACA0EB";
    }
    else {
        pwHelper.innerText = "";
        // 유효성 상태 저장
        document.getElementsByClassName("modify")[0].style.backgroundColor = "#7F6AEE";
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
        return pw;
    }

}

window.logout = function logout() {
    deleteCookie();
    location.href = "/community";
}
