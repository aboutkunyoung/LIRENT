<script setup>
import { noticeAxios } from "@/util/http-commons";
import { ref, onMounted, computed } from "vue";
import { Modal } from "bootstrap";
import { useMemberStore } from "@/stores/member";

const memberStore = useMemberStore();
const noticeHttp = noticeAxios();
const isEditMode = ref(false);

const list = ref([]);
const currentQna = ref({ title: "", context: "", category: "", nickname: "" });
const member = memberStore.member;

let writeModal;
let detailModal;

// 사용자가 로그인 상태인지 확인
const isLoggedIn = computed(() => !!memberStore.accessToken);

// 본인 작성 글 여부 확인
const isMyPost = computed(() => {
  return (
    isLoggedIn.value && currentQna.value.memberId === memberStore.member.id
  );
});

// 공지사항 목록 로드
onMounted(() => {
  loadQnaList();
  writeModal = new Modal("#writeModal", {
    backdrop: true,
    focus: true,
    keyboard: true,
  });
  detailModal = new Modal("#detailModal", {
    backdrop: true,
    focus: true,
    keyboard: true,
  });
});

// 공지사항 목록 가져오기
function loadQnaList() {
  noticeHttp.get("").then(({ data }) => {
    list.value = data;
  });
}

// 글쓰기 모드
function writeQna() {
  currentQna.value = { title: "", context: "", category: "" }; // 초기화
  writeModal.show();
}

// 공지사항 작성
function createQna() {
  if (
    !currentQna.value.title ||
    !currentQna.value.context ||
    !currentQna.value.category
  ) {
    alert("제목, 내용, 카테고리를 모두 입력해주세요.");
    return;
  }
  noticeHttp
    .post("", {
      title: currentQna.value.title,
      context: currentQna.value.context,
      category: currentQna.value.category,
      memberId: member.id,
      nickname: member.nickname,
    })
    .then((res) => {
      if (res.status === 201) {
        alert("게시글 작성되었습니다.");
        writeModal.hide();
        loadQnaList();
      }
    })
    .catch((err) => {
      console.error("게시글 작성 실패:", err);
      alert("게시글 작성에 실패했습니다.");
    });
}

// 공지사항 상세보기 (제목 클릭 시 호출)
function openDetail(id) {
  noticeHttp
    .get(`/${id}`)
    .then(({ data }) => {
      currentQna.value = data; // API에서 받은 데이터를 currentQna에 저장
      detailModal.show(); // 상세보기 모달 띄우기
    })
    .catch((err) => {
      console.error("게시글 상세 조회 실패:", err);
      alert("게시글 상세 조회에 실패했습니다.");
    });
}

// 날짜 포맷팅
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
// 공지사항 삭제
function deleteQna() {
  if (confirm("정말로 삭제하시겠습니까?")) {
    noticeHttp
      .delete(`/${currentQna.value.boardId}`)
      .then(() => {
        alert("게시글이 삭제되었습니다.");
        detailModal.hide(); // 상세보기 모달 닫기
        loadQnaList(); // 목록 갱신
      })
      .catch((err) => {
        console.error("게시글 삭제 실패:", err);
        alert("게시글 삭제에 실패했습니다.");
      });
  }
}
// 수정 모드 활성화
function enableEditMode() {
  isEditMode.value = true;
}

function cancelEditMode() {
  isEditMode.value = false; // 수정 모드 비활성화
  openDetail(currentQna.value.boardId); // 원래 데이터를 다시 로드
}
// 공지사항 수정
function updateQna() {
  if (
    !currentQna.value.title ||
    !currentQna.value.context ||
    !currentQna.value.category
  ) {
    alert("제목, 내용, 카테고리를 모두 입력해주세요.");
    return;
  }

  noticeHttp
    .put(`/${currentQna.value.boardId}`, {
      title: currentQna.value.title,
      context: currentQna.value.context,
      category: currentQna.value.category,
    })
    .then(() => {
      alert("게시글이 수정되었습니다.");
      isEditMode.value = false; // 수정 모드 비활성화
      loadQnaList(); // 목록 갱신
    })
    .catch((err) => {
      console.error("게시글 수정 실패:", err);
      alert("게시글 수정에 실패했습니다.");
    });
}
</script>

<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-10 col-lg-8">
        <div class="card shadow-lg border-0">
          <div class="card-body">
            <div class="container mt-5">
              <h2 class="text-center mb-4">📋 게시판</h2>

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
                      <th style="border: 2px solid black; width: 15%">
                        카테고리
                      </th>
                      <th style="border: 2px solid black; width: 50%">제목</th>
                      <th style="border: 2px solid black; width: 20%">
                        작성자
                      </th>
                      <th style="border: 2px solid black; width: 15%">
                        작성일
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(qna, index) in list"
                      :key="qna.boardId"
                      class="text-center"
                      style="border: 2px solid black"
                    >
                      <td style="border: 2px solid black">
                        <span class="badge bg-primary">{{ qna.category }}</span>
                      </td>
                      <td style="border: 2px solid black">
                        <a
                          href="#"
                          @click.prevent="openDetail(qna.boardId)"
                          class="text-decoration-none"
                        >
                          <strong>{{ qna.title }}</strong>
                        </a>
                      </td>
                      <td style="border: 2px solid black">
                        {{ qna.nickname }}
                      </td>
                      <td style="border: 2px solid black">
                        {{ formatDate(qna.createdDate) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- 글쓰기 버튼 -->
              <div class="d-flex justify-content-end mt-3">
                <button class="btn btn-success px-4 py-2" @click="writeQna">
                  ✍ 글쓰기
                </button>
              </div>

              <!-- 글쓰기 모달 -->
              <div
                class="modal fade"
                id="writeModal"
                tabindex="-1"
                aria-labelledby="writeModalLabel"
                aria-hidden="true"
              >
                <div
                  class="modal-dialog modal-dialog-centered modal-dialog-scrollable"
                >
                  <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                      <h1 class="modal-title fs-5" id="writeModalLabel">
                        게시글 작성
                      </h1>
                      <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div class="modal-body">
                      <div class="mb-3">
                        <label for="title" class="form-label">제목</label>
                        <input
                          type="text"
                          class="form-control"
                          id="title"
                          v-model="currentQna.title"
                          placeholder="제목을 입력하세요"
                        />
                      </div>
                      <div class="mb-3">
                        <label for="category" class="form-label"
                          >카테고리</label
                        >
                        <select
                          class="form-select"
                          id="category"
                          v-model="currentQna.category"
                          required
                        >
                          <option value="" disabled>
                            카테고리를 선택하세요
                          </option>
                          <option value="[공지]">[공지]</option>
                          <option value="[잡담]">[잡담]</option>
                          <option value="[질문]">[질문]</option>
                        </select>
                      </div>
                      <div class="mb-3">
                        <label for="content" class="form-label">내용</label>
                        <textarea
                          class="form-control"
                          id="content"
                          rows="5"
                          v-model="currentQna.context"
                          placeholder="내용을 입력하세요"
                        ></textarea>
                      </div>
                    </div>
                    <div class="modal-footer">
                      <button
                        type="button"
                        class="btn btn-success px-4 py-2"
                        @click="createQna"
                      >
                        작성 완료
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 공지사항 상세보기 모달 -->
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
                        <div v-if="isEditMode">
                          <input
                            type="text"
                            class="form-control"
                            v-model="currentQna.title"
                          />
                        </div>
                        <div v-else>{{ currentQna.title }}</div>
                      </h1>
                      <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div class="modal-body">
                      <p><strong>카테고리:</strong></p>
                      <div v-if="isEditMode">
                        <select
                          class="form-select"
                          v-model="currentQna.category"
                        >
                          <option value="[공지]">[공지]</option>
                          <option value="[잡담]">[잡담]</option>
                          <option value="[질문]">[질문]</option>
                        </select>
                      </div>
                      <p v-else>
                        <span class="badge bg-info text-dark">{{
                          currentQna.category
                        }}</span>
                      </p>

                      <p><strong>작성자:</strong> {{ currentQna.nickname }}</p>
                      <p><strong>내용:</strong></p>
                      <div v-if="isEditMode">
                        <textarea
                          class="form-control"
                          rows="5"
                          v-model="currentQna.context"
                        ></textarea>
                      </div>
                      <p v-else>{{ currentQna.context }}</p>
                    </div>
                    <div class="modal-footer">
                      <button
                        v-if="isMyPost && !isEditMode"
                        class="btn btn-warning px-4 py-2"
                        @click="enableEditMode"
                      >
                        ✏ 수정
                      </button>
                      <button
                        v-if="isMyPost && isEditMode"
                        class="btn btn-success px-4 py-2"
                        @click="updateQna"
                      >
                        저장
                      </button>
                      <button
                        v-if="isMyPost && isEditMode"
                        class="btn btn-secondary px-4 py-2"
                        @click="cancelEditMode"
                      >
                        취소
                      </button>
                      <button
                        v-if="isMyPost && !isEditMode"
                        class="btn btn-danger px-4 py-2"
                        @click="deleteQna"
                      >
                        🗑 삭제
                      </button>
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
