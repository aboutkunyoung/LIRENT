## 🏠 *LIRENT* 🏠 

<p align="center">
일시적으로 비는 방을 위한 전대 계약 매칭 플랫폼
 </p>
 <p align="center">
 </p>
<br>

<h2> 1️⃣ 기획배경 </h2>

*방학이나 장기 여행과 같은 상황에 주는 임대료가 너무 아깝지 않아? *
<br>

일시적으로 비는 방을 재임대하는 전대 플랫폼의 필요성

<br>

## 2️⃣ 목표

1. 다양한 매물 정보 검색
2. 사용자 맞춤 서비스 제공 
    - 관심 매물, 관심 동네를 등록하고 한 눈에 모아볼 수 있도록 한다.
3. 자치구 별 통계 및 학군 정보 제공
    - 이사갈 동네를 비교하고 선택하는데 도움을 준다
4. 우리동네 커뮤니티로 활용
    - 지역 커뮤니티 활성화에 기여한다.
<br>

## 3️⃣ 역할

<h3>Backend (Spring) & Front-end(Vue)</h3>

  - 로그인, 회원가입, 마이페이지 개발  
  - 공지사항, QnA를 위한 게시판 개발 
  - 전차인을 위한 매물 등록 
  - 전대인을 위한 매물 조회 
  - 거래를 위한 예약, 대화 기능 
  - *사용자 정보 기반 계약서 자동 생성 서비스 개발*  
<br>

## 4️⃣ 개발 환경 & 기술 스택

  <p align="center">
  <img src="https://img.shields.io/badge/Language-Java-007396?style=flat&logo=java&logoColor=white"> 
  <img src="https://img.shields.io/badge/Language-JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=white"> 
  <img src="https://img.shields.io/badge/Database-MySql-F80000?style=flat&logo=mysql&logoColor=white"> 
  </p>

  <p align="center">
  <img src="https://img.shields.io/badge/Framework-Vue-D22128?style=flat&logo=vue.js&logoColor=white"> 
  <img src="https://img.shields.io/badge/Framework-SpringFramework-6DB33F?style=flat&logo=spring&logoColor=white">
  </p>

  <p align="center">
  <img src="https://img.shields.io/badge/API-Kakao_Map-red?style=flat"> 
  <img src="https://img.shields.io/badge/Library-vue_Bootstrap-563D7C?style=flat&logo=bootstrap&logoColor=white">
  </p>

<br>

## 5️⃣ 프로젝트 설계

### Client (Vue)
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

### Server (Spring Boot)

```
LIRENT_BACKEND/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   ├── com/
│   │   │   │   ├── ssafy/
│   │   │   │   │   ├── lirent/
│   │   │   │   │   │   ├── config/
│   │   │   │   │   │   │   ├── CorsConfig.java
│   │   │   │   │   │   │   ├── MybatisConfig.java
│   │   │   │   │   │   │   ├── SwaggerConfig.java
│   │   │   │   │   │   │   ├── WebMvcConfig.java
│   │   │   │   │   │   │   ├── WebSocketConfig.java
│   │   │   │   │   │   │   └── newfile.acd
│   │   │   │   │   │   ├── controller/
│   │   │   │   │   │   │   ├── BasketController.java
│   │   │   │   │   │   │   ├── ChatsController.java
│   │   │   │   │   │   │   ├── DocumentController.java
│   │   │   │   │   │   │   ├── MemberController.java
│   │   │   │   │   │   │   ├── NoticeController.java
│   │   │   │   │   │   │   ├── SubleaseController.java
│   │   │   │   │   │   │   └── SubleaseDealController.java
│   │   │   │   │   │   ├── interceptor/
│   │   │   │   │   │   │   └── JwtInterceptor.java
│   │   │   │   │   │   ├── model/
│   │   │   │   │   │   │   ├── dto/
│   │   │   │   │   │   │   │   ├── BasketDto.java
│   │   │   │   │   │   │   │   ├── ChatsDto.java
│   │   │   │   │   │   │   │   ├── MemberDto.java
│   │   │   │   │   │   │   │   ├── NoticeDto.java
│   │   │   │   │   │   │   │   ├── SubleaseDealDto.java
│   │   │   │   │   │   │   │   ├── SubleaseDto.java
│   │   │   │   │   │   │   │   └── member/
│   │   │   │   │   │   │   │       ├── MemberLoginRequestDto.java
│   │   │   │   │   │   │   │       ├── MemberLoginResponseDto.java
│   │   │   │   │   │   │   │       ├── MemberRegistRequestDto.java
│   │   │   │   │   │   │   │       ├── MemberUpdateRequestDto.java
│   │   │   │   │   │   │   │       └── MemberUpdateResponseDto.java
│   │   │   │   │   │   │   ├── sublease/
│   │   │   │   │   │   │   │   ├── SubleaseAddRequestDto.java
│   │   │   │   │   │   │   │   ├── SubleaseDealAddRequestDto.java
│   │   │   │   │   │   │   │   ├── SubleaseDealGetResponseDto.java
│   │   │   │   │   │   │   │   └── SubleaseGetResponseDto.java
│   │   │   │   │   │   │   ├── mapper/
│   │   │   │   │   │   │   │   ├── BasketMapper.java
│   │   │   │   │   │   │   │   ├── ChatsMapper.java
│   │   │   │   │   │   │   │   ├── MemberMapper.java
│   │   │   │   │   │   │   │   ├── NoticeMapper.java
│   │   │   │   │   │   │   │   ├── SubleaseDealMapper.java
│   │   │   │   │   │   │   │   └── SubleaseMapper.java
│   │   │   │   │   │   │   ├── service/
│   │   │   │   │   │   │   │   ├── BasketService.java
│   │   │   │   │   │   │   │   ├── ChatsService.java
│   │   │   │   │   │   │   │   ├── DocumentService.java
│   │   │   │   │   │   │   │   ├── MemberService.java
│   │   │   │   │   │   │   │   ├── NoticeService.java
│   │   │   │   │   │   │   │   ├── SubleaseDealService.java
│   │   │   │   │   │   │   │   └── SubleaseService.java
│   │   │   │   │   │   │   ├── util/
│   │   │   │   │   │   │   │   ├── ApiUtil.java
│   │   │   │   │   │   │   │   └── JwtUtil.java
│   │   ├── resources/
│   │   │   ├── contract/
│   │   │   ├── fonts/
│   │   │   ├── mapper/
│   │   │   │   ├── BasketMapper.xml
│   │   │   │   ├── ChatsMapper.xml
│   │   │   │   ├── MemberMapper.xml
│   │   │   │   ├── NoticeMapper.xml
│   │   │   │   ├── SubleaseDealMapper.xml
│   │   │   │   └── SubleaseMapper.xml
│   │   │   └── application.properties

```

1. ERD  
    ![image](/uploads/ac672db401be3b7a44319c5957d58218/ER-Diagram.PNG)

2. Class Diagram  
    ![image](/uploads/6ed5ac4463bfced90d465d0fec0f2f2e/Class-Diagram.png)




<br>

## 6️⃣ 개발 내용 / 성과

  - Kakao Map API를 활용한 **매물 위치 정보, 학군 정보** 시각화
  - **JWT**를 활용한 맴버관리(로그인, 회원가입 등) 구현
  - 사용자 중심 **즐겨찾기 서비스** 구현 (관심 매물 등록)
  - **Spring Web Soket** 과 **STOMP**를 활용한 실시간 채팅 서비스 구현
  - **Apache POI**를 활용한 계약서 자동 생성 서비스 구현
  - **Git**을 활용한 협업관리
<br>
