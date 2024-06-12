import {API} from "../../config.js";

window.deleteContent = async function deleteContent() {
    const postId = window.location.pathname.split('/')[3];
    let response = await fetch(`${API.posts}/${postId}`,{
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include',
    })
    if(response.status == 401){
        deleteCookie("image_path");
        location.replace("/community");
    }
    else if(response.status == 200){
        alert("게시글을 성공적으로 삭제하였습니다.");
        location.replace("/community/main");
    }
    else if(response.status == 403){
        alert("게시글을 작성한 본인만 삭제가 가능합니다.");
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