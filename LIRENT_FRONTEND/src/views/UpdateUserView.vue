<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useMemberStore } from "@/stores/member";

const router = useRouter();
const store = useMemberStore();

// 컴포넌트 로드 시 회원 정보 불러오기
onMounted(() => {
  loadMemberInfo();
});

// 회원 정보 로드
const loadMemberInfo = async () => {
  try {
    // 유저 정보 받아오는 API 호출
    await store.getUserData();
  } catch (error) {
    console.error(error.message);
  }
};

// 회원 정보 수정
const updateMember = async () => {
  try {
    await store.updateUser(store.member.pw, store.member.name, store.member.email);
    alert("수정에 성공하였습니다.");
    router.push("/mypage");
  } catch (error) {
    console.error("회원 정보 수정 실패:", error);
    alert("수정에 실패하였습니다.");
  }
};


</script>

<template>
  <div class="container mt-5">
    <div style="height: 70px"></div>
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header text-center">
            <h4>회원 정보</h4>
          </div>
          <div class="card-body">
            <div class="form-group">
              <label for="name">이름</label>
              <input
                type="text"
                class="form-control"
                id="name"
                v-model="store.member.name"
                required
              />
            </div>
            <div class="form-group">
              <label for="userId">아이디</label>
              <input
                type="text"
                class="form-control"
                id="userId"
                v-model="store.member.id"
                disabled
              />
            </div>
            <div class="form-group">
              <label for="email">이메일</label>
              <input
                type="text"
                class="form-control"
                id="email"
                v-model="store.member.email"
              />
            </div>
            <div class="form-group">
              <label for="password">비밀번호</label>
              <input
                type="password"
                class="form-control"
                id="password"
                v-model="store.member.pw"
                required
              />
            </div>
            <button
              class="btn btn-primary btn-block mt-3"
              @click="updateMember"
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
