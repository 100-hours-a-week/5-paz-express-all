import { getCookie, deleteCookie } from "../../utils/cookie.js";
import { API } from "../../config.js";

setInfo();
getPosts();

async function setInfo() {
    const data = getCookie("image_path");
    console.log(data)

    // 쿠키로 개인 정보 조회
    document.getElementsByClassName("dropdownBtn")[0].src = data;
}

async function getPosts() {
    let list = await getData();
    console.log(list)

    document.getElementById("contents").innerHTML = list.map(post =>
        `<section class="content" onclick="location.href='/community/post/${post.id}'">
            <section class="contentHeader">
                <p class="contentTitle">${post.title}</p>
                <section class="contentInfoBox">
                    <section class="box">
                        <p class="contentInfoCheck">좋아요 ${convert_num(post.like_count)}</p>
                    </section>
                    <section class="box">
                        <p class="contentInfoReply">댓글 ${convert_num(post.replys_count)}</p>
                    </section>
                    <section class="box">
                        <p class="contentInfoWatch">조회수 ${convert_num(post.hits_count)}</p>
                    </section>
                    <section class="box">
                        <p class="contentInfoTime">${post.updated_at}</p>
                    </section>
                </section>
            </section>
            <hr class="lineContent" />
            <section class="contentFooter">
                <img class="icon" src="${post.profile_image_path}" />
                <p class="contentCreater">${post.nickname}</p>
            </section>
        </section>`
    ).join('');
}

async function getData() {
    let response = await fetch(`${API.posts}`, {
        method: "GET",
        headers: {
            "Content-Type": 'application/json'
        },
        credentials: 'include',
    })

    if(response.status == 401){
        deleteCookie("image_path");
        location.replace("/community");
    }
    else if(response.status == 200) {
        let data = await response.json();
        return data.data;
    }
    else if(response.status == 400){
        alert("게시글 조회에 실패하였습니다, 새로고침을 해주세요.");
    }

}

function convert_num(input) {
    console.log(input)
    if (input >= 1000 && input < 10000) {
        return "1k";
    }
    else if (input >= 10000 && input < 100000) {
        return "10k";
    }
    else if (input > 100000) {
        return "100k";
    }
    else {
        return input;
    }
}

window.logout = async function logout() {
    const response = await fetch(`${API.logout}`, {
        method: "POST",
        headers: {
            "Content-Type": 'application/json'
        },
        credentials: 'include',
    })

    if (response.status == 200) {
        deleteCookie("image_path");
        location.replace("/community");
    }
}

/*
<section class="content" onclick="location.href='/community/post'">
                    <section class="contentHeader">
                        <p class="contentTitle">제목 1</p>
                        <section class="contentInfoBox">
                            <p class="contentInfoCheck">좋아요 0</p>
                            <p class="contentInfoReply">댓글 0</p>
                            <p class="contentInfoWatch">조회수 0</p>
                            <p class="contentInfoTime">2021-01-01 00:00:00</p>
                        </section>
                    </section>
                    <hr class="lineContent" />
                    <section class="contentFooter">
                        <img class="icon" src="../assets/images/lightHouse.jpg" />
                        <p class="contentCreater">더미 작성자 1</p>
                    </section>
                </section>
 */