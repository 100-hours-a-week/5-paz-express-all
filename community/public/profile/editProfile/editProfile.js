import { getCookie, setCookie, deleteCookie } from '../../utils/cookie.js';
import { API } from "../../config.js";

let image_path = "";
let nickname = "";
// 초기 데이터 로딩
setInfo();
async function setInfo() {
    const cookie_image = getCookie("image_path");
    image_path = cookie_image;

    const response = await fetch(`${API.users}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include',
    });
    console.log(response.status)


    if (response.status == 401) {
        deleteCookie("image_path");
        location.replace("/community");
    }
    else if (response.status == 200) {
        const data = await response.json();
        document.getElementsByClassName("dropdownBtn")[0].src = cookie_image;
        document.getElementsByClassName("image")[0].src = cookie_image;
        document.getElementsByClassName("fixedText")[0].innerText = data.data.email;
        document.getElementsByClassName("textInput")[0].value = data.data.nickname;
        nickname = data.data.nickname;
    }else if (response.status == 400) {
        alert("정보 조회에 실패하였습니다. 새로 고침을 해주세요.");
    }
}

// 사용자 정보 수정에 대한 로직



window.modify = async function modify() {
    // 중복검사를 true false로 거를 수 있는 방법을 고려
    //***** 중요함 꼭 고쳐야함. */
    const params = JSON.stringify({ "profile_image_path": image_path, "nickname": nickname });
    let response = await fetch(`${API.users}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: params,
        credentials: 'include',
    })
    if (response.status == 201) {
        let toast = document.getElementById("save");
        toast.classList.add("active");
        setTimeout(function () {
            toast.classList.remove("active");
        }, 1000);
        console.log(image_path, typeof (image_path))
        if (image_path !== "" && image_path !== null) {
            setCookie("image_path", image_path);
            document.getElementsByClassName("dropdownBtn")[0].src = image_path;
        }

    }
    else if (response.status == 404) {
        alert("유저가 없습니다.");
    }
    else {
        alert("변경에 실패하였습니다.")
    }
    // fetch가 성공하면 

}

window.drop = function drop() {
    location.replace("/community/checkdrop");
}

// 이미지 업로드
window.uploadImage = async function uploadImage() {
    const selectedFile = document.getElementById("uploadImage").files[0];

    // 선택된 파일의 여부에 따라 <원상복구> or <이미지 업로드 & 프리뷰>
    if (selectedFile) {
        console.log(selectedFile);
        const uri = await upload();
        let img = document.getElementsByClassName("image")[0];
        img.src = uri;
        image_path = uri;
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
// 닉네임 유효성 검사
window.nicknameChk = async function nicknameChk() {
    nickname = document.getElementById("nickname").value;
    let nickHelper = document.getElementsByClassName("helperText")[0];
    let duplChk = await isDuplicated(nickname);

    if (!nickname) {
        nickHelper.innerText = "* 닉네임을 입력해주세요.";
        return false;
    }
    else if (duplChk) {
        nickHelper.innerText = "* 중복된 닉네임입니다.";
        return false;
    }
    else if (nickname.length >= 11) {
        nickHelper.innerText = "* 닉네임은 최대 10자까지 작성 가능합니다.";
        return false;
    }
    else {
        nickHelper.innerText = "";
        // 유효성 상태 저장
        return nickname;
    }

    // 이메일 중복 검사
    async function isDuplicated(input) {

        // fetch: 백엔드 서버로 닉네임 중복검사 진행
        const response = await fetch(`${API.nicknameChk}?nickname=${input}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
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

window.logout = function logout() {
    deleteCookie();
    location.href = "/community";
}