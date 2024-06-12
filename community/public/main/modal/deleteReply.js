import {API} from "../../config.js";

window.deleteReply = async function deleteReply() {
    console.log("hello")
    const commentId = window.location.pathname.split('/')[3];
    let response = await fetch(`${API.comments}/${commentId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include',
    });
    if(response.status == 401){
        deleteCookie("image_path");
        location.replace("/community");
    }
    else if (response.status == 200) {
        alert("댓글이 성공적으로 삭제되었습니다.");
        history.back();
    }
    else if (response.status == 403){
        alert("댓글을 작성한 본인만 삭제가 가능합니다.");
        history.back();
    }
    else if (response.status == 404) {
        alert("댓글을 찾을 수가 없습니다.");
    }
    else if (response.status == 400) {
        alert("댓글을 삭제 할 수 없습니다.");
    }
}