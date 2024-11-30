<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useMemberStore } from "@/stores/member"; // 정확한 경로로 수정

const router = useRouter();
const memberStore = useMemberStore();

const loginFailMessage = ref("");
const userId = ref("");
const password = ref("");
const saveIdChecked = ref(false);

onMounted(() => {
  const savedUserId = document.cookie.replace(
    /(?:(?:^|.*;\s*)userId\s*\=\s*([^;]*).*$)|^.*$/,
    "$1"
  );
  if (savedUserId) {
    saveIdChecked.value = true;
    userId.value = savedUserId;
  }
});

const handleLogin = async () => {
  try {
    const token = await memberStore.login(userId.value, password.value);

    if (!token) {
      throw new Error("로그인 실패: 토큰이 없습니다.");
    }
    // 토큰 저장
    localStorage.setItem("accessToken", token);

    // 사용자 정보 가져오기
    await memberStore.getUserData();
    router.push("/"); // 로그인 후 홈으로 이동
  } catch (error) {
    console.error("로그인 오류:", error);
    if (error.response && error.response.status === 404) {
      alert("아이디 또는 비밀번호가 잘못되었습니다.");
    } else {
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    }
  }
};

// 페이지 이동 함수
const navigateTo = (path) => {
  router.push({ path: `/${path}` });
};
</script>

<template>
  <div class="container">
    <div class="row justify-content-center py-5">
      <div class="col-12 col-lg-6">
        <div class="card shadow-lg border-0">
          <div class="card-body p-5">
            <h2 class="text-center mb-4">로그인</h2>
            <!-- 로그인 실패 메시지 -->
            <div v-if="loginFailMessage" class="text-danger text-center mb-3">
              {{ loginFailMessage }}
            </div>

            <!-- 로그인 폼 -->
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="username" class="form-label">아이디</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="userId"
                  id="username"
                  placeholder="아이디를 입력하세요"
                  required
                />
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">비밀번호</label>
                <input
                  type="password"
                  class="form-control"
                  v-model="password"
                  id="password"
                  placeholder="비밀번호를 입력하세요"
                  required
                />
              </div>

              <div class="form-check mb-3">
                <input
                  type="checkbox"
                  class="form-check-input"
                  v-model="saveIdChecked"
                  id="saveId"
                />
                <label class="form-check-label" for="saveId">아이디 저장</label>
              </div>

              <button class="btn btn-primary w-100 py-2" type="submit">
                로그인
              </button>
            </form>

            <div class="text-center mt-4">
              <router-link to="/register" class="text-decoration-none">
                계정이 없으신가요? <strong>회원가입</strong>
              </router-link>
            </div>
            <div class="text-center mt-2">
              <router-link to="/resetPassword" class="text-decoration-none">
                비밀번호를 잊으셨나요? <strong>재설정하기</strong>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
body {
  background-color: #f8f9fa;
}

.card {
  border-radius: 10px;
}

.card-body {
  background-color: #ffffff;
}

.btn-primary {
  background-color: #007bff;
  border: none;
}
</style>
