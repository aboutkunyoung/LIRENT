<script setup>
import { ref, onMounted, computed } from "vue";
import { useMemberStore } from "@/stores/member";
import { basketAxios } from "@/util/http-commons";
import { Modal } from "bootstrap";

const memberStore = useMemberStore();
const basketHttp = basketAxios();
const member = memberStore.member;

// 로그인 여부 확인
const isLoggedIn = computed(() => !!memberStore.accessToken);

// 즐겨찾기 목록
const favorites = ref([]);

// 현재 선택된 서브리스 정보
const currentSublease = ref({});

// 선택된 항목들을 저장할 배열
const selectedItems = ref([]);

// 모달 객체
let detailModal;
let compareModal;

// 페이지 로딩 시 즐겨찾기 목록 로드
onMounted(() => {
  if (isLoggedIn.value) {
    loadFavorites();
  } else {
    alert("로그인이 필요합니다.");
    // 로그인 페이지로 리다이렉트하거나 다른 처리
  }

  detailModal = new Modal("#detailModal", {
    backdrop: true,
    focus: true,
    keyboard: true,
  });

  compareModal = new Modal("#compareModal", {
    backdrop: true,
    focus: true,
    keyboard: true,
  });
});

// 즐겨찾기 목록 가져오기
function loadFavorites() {
  basketHttp
    .get("", {
      headers: {
        Authorization: `Bearer ${memberStore.accessToken}`,
      },
    })
    .then(({ data }) => {
      favorites.value = data;
    })
    .catch((err) => {
      console.error("즐겨찾기 목록 로드 실패:", err);
      alert("즐겨찾기 목록을 가져오는 데 실패했습니다.");
    });
}

// 상세보기 모달 열기
function openDetail(subleaseId) {
  const sublease = favorites.value.find(
    (item) => item.subleaseId === subleaseId
  );
  if (sublease) {
    currentSublease.value = sublease;
    detailModal.show();
  }
}

// 비교 모달 열기
function openCompareModal() {
  if (selectedItems.value.length === 2) {
    compareModal.show();
  } else {
    alert("비교할 매물을 두 개 선택해주세요.");
  }
}

// 선택 상태 초기화
function resetSelection() {
  selectedItems.value = [];
}

// 날짜 포맷팅
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 즐겨찾기 삭제
function removeFavorite(subleaseId) {
  if (confirm("정말로 이 항목을 즐겨찾기에서 삭제하시겠습니까?")) {
    basketHttp
      .delete(`/${subleaseId}`, {
        headers: {
          Authorization: `Bearer ${memberStore.accessToken}`,
        },
      })
      .then(() => {
        alert("즐겨찾기에서 삭제되었습니다.");
        // 목록 갱신
        favorites.value = favorites.value.filter(
          (item) => item.subleaseId !== subleaseId
        );
        // 선택된 항목에서 제거
        resetSelection();
      })
      .catch((err) => {
        console.error("즐겨찾기 삭제 실패:", err);
        alert("즐겨찾기 삭제에 실패했습니다.");
      });
  }
}
</script>

<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-10 col-lg-8">
        <div class="card shadow-lg border-0">
          <div class="card-body">
            <div class="container mt-5">
              <h2 class="text-center mb-4">⭐ 내 즐겨찾기</h2>

              <div class="table-responsive">
                <table
                  class="table table-bordered table-hover align-middle"
                  style="border: 2px solid black"
                >
                  <thead
                    class="text-center"
                    style="
                      background-color: #007bff;
                      color: white;
                      font-family: 'Arial', sans-serif;
                      font-weight: bold;
                    "
                  >
                    <tr style="border: 2px solid black">
                      <th style="border: 2px solid black; width: 5%">선택</th>
                      <th style="border: 2px solid black; width: 25%">주소</th>
                      <th style="border: 2px solid black; width: 15%">
                        보증금
                      </th>
                      <th style="border: 2px solid black; width: 15%">가격</th>
                      <th style="border: 2px solid black; width: 20%">
                        시작일
                      </th>
                      <th style="border: 2px solid black; width: 20%">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in favorites"
                      :key="item.subleaseId"
                      class="text-center"
                      style="border: 2px solid black"
                    >
                      <!-- 체크박스 추가 -->
                      <td style="border: 2px solid black">
                        <input
                          type="checkbox"
                          :value="item"
                          v-model="selectedItems"
                          :disabled="
                            selectedItems.length >= 2 &&
                            !selectedItems.includes(item)
                          "
                        />
                      </td>
                      <td style="border: 2px solid black">
                        {{ item.address }}
                      </td>
                      <td style="border: 2px solid black">
                        {{ item.deposit }}
                      </td>
                      <td style="border: 2px solid black">{{ item.price }}</td>
                      <td style="border: 2px solid black">
                        {{ formatDate(item.startDate) }}
                      </td>
                      <td style="border: 2px solid black">
                        <button
                          class="btn btn-primary btn-sm"
                          @click="openDetail(item.subleaseId)"
                        >
                          상세보기
                        </button>
                        <button
                          class="btn btn-danger btn-sm"
                          @click="removeFavorite(item.subleaseId)"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- 비교하기 버튼 -->
              <div class="d-flex justify-content-end mt-3">
                <button
                  class="btn btn-success px-4 py-2"
                  :disabled="selectedItems.length !== 2"
                  @click="openCompareModal"
                >
                  비교하기
                </button>
              </div>

              <!-- 상세보기 모달 -->
              <div
                class="modal fade"
                id="detailModal"
                tabindex="-1"
                aria-labelledby="detailModalLabel"
                aria-hidden="true"
              >
                <div
                  class="modal-dialog modal-dialog-centered modal-dialog-scrollable"
                >
                  <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                      <h1 class="modal-title fs-5" id="detailModalLabel">
                        서브리스 상세 정보
                      </h1>
                      <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div class="modal-body">
                      <p>
                        <strong>주소:</strong> {{ currentSublease.address }}
                      </p>
                      <p>
                        <strong>보증금:</strong> {{ currentSublease.deposit }}
                      </p>
                      <p><strong>가격:</strong> {{ currentSublease.price }}</p>
                      <p>
                        <strong>시작일:</strong>
                        {{ formatDate(currentSublease.startDate) }}
                      </p>
                      <p>
                        <strong>종료일:</strong>
                        {{ formatDate(currentSublease.endDate) }}
                      </p>
                      <p><strong>면적:</strong> {{ currentSublease.area }}㎡</p>
                      <p>
                        <strong>방 개수:</strong> {{ currentSublease.rooms }}
                      </p>
                      <p>
                        <strong>화장실 개수:</strong>
                        {{ currentSublease.bathrooms }}
                      </p>
                      <p><strong>층수:</strong> {{ currentSublease.floor }}</p>
                      <p>
                        <strong>주차 가능:</strong>
                        {{ currentSublease.park ? "예" : "아니오" }}
                      </p>
                      <!-- 추가 정보가 있다면 여기에 표시 -->
                    </div>
                    <div class="modal-footer">
                      <button
                        type="button"
                        class="btn btn-secondary px-4 py-2"
                        data-bs-dismiss="modal"
                      >
                        닫기
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 상세보기 모달 끝 -->

              <!-- 비교 모달 -->
              <div
                class="modal fade"
                id="compareModal"
                tabindex="-1"
                aria-labelledby="compareModalLabel"
                aria-hidden="true"
              >
                <div
                  class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
                >
                  <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                      <h1 class="modal-title fs-5" id="compareModalLabel">
                        서브리스 비교
                      </h1>
                      <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <!-- 조건부 렌더링 적용 -->
                    <div class="modal-body" v-if="selectedItems.length === 2">
                      <table class="table table-bordered">
                        <thead>
                          <tr>
                            <th>항목</th>
                            <th>매물 1</th>
                            <th>매물 2</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>주소</td>
                            <td>{{ selectedItems[0].address }}</td>
                            <td>{{ selectedItems[1].address }}</td>
                          </tr>
                          <tr>
                            <td>보증금</td>
                            <td>{{ selectedItems[0].deposit }}</td>
                            <td>{{ selectedItems[1].deposit }}</td>
                          </tr>
                          <tr>
                            <td>가격</td>
                            <td>{{ selectedItems[0].price }}</td>
                            <td>{{ selectedItems[1].price }}</td>
                          </tr>
                          <tr>
                            <td>시작일</td>
                            <td>
                              {{ formatDate(selectedItems[0].startDate) }}
                            </td>
                            <td>
                              {{ formatDate(selectedItems[1].startDate) }}
                            </td>
                          </tr>
                          <tr>
                            <td>종료일</td>
                            <td>{{ formatDate(selectedItems[0].endDate) }}</td>
                            <td>{{ formatDate(selectedItems[1].endDate) }}</td>
                          </tr>
                          <tr>
                            <td>면적</td>
                            <td>{{ selectedItems[0].area }}㎡</td>
                            <td>{{ selectedItems[1].area }}㎡</td>
                          </tr>
                          <tr>
                            <td>방 개수</td>
                            <td>{{ selectedItems[0].rooms }}</td>
                            <td>{{ selectedItems[1].rooms }}</td>
                          </tr>
                          <tr>
                            <td>화장실 개수</td>
                            <td>{{ selectedItems[0].bathrooms }}</td>
                            <td>{{ selectedItems[1].bathrooms }}</td>
                          </tr>
                          <tr>
                            <td>층수</td>
                            <td>{{ selectedItems[0].floor }}</td>
                            <td>{{ selectedItems[1].floor }}</td>
                          </tr>
                          <tr>
                            <td>주차 가능</td>
                            <td>
                              {{ selectedItems[0].park ? "예" : "아니오" }}
                            </td>
                            <td>
                              {{ selectedItems[1].park ? "예" : "아니오" }}
                            </td>
                          </tr>
                          <!-- 필요한 항목들을 추가로 비교 -->
                        </tbody>
                      </table>
                    </div>
                    <div class="modal-body" v-else>
                      <p>비교할 매물을 두 개 선택해주세요.</p>
                    </div>
                    <div class="modal-footer">
                      <button
                        type="button"
                        class="btn btn-secondary px-4 py-2"
                        data-bs-dismiss="modal"
                        @click="resetSelection"
                      >
                        닫기
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 비교 모달 끝 -->
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
</style>
