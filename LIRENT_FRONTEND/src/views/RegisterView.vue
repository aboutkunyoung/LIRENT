<script setup>
import { handleError, reactive } from "vue";
import { useRouter } from "vue-router";
import { useMemberStore } from "@/stores/member";
import RegisterAddress from "@/components/RegisterAddress.vue";

const router = useRouter();
const store = useMemberStore();

const member = reactive({
  email: "",
  password: "",
  phone: "",
  address: "",
  nickname: "",
  park: false,
  buildingElevatorNum: undefined,
  floor: undefined,
  area: undefined,
  rooms: undefined,
  bathrooms: undefined,
  latitude: "",
  longitude: "",
});

const errors = reactive({
  email: false,
  password: false,
  phone: false,
  nickname: false,
});

function validateFields() {
  errors.email = !member.email;
  errors.password = !member.password;
  errors.phone = !member.phone;
  errors.nickname = !member.nickname;

  return !errors.email && !errors.password && !errors.phone && !errors.nickname;
}

function setAddressData(data) {
  member.address = data.address;
  member.latitude = data.latitude;
  member.longitude = data.longitude;
}
async function regist() {
  if (validateFields()) {
    const emailExists = await store.checkEmailExists(member.email);
    if (emailExists) {
      return;
    }
    store
      .register(member)
      .then((res) => {
        console.log("회원가입 성공 결과:", res);
        alert("회원가입에 성공했습니다.");
        router.push("/login");
      })
      .catch((error) => {
        console.error("회원가입 중 오류:", error);
        alert("아이디가 중복되어 회원가입에 실패했습니다.");
        location.reload(); // 페이지 리로드
      });
  }
}
// function regist() {
//   if (validateFields()) {
//     store
//       .register(member)
//       .then(() => {
//         alert("회원가입에 성공했습니다.");
//         router.push("login");
//       })
//       .catch((error) => {
//         handleError(error);
//       });
//   }
// }
function validateEmail() {
  if (!member.email) {
    errors.email = true;
    return false;
  }

  store
    .checkEmailExists(member.email)
    .then((exists) => {
      errors.email = exists; // 중복 여부에 따라 에러 설정
    })
    .catch((err) => {
      console.error("이메일 유효성 검사 중 오류:", err);
    });
}
</script>

<template>
  <div>
    <div class="container">
      <form @submit.prevent="regist" class="container py-5">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-8">
            <div class="card shadow-lg border-0">
              <div class="card-body p-5">
                <h1 class="text-center mb-4">회원가입</h1>

                <!-- 회원 정보 -->
                <div class="mb-4">
                  <h4 class="border-bottom pb-2 mb-3">회원 정보 (필수)</h4>
                  <div class="row g-3">
                    <!-- 이메일 주소 -->
                    <div class="col-12 col-md-6">
                      <label for="email" class="form-label">이메일 주소</label>
                      <input
                        type="email"
                        class="form-control"
                        placeholder="이메일을 입력하세요"
                        v-model="member.email"
                        :class="{ 'is-invalid': errors.email }"
                        @blur="validateEmail"
                        required
                      />
                      <div v-if="errors.email" class="invalid-feedback">
                        사용 중인 이메일입니다.
                      </div>
                    </div>
                    <!-- 비밀번호 -->
                    <div class="col-12 col-md-6">
                      <label for="pw" class="form-label">비밀번호</label>
                      <input
                        type="password"
                        class="form-control"
                        placeholder="비밀번호를 입력하세요"
                        v-model="member.password"
                        :class="{ 'is-invalid': errors.password }"
                        required
                      />
                      <div v-if="errors.password" class="invalid-feedback">
                        비밀번호를 입력하세요.
                      </div>
                    </div>
                    <!-- 전화번호 -->
                    <div class="col-12 col-md-6">
                      <label for="phone" class="form-label">전화번호</label>
                      <input
                        type="text"
                        class="form-control"
                        placeholder="010-0000-0000"
                        v-model="member.phone"
                        :class="{ 'is-invalid': errors.phone }"
                        required
                      />
                      <div v-if="errors.phone" class="invalid-feedback">
                        전화번호를 입력하세요.
                      </div>
                    </div>
                    <div class="col-12 col-md-6">
                      <label for="nickname" class="form-label">이름</label>
                      <input
                        type="text"
                        class="form-control"
                        placeholder="이름을 입력하세요"
                        v-model="member.nickname"
                        :class="{ 'is-invalid': errors.nickname }"
                        required
                      />
                      <div v-if="errors.nickname" class="invalid-feedback">
                        닉네임을 입력하세요.
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 집 정보 -->
                <div class="mb-4">
                  <h4 class="border-bottom pb-2 mb-3">집 정보 (선택사항)</h4>
                  <RegisterAddress @load="setAddressData" />

                  <div class="row g-3">
                    <!-- 주차 가능 -->
                    <div
                      class="col-12 col-md-4 d-flex align-items-center justify-content-center"
                    >
                      <div class="form-check form-switch">
                        <label for="park" class="form-check-label ms-2 mb-0"
                          >주차 가능</label
                        >
                        <input
                          type="checkbox"
                          class="form-check-input"
                          v-model="member.park"
                        />
                      </div>
                    </div>
                    <!-- 승강기 개수 -->
                    <div class="col-12 col-md-4">
                      <label for="buildingElevatorNum" class="form-label"
                        >승강기 개수</label
                      >
                      <input
                        type="text"
                        class="form-control"
                        placeholder="입력"
                        v-model="member.buildingElevatorNum"
                      />
                    </div>
                    <!-- 층수 -->
                    <div class="col-12 col-md-4">
                      <label for="floor" class="form-label">층수</label>
                      <input
                        type="text"
                        class="form-control"
                        placeholder="입력"
                        v-model="member.floor"
                      />
                    </div>
                    <!-- 평수 -->
                    <div class="col-12 col-md-6">
                      <label for="area" class="form-label">평수</label>
                      <input
                        type="text"
                        class="form-control"
                        placeholder="입력"
                        v-model="member.area"
                      />
                    </div>
                    <!-- 방 개수 -->
                    <div class="col-12 col-md-6">
                      <label for="rooms" class="form-label">방 개수</label>
                      <input
                        type="text"
                        class="form-control"
                        placeholder="입력"
                        v-model="member.rooms"
                      />
                    </div>
                    <!-- 화장실 개수 -->
                    <div class="col-12">
                      <label for="bathrooms" class="form-label"
                        >화장실 개수</label
                      >
                      <input
                        type="text"
                        class="form-control"
                        placeholder="입력"
                        v-model="member.bathrooms"
                      />
                    </div>
                  </div>
                </div>

                <!-- 가입 버튼 -->
                <button class="btn btn-primary w-100 py-2" type="submit">
                  가입하기
                </button>

                <!-- 추가 링크 -->
                <div class="text-center mt-4">
                  <router-link to="/login" class="text-decoration-none">
                    이미 계정이 있으신가요? <strong>로그인</strong>
                  </router-link>
                </div>
                <div class="text-center mt-2">
                  <router-link to="/" class="text-decoration-none">
                    홈으로 돌아가기
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
body {
  background-color: #f8f9fa;
}

.form-control:focus {
  box-shadow: none;
  border-color: #80bdff;
}

.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  display: block;
  color: #dc3545;
}
</style>
