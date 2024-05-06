import { getCookie, deleteCookie } from "../../utils/cookie.js";
import { API } from "../../config.js";

// url의 pathname을 '/'단위로 잘라서 id 값만 추출 (https://css-tricks.com/snippets/javascript/get-url-and-url-parts-in-javascript/)
const postId = window.location.pathname.split('/')[3];
setPost();

// 데이터를 불러와서 필요 내용 추출 후 생성하는 함수
async function setPost() {
    const cookie_image = getCookie("image_path");

    document.getElementsByClassName("dropdownBtn")[0].src = cookie_image;

    // url의 pathname을 '/'단위로 잘라서 id 값만 추출 (https://css-tricks.com/snippets/javascript/get-url-and-url-parts-in-javascript/)
    console.log("post get")
    const data = await getData(postId);
    await getPost(data);
}

// 페이지에 동적으로 요소 생성
async function getPost(data) {
    const post = data.post;
    const comments = data.comment;

    // 게시글 본 내용 생성
    document.getElementById("content").innerHTML =
        `<section class="titleBox">
            <section class="contentInfoBox">
                <p class="contentTitle">${post.title}</p>
            </section>
            <section class="contentInfoBox">
                <img class="icon" src=${post.profile_image_path} />
                <p class="contentCreater">${post.nickname}</p>
                <p class="contentInfoTime">${post.updated_at}</p>
                <section class="buttonBox">
                    <button class="button" onclick="location.href='/community/editpost/${post.id}'">수정</button>
                    <button class="button" onclick="location.replace('/community/checkcontent/${post.id}')">삭제</button>
                </section>
            </section>
        </section>
        <hr class="lineContent" />
        <img class="contentImage" src=${post.post_image_path} />
        <section class="textBox">
            <p class="contentText">
                ${post.content}
            </p>
        </section>
        <section class="readInfo">
            <section class="innerBox">
                <p class="number">
                    ${convert_num(post.hits_count)}
                </p>
                <p class="lang">
                    조회수
                </p>
            </section>
            <section class="innerBox">
                <p class="number">
                    ${convert_num(post.replys_count)}
                </p>
                <p class="lang">
                    댓글
                </p>
            </section>
        </section>
    `;

    // 해당 게시글 댓글 생성
    document.getElementById("replys").innerHTML = comments.map(comment =>
        `<section class= "modifyBox" id="modifyBox${comment.id}">
        <section class="replyBox" id="replyBox">
            <section class="column">
                <section class="row">
                    <img class="icon" src=${comment.profile_image_path} />
                    <p class="contentCreater">${comment.nickname}</p>
                    <p class="contentInfoTime">${comment.updated_at}</p>
                </section>
                <p class="replyRead">${comment.comment}</p>
            </section>
            <section class="buttonBox">
                <button class="button" onclick="modifyComment(${comment.id});">수정</button>
                <button class="button" onclick="location.href='/community/checkreply/${comment.id}';">삭제</button>
            </section>
        </section></section>`).join('');
}


// id에 해당하는 게시글 본문 & 댓글 요청
async function getData(id) {
    let response2 = await fetch(`${API.comments}/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include',
    });
    if (response2.status == 401) {
        deleteCookie("image_path");
        location.replace("/community");
    }

    let response = await fetch(`${API.posts}/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include',
    });
    if(response.status == 401){
        deleteCookie("image_path");
        location.replace("/community");
    }
    
    if (response.status == 200 && response.status == 200) {
        let post = await response.json();
        let comments = await response2.json();

        let data = {
            "post": post.data,
            "comment": comments.data
        }
        return data;
    }
    else {
        alert("데이터 조회에 실패하였습니다. 새로고침을 해주세요.");
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

// 댓글 입력창 입력 여부 확인
window.replyChk = function replyChk() {
    let text = document.getElementById("inputReply").value;
    let button = document.getElementsByClassName("submit")[0];
    console.log(text.length);

    if (text.length == 0) {
        button.style.backgroundColor = "#ACA0EB";
        return false;
    }
    else {
        button.style.backgroundColor = "#7F6AEE";
        return text;
    }
}
// 댓글 입력 수행
window.addComment = async function addComment() {
    const state = replyChk();
    if (!state) {
        alert('댓글을 입력해주세요');
    }
    else {
        const body = JSON.stringify({ "comment": state });
        const response = await fetch(`${API.comments}/${postId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: body,
            credentials: 'include',
        });
        if (response.status == 401) {
            deleteCookie("image_path");
            location.replace("/community");
        }
        else if (response.status == 201) {
            alert("댓글 작성이 완료되었습니다.");
            window.location.reload();
        }
        else if (response.status == 404) {
            alert("게시글을 찾을 수가 없습니다.");
            location.href = "/community/main";
        }
        else if (response.status == 400) {
            alert("게시글 작성에 실패하였습니다.");
        }
    }
}
// 댓글 수정(댓글 정보 받아와서 입력창 open)
window.modifyComment = async function modifyComment(commentId) {
    const comment = await getComment(commentId);

    document.getElementById(`modifyBox${commentId}`).innerHTML =
        `<section class="modifyReply">
        <textarea class="textInput" id="inputReply${commentId}" >${comment.comment}</textarea>
        <section class="row">
            <button class="submit2" onclick="addModifiedComment(${commentId});">댓글 등록</button>
            <button class="submit2" onclick="resetComment(${commentId})">취소</button>
        </section>
     </section>`;
}

// comment id로 댓글 조회
async function getComment(id) {
    const response = await fetch(`${API.comments}/one/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "applicaion/json"
        },
        credentials: 'include',
    });
    const result = await response.json();
    if (response.status == 200) {
        return result.data;
    }
    else if (response.status == 404) {
        alert("댓글 정보를 찾을 수가 없습니다. 새로고침을 눌러주세요");
    }
    else if (response.status == 400) {
        alert("댓글 조회를 실패하였습니다. 새로고침을 눌러주세요.");
    }
}

// 댓글 수정 업로드
window.addModifiedComment = async function addModifiedComment(id) {
    let text = document.getElementById(`inputReply${id}`).value;
    let params = JSON.stringify({ "comment": text });
    const response = await fetch(`${API.comments}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: params,
        credentials: 'include',
    })
    if (response.status == 201) {
        alert("댓글 수정을 성공적으로 완료하였습니다.");
        window.location.reload();
    }
    else if (response.status == 404) {
        alert("댓글이 존재하지 않습니다.");
    }
    else if (response.status == 400) {
        alert("댓글 수정을 실패하였습니다.");
    }
}

// 댓글 수정 취소 버튼 클릭시 원상복귀
window.resetComment = async function resetComment(commentId) {
    const comment = await getComment(commentId);

    document.getElementById(`modifyBox${commentId}`).innerHTML =
        `<section class="replyBox" id="replyBox">
            <section class="column">
                <section class="row">
                    <img class="icon" src=${comment.profile_image_path} />
                    <p class="contentCreater">${comment.nickname}</p>
                    <p class="contentInfoTime">${comment.updated_at}</p>
                </section>
                <p class="replyRead">${comment.comment}</p>
            </section>
            <section class="buttonBox">
                <button class="button" onclick="modifyComment(${comment.id});">수정</button>
                <button class="button" onclick="location.href='/community/checkreply/${comment.id}';">삭제</button>
            </section>
        </section>`;
}

window.logout = function logout() {
    deleteCookie();
    location.href = "/community";
}

























/*
    본 컨텐츠 
    <section class="titleBox">
                    <section class="contentInfoBox">
                        <p class="contentTitle">제목 1</p>
                    </section>
                    <section class="contentInfoBox">
                        <img class="icon" src="/assets/images/lightHouse.jpg" />
                        <p class="contentCreater">더미 작성자 1</p>
                        <p class="contentInfoTime">2021-01-01 00:00:00</p>
                        <section class="buttonBox">
                            <button class="button" onclick="location.href='/community/editpost'">수정</button>
                            <button class="button" onclick="location.href='/community/checkcontent'">삭제</button>
                        </section>
                    </section>
                </section>
                <hr class="lineContent" />
                <img class="contentImage" src="/assets/images/lightHouse.jpg" />
                <section class="textBox">
                    <p class="contentText">
                        무엇을 얘기할까요? 아무말이라면, 삶은 항상 놀라운 모험이라고 생각합니다. 우리는 매일 새
                        로운 경험을 하고 배우며 성장합니다. 때로는 어려움과 도전이 있지만, 그것들이 우리를 더 강
                        하고 지혜롭게 만듭니다. 또한 우리는 주변의 사람들과 연결되며 사랑과 지지를 받습니다. 그래
                        서 우리의 삶은 소중하고 의미가 있습니다.<br>
                        자연도 아름다운 이야기입니다. 우리 주변의 자연은 끝없는 아름다움과 신비로움을 담고 있습
                        니다. 산, 바다, 숲, 하늘 등 모든 것이 우리를 놀라게 만들고 감동시킵니다. 자연은 우리의 생명
                        과 안정을 지키며 우리에게 힘을 주는 곳입니다.<br>
                        마지막으로, 지식을 향한 탐구는 항상 흥미로운 여정입니다. 우리는 끝없는 지식의 바다에서 배
                        우고 발견할 수 있으며, 이것이 우리를 더 깊이 이해하고 세상을 더 넓게 보게 해줍니다.
                        그런 의미에서, 삶은 놀라움과 경이로움으로 가득 차 있습니다. 새로운 경험을 즐기고 항상 앞
                        으로 나아가는 것이 중요하다고 생각합니다.<br>
                    </p>
                </section>
                <section class="readInfo">
                    <section class="innerBox">
                        <p class="number">
                            123
                        </p>
                        <p class="lang">
                            조회수
                        </p>
                    </section>
                    <section class="innerBox">
                        <p class="number">
                            123
                        </p>
                        <p class="lang">
                            댓글
                        </p>
                    </section>
                </section>
*/

/* 
    댓글 리스트 적용
    <section class="replyBox">
                    <section class="column">
                        <section class="row">
                            <img class="icon" src="/assets/images/lightHouse.jpg" />
                            <p class="contentCreater">더미 작성자 1</p>
                            <p class="contentInfoTime">2021-01-01 00:00:00</p>
                        </section>
                        <p class="replyRead">댓글 내용</p>
                    </section>
                    <section class="buttonBox">
                        <button class="button">수정</button>
                        <button class="button" onclick="location.href='/community/checkreply'">삭제</button>
                    </section>
                </section>
*/