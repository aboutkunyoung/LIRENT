<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useMemberStore } from "@/stores/member";
import RegisterAddress from "@/components/RegisterAddress.vue";

const router = useRouter();
const store = useMemberStore();
const isPasswordEditing = ref(false);

// 수정 상태 관리
const isEditing = ref(false);

// 비밀번호 입력 필드 값 관리
const passwordFieldValue = ref("********");

// 컴포넌트 로드 시 회원 정보 불러오기
onMounted(() => {
  loadMemberInfo();
});

const loadMemberInfo = async () => {
  try {
    // 유저 정보 받아오는 API 호출
    await store.getUserData();
    // 비밀번호는 서버에서 가져오지 않으므로 초기값 설정
    passwordFieldValue.value = "********";
  } catch (error) {
    console.error(error.message);
  }
};

// 회원 탈퇴
const deleteMember = async () => {
  const result = confirm("정말 탈퇴하시겠습니까?");
  if (result) {
    try {
      await store.deleteUser();
      alert("탈퇴되었습니다. 그동안 이용해주셔서 감사합니다.");
      store.logout();
      router.push("/");
    } catch (error) {
      console.error(error.message);
    }
  }
};

// 정보 수정 상태 전환
const toggleEdit = () => {
  isEditing.value = !isEditing.value;
  if (isEditing.value) {
    // 수정 모드로 전환될 때 비밀번호 필드 초기화
    passwordFieldValue.value = "";
  } else {
    // 수정 취소 시 비밀번호 필드 다시 마스킹
    passwordFieldValue.value = "********";
  }
};

// 주소 변경 이벤트 처리
const setAddressData = (data) => {
  if (isEditing.value) {
    store.member.address = data.address || ""; // 기본값 설정
    store.member.latitude = data.latitude || "0.0"; // 기본값 설정
    store.member.longitude = data.longitude || "0.0"; // 기본값 설정
  }
};

// 회원 정보 업데이트
const updateMember = async () => {
  try {
    const updateData = {
      email: store.member.email,
      nickname: store.member.nickname,
      phone: store.member.phone,
      address: store.member.address,
      park: store.member.park,
      buildingElevatorNum: store.member.buildingElevatorNum,
      floor: store.member.floor,
      area: store.member.area,
      rooms: store.member.rooms,
      bathrooms: store.member.bathrooms,
      latitude: store.member.latitude,
      longitude: store.member.longitude,
    };

    // 비밀번호 수정 버튼이 체크된 경우에만 비밀번호 포함
    if (isPasswordEditing.value) {
      if (!passwordFieldValue.value) {
        alert("비밀번호를 입력해주세요.");
        return;
      }
      updateData.password = passwordFieldValue.value;
    }

    await store.updateUser(updateData);
    alert("정보가 수정되었습니다.");
    isEditing.value = false; // 수정 종료
    isPasswordEditing.value = false; // 비밀번호 수정 상태 초기화

    // 비밀번호 필드 다시 마스킹
    passwordFieldValue.value = "********";
  } catch (error) {
    console.error("정보 수정 실패:", error.message);
    alert("정보 수정에 실패했습니다.");
  }
};
</script>

<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card shadow-lg border-0">
          <div class="card-body p-5">
            <h2 class="text-center mb-4">회원 정보</h2>

            <form>
              <!-- 이름 -->
              <div class="form-group mb-3">
                <label for="nickname" class="form-label">이름</label>
                <input type="text" :readonly="!isEditing" class="form-control" id="nickname"
                  v-model="store.member.nickname" />
              </div>

              <!-- 이메일 -->
              <div class="form-group mb-3">
                <label for="email" class="form-label">이메일</label>
                <input type="text" :readonly="!isEditing" class="form-control" id="email"
                  v-model="store.member.email" />
              </div>

              <!-- 비밀번호 -->
              <div class="form-group mb-3">
                <label for="password" class="form-label">비밀번호</label>
                <div class="d-flex align-items-center">
                  <input type="checkbox" id="editPassword" class="form-check-input me-2" v-model="isPasswordEditing"
                    :disabled="!isEditing" />
                  <label for="editPassword" class="form-label me-3">비밀번호 수정</label>
                </div>
                <input type="password" :readonly="!isEditing || !isPasswordEditing" class="form-control" id="password"
                  v-model="passwordFieldValue" :placeholder="isEditing && isPasswordEditing ? '새 비밀번호를 입력하세요' : ''"
                  @focus="isEditing && isPasswordEditing && (passwordFieldValue = '')" />
              </div>

              <!-- 전화번호 -->
              <div class="form-group mb-3">
                <label for="phone" class="form-label">전화번호</label>
                <input type="text" :readonly="!isEditing" class="form-control" id="phone"
                  v-model="store.member.phone" />
              </div>

              <!-- 주소 -->
              <div v-if="isEditing">
                <div class="form-group mb-3">
                  <label for="address" class="form-label"></label>
                  <div v-if="store.member.address" class="mb-2">
                    <strong>현재 주소:</strong> {{ store.member.address }}
                  </div>
                  <RegisterAddress @load="setAddressData" :initial-address="store.member.address" />
                </div>

                <!-- 선택 정보 (토글 시 표시) -->

                <!-- 주차 가능 -->
                <div class="form-group mb-3">
                  <label for="park" class="form-label">주차 가능 여부</label>
                  <input type="checkbox" class="form-check-input" id="park" v-model="store.member.park" />
                </div>

                <!-- 승강기 개수 -->
                <div class="form-group mb-3">
                  <label for="elevator" class="form-label">승강기 개수</label>
                  <input type="number" class="form-control" id="elevator" v-model="store.member.buildingElevatorNum" />
                </div>

                <!-- 층수 -->
                <div class="form-group mb-3">
                  <label for="floor" class="form-label">층수</label>
                  <input type="number" class="form-control" id="floor" v-model="store.member.floor" />
                </div>

                <!-- 평수 -->
                <div class="form-group mb-3">
                  <label for="area" class="form-label">평수</label>
                  <input type="number" class="form-control" id="area" v-model="store.member.area" />
                </div>

                <!-- 방 개수 -->
                <div class="form-group mb-3">
                  <label for="rooms" class="form-label">방 개수</label>
                  <input type="number" class="form-control" id="rooms" v-model="store.member.rooms" />
                </div>

                <!-- 화장실 개수 -->
                <div class="form-group mb-3">
                  <label for="bathrooms" class="form-label">화장실 개수</label>
                  <input type="number" class="form-control" id="bathrooms" v-model="store.member.bathrooms" />
                </div>
              </div>

              <!-- 수정 및 저장 버튼 -->
              <div class="d-flex justify-content-end">
                <button v-if="isEditing" type="button" class="btn btn-success me-2" @click="updateMember">
                  저장
                </button>
                <button type="button" class="btn btn-primary" @click="toggleEdit">
                  {{ isEditing ? "취소" : "수정" }}
                </button>
              </div>
            </form>

            <!-- 회원 탈퇴 버튼 -->
            <button type="button" class="btn btn-danger w-100 mt-4" @click="deleteMember">
              회원 탈퇴
            </button>
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

.btn-danger {
  background-color: #dc3545;
}

/* 비밀번호 필드 복사 및 드래그 금지 */
#password {
  user-select: none;
}
</style>
