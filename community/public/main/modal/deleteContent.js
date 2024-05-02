import { getCookie } from "../../utils/cookie.js";
import {API} from "../../config.js";

checkAuth();
function checkAuth() {
    const id = getCookie("id");
    if(id == "null" || id == null){
        alert("로그인이 풀렸습니다. 다시 로그인 해주세요.");
        location.replace("/community");
    }
}

window.deleteContent = async function deleteContent() {
    const postId = window.location.pathname.split('/')[3];
    let response = await fetch(`${API.posts}/${postId}`,{
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    if(response.status == 200){
        alert("게시글을 성공적으로 삭제하였습니다.");
        location.replace("/community/main");
    }
    else if(response.status == 404){
        alert("게시글을 찾을 수가 없습니다.");
    }
    else if(response.status == 400){
        alert("게시글 삭제에 실패하였습니다.");
        location.replace(`/community/post/${postId}`);
    }
}

window.cancelDelete = async function cancelDelete() {
    const postId = window.location.pathname.split('/')[3];
    location.replace(`/community/post/${postId}`);
}