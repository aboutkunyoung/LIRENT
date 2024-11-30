# 구현완료

1. Vue 전환
2. 회원 관리
   1. 로그인
   2. 로그아웃
   3. 회원정보 수정
   4. 회원 삭제
   5. 비밀번호 찾기
3. QnA 페이지
   1. 게시글 목록
   2. 게시글 등록
   3. 게시글 수정
   4. 게시글 삭제

# ERD

![alt](/image/ERD.png)

# 파일 구조

```
node_modules/
src/
│   ├── assets/
│   │   └── scss/
│   │       └── styles.scss
│   ├── components/
│   ├── common/
│   │   ├── Chat.vue
│   │   ├── Navbar.vue
│   │   ├── RegisterAddress.vue
│   │   └── detail/
│   │       ├── HomeDetatilBoard.vue 
│   │       └── HomeDetailChat.vue
│   ├── router/
│   │   └── index.js
│   ├── stores/
│   │   └── member.js
│   ├── util/
│   │   ├── http-commons.js
│   │   └── KakaoMap.js
│   ├── views/
│   │   ├── ContractView.vue
│   │   ├── HomeDetailView.vue
│   │   ├── HomeView.vue
│   │   ├── LoginView.vue
│   │   ├── MyBuketView.vue
│   │   ├── MyDealView.vue
│   │   ├── MyPageView.vue
│   │   ├── MySubleaseView.vue
│   │   ├── QuestionView.vue
│   │   ├── RegisterView.vue
│   │   ├── ResetPasswordView.vue
│   │   └── UpdateUserView.vue
│   ├── App.vue
│   ├── main.js
│   └── vite.config.js

.env
```

# 시연

# 랜딩 페이지

![alt](/image/LANDING.png)

## 회원 관리

![alt](/image/MEMBER-1.png)
![alt](/image/MEMBER-4.png)
![alt](/image/MEMBER-2.png)
![alt](/image/MEMBER-3.png)
![alt](/image/MEMBER-5.png)

## 아파트 매물 조회

### 주소 기반 검색

![alt](/image/MAP-1.png)

### 아파트명 기반 검색

![alt](/image/MAP-2.png)

## Q&A 게시판

기본 화면
![alt](/image/BOARD-1.png)
글쓰기 버튼 클릭 후
![alt](/image/BOARD-2.png)
게시판에서 글 선택 후 해당 글이 자신이 작성한 게시글일 경우
![alt](/image/BOARD-3.png)
게시판에서 글 선택 후 해당 글이 자신이 작성한 게시글이 아닐 경우
![alt](/image/BOARD-4.png)
