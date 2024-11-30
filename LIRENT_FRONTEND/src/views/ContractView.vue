<script setup>
import { ref, computed } from "vue";
import axios from "axios";
import { useMemberStore } from "@/stores/member";

const { VITE_CONTRACT_API_URL } = import.meta.env;

// Member store instance to access token
const memberStore = useMemberStore();
const accessToken = computed(() => memberStore.accessToken);
const today = new Date();

// 계약 데이터로 넘어온 값
const props = defineProps({
  info: String,
});

console.log(props.info);

// 역할 관리
const role = ref(""); // "전대인" 또는 "전차인" 저장

const formData = ref({
  Address: "",
  subleaseDeposit: "",
  subleaseCost: "",
  contractYear: today.getFullYear().toString(),
  contractMonth: (today.getMonth() + 1).toString(),
  contractDay: today.getDate().toString(),
  startYear: "",
  startMonth: "",
  startDay: "",
  endYear: "",
  endMonth: "",
  endDay: "",
  fromNum: "",
  fromPN: "",
  fromName: "",
  toNum: "",
  toPN: "",
  toName: "",
});

if (props.info) {
  formData.value.Address = props.info.address;
  formData.value.subleaseDeposit = props.info.deposit;
  formData.value.subleaseCost = props.info.totalPrice;

  const splitedStartDate = props.info.startDate.split("-");
  formData.value.startYear = splitedStartDate[0];
  formData.value.startMonth = splitedStartDate[1];
  formData.value.startDay = splitedStartDate[2];

  const splitedEndDate = props.info.endDate.split("-");
  formData.value.endYear = splitedEndDate[0];
  formData.value.endMonth = splitedEndDate[1];
  formData.value.endDay = splitedEndDate[2];

  formData.value.fromPN = props.info.sublessor.phone;
  formData.value.fromName = props.info.sublessor.name;

  formData.value.toPN = props.info.subleasee.phone;
  formData.value.toName = props.info.subleasee.name;
}

const formLabels = {
  Address: "주소",
  subleaseDeposit: "보증금",
  subleaseCost: "월세",
  contractYear: "계약 연도",
  contractMonth: "계약 월",
  contractDay: "계약 일",
  startYear: "시작 연도",
  startMonth: "시작 월",
  startDay: "시작 일",
  endYear: "종료 연도",
  endMonth: "종료 월",
  endDay: "종료 일",
  fromNum: "임대인 번호",
  fromPN: "임대인 연락처",
  fromName: "임대인 이름",
  toNum: "임차인 번호",
  toPN: "임차인 연락처",
  toName: "임차인 이름",
};

const generatedFilePath = ref("");
const isLoading = ref(false);

// 계약서 생성
const submitForm = async () => {
  isLoading.value = true;

  try {
    const response = await axios.post(
      `${VITE_CONTRACT_API_URL}/generate`,
      formData.value,
      {
        headers: {
          Authorization: `Bearer ${accessToken.value}`, // Include JWT token in headers
        },
      }
    );
    generatedFilePath.value = response.data;
    alert("계약서가 성공적으로 생성되었습니다!");
  } catch (error) {
    console.error("계약서 생성 실패:", error);
    alert("계약서 생성 중 오류가 발생했습니다.");
  } finally {
    isLoading.value = false;
  }
};

// 파일 다운로드
const downloadFile = async () => {
  if (!generatedFilePath.value) {
    alert("다운로드할 파일이 없습니다. 계약서를 먼저 생성하세요.");
    return;
  }

  try {
    const response = await axios.get(`${VITE_CONTRACT_API_URL}/download`, {
      params: {
        filePath: generatedFilePath.value, // 파일 경로 전달
      },
      headers: {
        Authorization: `Bearer ${accessToken.value}`, // JWT 인증 헤더 포함
      },
      responseType: "blob", // 바이너리 데이터로 응답받기
    });

    // 다운로드 처리
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;

    // 서버에서 받은 파일 이름 설정
    const fileName = generatedFilePath.value.split("/").pop();
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert("파일이 성공적으로 다운로드되었습니다!");
  } catch (error) {
    console.error("다운로드 실패:", error);
    alert("파일 다운로드 중 오류가 발생했습니다.");
  }
};
</script>

<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-10 col-lg-8">
        <div class="card shadow-lg border-0">
          <div class="card-body">
            <div class="container mt-4">
              <h2 style="text-align: center">🖊️계약서 생성기</h2>

              <!-- 입력 폼 -->
              <form @submit.prevent="submitForm" class="mt-4">
                <div class="table-responsive">
                  <table
                    class="table table-bordered table-hover align-middle"
                    style="border: 2px solid black"
                  >
                    <tbody>
                      <tr v-for="(value, key) in formData" :key="key">
                        <th
                          style="
                            width: 30%;
                            border: 2px solid black;
                            background-color: #f8f9fa;
                          "
                        >
                          {{ formLabels[key] || key }}
                        </th>
                        <td style="border: 2px solid black">
                          <input
                            type="text"
                            :id="key"
                            class="form-control"
                            v-model="formData[key]"
                            :placeholder="`Enter ${key}`"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="d-flex justify-content-end mt-3">
                  <button
                    type="submit"
                    class="btn btn-success px-4 py-2"
                    :disabled="isLoading"
                  >
                    {{ isLoading ? "생성 중..." : "계약서 생성" }}
                  </button>
                </div>
              </form>

              <!-- 결과 -->
              <div v-if="generatedFilePath" class="mt-4">
                <h4>계약서 생성 결과</h4>
                <p>{{ generatedFilePath }}</p>
                <a
                  v-if="generatedFilePath"
                  @click.prevent="downloadFile"
                  class="btn btn-success"
                  target="_blank"
                  >다운로드</a
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
h2 {
  text-align: center;
}

.table {
  border-collapse: separate;
  border-spacing: 0;
}

.table th,
.table td {
  vertical-align: middle;
}

.table th {
  background-color: #f8f9fa;
}

.table-hover tbody tr:hover {
  background-color: #f1f1f1;
}

.btn-success {
  background-color: #28a745;
  border: none;
}
</style>
