const baseUrl = "http://125.130.247.176:9001";

export const API = {
    // user 관련 api
    login: `${baseUrl}/users/login`, // 로그인
    users: `${baseUrl}/users`, // 로그아웃, 회원가입, 개인정보 조회/수정, 회원 탈퇴
    emailChk: `${baseUrl}/users/email`, // 이메일 중복 여부 확인
    nicknameChk: `${baseUrl}/users/nickname`, // 닉네임 중복 여부 확인
    profileImage: `${baseUrl}/users/image`, // 프로필 이미지 업로드

    // post 관련 api
    posts: `${baseUrl}/posts`, // 모든 게시글 조회, 게시글 작성, 상세 조회, 수정, 삭제
    postImage: `${baseUrl}/posts/image`, // 게시글 이미지 업로드
    
    // comment 관련 api
    comments: `${baseUrl}/comments`, // 댓글 작성, 수정, 삭 
};