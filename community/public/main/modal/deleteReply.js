import { getCookie } from "../../utils/cookie.js";

checkAuth();
function checkAuth() {
    const id = getCookie("id");
    if(id == "null" || id == null){
        alert("로그인이 풀렸습니다. 다시 로그인 해주세요.");
        location.replace("/community");
    }
}

window.deleteReply = async function deleteReply() {
    console.log("hello")
    const commentId = window.location.pathname.split('/')[3];
    let response = await fetch(`http://125.130.247.176:9001/comments/${commentId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });
    if (response.status == 200) {
        alert("댓글이 성공적으로 삭제되었습니다.");
        history.back();
    }
    else if (response.status == 404) {
        alert("댓글을 찾을 수가 없습니다.");
    }
    else if (response.status == 400) {
        alert("댓글을 삭제 할 수 없습니다.");
    }
}