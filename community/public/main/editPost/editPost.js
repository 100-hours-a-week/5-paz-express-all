import { getCookie, deleteCookie } from "../../utils/cookie.js";
import { API } from "../../config.js";

let image_path = "";
const postId = window.location.pathname.split('/')[3];
setPost();

// 데이터를 불러와서 필요 내용 추출 후 생성하는 함수
async function setPost() {
    // url의 pathname을 '/'단위로 잘라서 id 값만 추출 (https://css-tricks.com/snippets/javascript/get-url-and-url-parts-in-javascript/)
    const data = await getData(postId);

    const cookie_image = getCookie("image_path");

    document.getElementsByClassName("dropdownBtn")[0].src = cookie_image;
    document.getElementsByClassName("textInput")[0].value = data.title;
    document.getElementsByClassName("textareaInput")[0].innerText = data.content;
    document.getElementsByClassName("subtext")[0].innerText = data.post_image_path;
}

// id에 해당하는 json 추출
async function getData(id) {
    let response = await fetch(`${API.posts}/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include',
    });

    if (response.status == 401) {
        deleteCookie("image_path");
        location.replace("/community");
    }
    else if (response.status == 200) {
        let dataAll = await response.json();
        return dataAll.data;
    }
    else if (response.status == 400) {
        alert("게시글 정보 조회에 실패하였습니다.");
    }

}

// 이미지 업로드
window.uploadImage = async function uploadImage() {
    const selectedFile = await document.getElementById("imageInput").files[0];

    // 선택된 파일의 여부에 따라 <원상복구> or <이미지 업로드 & 프리뷰>
    if (selectedFile) {
        console.log(selectedFile);
        const uri = await upload();
        document.getElementsByClassName("subtext")[0].innerText = uri;
        image_path = uri;
    } else {
        console.log("no data here")
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

// 포스트
window.edit = async function edit() {
    let title = document.getElementById("title").value;
    let content = document.getElementById("content").value;

    console.log(title)
    console.log(content)
    console.log(image_path)

    let params = { "title": title, "content": content, "post_image_path": image_path };
    let response = await fetch(`${API.posts}/${postId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params),
        credentials: 'include',
    })
    if (response.status == 401) {
        deleteCookie("image_path");
        location.replace("/community");
    }
    else if (response.status == 201) {
        alert("수정이 완료되었습니다.");
        history.back();
    }
    else if (response.status == 404) {
        alert("게시글을 찾을 수가 없습니다.");
    }
    else if (response.status == 400) {
        alert("게시글 수정에 실패하였습니다");
    }

}

window.chk = function chk() {
    let title = document.getElementById("title").value;
    let content = document.getElementById("content").value;

    if (title && content) {
        document.getElementsByClassName("helperText")[0].innerText = "";
    }
    else {
        document.getElementsByClassName("helperText")[0].innerText = "* 제목, 내용을 모두 작성해주세요.";
    }

}


window.logout = function logout() {
    deleteCookie();
    location.href = "/community";
}