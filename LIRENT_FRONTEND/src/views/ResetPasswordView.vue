<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useMemberStore } from "@/stores/member";
import axios from 'axios'; 

const router = useRouter();
const store = useMemberStore();

const name = ref("");
const email = ref("");


// 비밀번호 재설정 요청
const resetPassword = async () => {
  try {
    // 비밀번호 재설정 API 호출
    await store.resetPassword(name.value, email.value);
    alert("비밀번호가 초기화되었습니다. 초기 비밀번호는 1234입니다.");
    router.push("/login"); // 로그인 페이지로 이동
  } catch (error) {
    console.error(error);
    alert("비밀번호 재설정에 실패했습니다.");
  }
};

// 로그인 페이지로 이동
const goToLogin = () => {
  console.log("asdfasdfA?SDAF?ASD?F")
  router.push("/login");
};
</script>

<template>
  <div class="container mt-5">
    <h2 class="text-center">비밀번호 재설정</h2>
    
    <form @submit.prevent="resetPassword">
  <div class="form-group">
    <label for="name">이름</label>
    <input
      type="text"
      class="form-control"
      id="name"
      v-model="name"
      placeholder="이름을 입력하세요"
      required
    />
  </div>
  <div class="form-group">
    <label for="email">이메일</label>
    <input
      type="email"
      class="form-control"
      id="email"
      v-model="email"
      placeholder="이메일을 입력하세요"
      required
    />
  </div>
  <button class="btn btn-primary btn-block" type="submit">
    비밀번호 재설정
  </button>
</form>
  </div>
</template>

<style scoped>
body {
  background-color: #f8f9fa;
}

.container {
  max-width: 400px;
  margin-top: 100px;
}

.form-control:focus {
  box-shadow: none;
  border-color: #80bdff;
}
</style>
