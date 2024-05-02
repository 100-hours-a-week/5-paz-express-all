import {deleteCookie, getCookie} from "../../utils/cookie.js";
import {API} from "../../config.js";

checkAuth();
function checkAuth() {
    const id = getCookie("id");
    if(id == "null" || id == null){
        alert("로그인이 풀렸습니다. 다시 로그인 해주세요.");
        location.replace("/community");
    }
}

window.cancel = function cancel() {
    history.back();
}

window.deleteAccount = async function deleteAccount() {
    const id = getCookie("id");
    const response = await fetch(`${API.users}/${id}`,{
        method: "DELETE",
        header: {
            "Content-Type": "application/json"
        }
    });
    if (response.status==200){
        alert("계정이 성공적으로 삭제되었습니다.")
        deleteCookie();
        location.href="/community";
    }
    else if(response.status == 404){
        alert("계정을 찾을 수 없습니다");
    }
    else if(response.status == 400){
        alert("계정 삭제를 실패하였습니다.")
    }
}