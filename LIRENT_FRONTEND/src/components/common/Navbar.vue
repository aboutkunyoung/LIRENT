<script setup>
import { RouterLink, useRouter } from "vue-router";
import { useMemberStore } from "@/stores/member";
import { computed, onMounted } from "vue";

const router = useRouter();
const memberStore = useMemberStore();

// 로그인 상태를 계산 속성으로 정의
const isLoggedIn = computed(() => !!memberStore.accessToken);

const handleLogout = () => {
  memberStore.logout(); // 상태 초기화만 수행
  console.log("로그아웃 완료");
  router.push({ name: "logout" }); // Vue Router를 사용해 로그인 페이지로 이동
};
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light shadow">
    <div class="container">
      <RouterLink
        :to="{ name: 'landing' }"
        class="navbar-brand text-primary fw-bold"
        style="font-family: 'Rampart One', cursive"
        >LIRENT</RouterLink
      >
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-lg-0">
          <li class="nav-item">
            <RouterLink
              :to="{ name: 'qna' }"
              class="nav-link"
              aria-current="page"
              >게시판</RouterLink
            >
          </li>
        </ul>
        <!-- 로그인 전 -->
        <template v-if="!isLoggedIn">
          <ul class="navbar-nav mb-2 me-2 mb-lg-0" id="header_nav_confirm_off">
            <li class="nav-item">
              <RouterLink
                :to="{ name: 'login' }"
                class="nav-link"
                aria-current="page"
                >로그인</RouterLink
              >
            </li>
            <li class="nav-item">
              <RouterLink
                :to="{ name: 'register' }"
                class="nav-link"
                aria-current="page"
                >회원가입</RouterLink
              >
            </li>
          </ul>
        </template>
        <!-- 로그인 후 -->
        <template v-else>
          <ul class="navbar-nav mb-2 me-2 mb-lg-0" id="header_nav_confirm_on">
            <li class="nav-item">
              <button
                class="nav-link"
                aria-current="page"
                @click="handleLogout"
              >
                로그아웃
              </button>
            </li>
            <li class="nav-item">
              <RouterLink
                :to="{ name: 'mypage' }"
                class="nav-link"
                aria-current="page"
                >마이페이지</RouterLink
              >
            </li>

            <li class="nav-item">
              <RouterLink
                :to="{ name: 'mysublease' }"
                class="nav-link"
                aria-current="page"
                >내 매물 관리</RouterLink
              >
            </li>

            <li class="nav-item">
              <RouterLink
                :to="{ name: 'mydeal' }"
                class="nav-link"
                aria-current="page"
                >내 예약 관리</RouterLink
              >
            </li>

            <li class="nav-item">
              <RouterLink
                :to="{ name: 'mybuket' }"
                class="nav-link"
                aria-current="page"
                >즐겨찾기</RouterLink
              >
            </li>
          </ul>
        </template>
      </div>
    </div>
  </nav>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Rampart+One&display=swap");
.navbar {
  position: relative; /* 네브바를 지도 위로 올리기 위해 상대 위치 설정 */
  z-index: 10; /* 네브바가 지도보다 앞에 표시되도록 설정 */
  background-color: transparent !important;
  box-shadow: none !important; /* 그림자도 제거하고 싶을 경우 */
}

.navbar .nav-link {
  font-weight: bold;
  font-size: 1.3em;
}

.navbar-brand {
  font-weight: bold;
  font-size: 1.7em;
}
</style>
