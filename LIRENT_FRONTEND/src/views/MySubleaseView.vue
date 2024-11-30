<script setup>
import { reactive, ref, watch } from "vue";
import { useMemberStore } from "@/stores/member";
import { subleaseAxios, subleaseDealAxios } from "@/util/http-commons";
import Chat from "@/components/common/Chat.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const store = useMemberStore();

const subleaseHttp = subleaseAxios();
const dealHttp = subleaseDealAxios();

// 현재 내 매물
const sublease = ref(null);
getSublease();

const deals = ref();

watch(sublease, () => {
  if (sublease.value) {
    dealHttp.get(`/${sublease.value.subleaseId}`).then(({ data }) => {
      deals.value = data;
    });
  }
});

function handleAccept(deal) {
  dealHttp
    .post("/accept", deal.dealId)
    .then(() => {
      deal.accepted = true;
    })
    .catch(() => {
      alert("오류가 발생했습니다.");
    });
}

function handleDeleteSublease() {
  subleaseHttp.delete("").then(() => {
    sublease.value = null;
  });
}

function getSublease() {
  subleaseHttp.get("").then(({ data }) => {
    for (const element of data) {
      if (element.memberId == store.member.id) {
        sublease.value = element;
      }
    }
  });
}

// 매물 등록
const period = ref();
const fee = reactive({
  deposit: null,
  price: null,
});

function handleSubmit() {
  subleaseHttp
    .post("", {
      startDate: period.value[0],
      endDate: period.value[1],
      deposit: fee.deposit,
      price: fee.price,
    })
    .then(getSublease)
    .catch(() => {
      alert("매물 등록에 실패했습니다.");
    });
}
</script>

<template>
  <div class="container">
    <form class="container py-5">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-10">
          <div class="card shadow-lg border-0">
            <div class="card-body p-5">
              <h1 class="text-center mb-4">내 매물 관리</h1>
              <!-- 내 매물이 등록된 상태일 경우 -->
              <template v-if="sublease">
                <!-- 회원 정보 -->
                <h4 class="border-bottom pb-2 mb-3">계약 리스트</h4>
                <div class="row g-3">
                  <table class="table table-hover table-bordered">
                    <thead class="table-secondary text-center">
                      <tr>
                        <th scope="col">이름</th>
                        <th scope="col">전화번호</th>
                        <th scope="col">시작일</th>
                        <th scope="col">종료일</th>
                        <th scope="col">보증금</th>
                        <th scope="col">총 금액</th>
                        <th scope="col">수락 여부</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="deal of deals">
                        <td>{{ deal.contractorName }}</td>
                        <td>{{ deal.contractorPhone }}</td>
                        <td>{{ deal.startDate }}</td>
                        <td>{{ deal.endDate }}</td>
                        <td class="text-end">{{ deal.deposit / 10000 }}만원</td>
                        <td class="text-end">
                          {{ deal.totalPrice / 10000 }}만원
                        </td>
                        <td v-if="deal.accepted" class="text-center">
                          <RouterLink
                            class="btn btn-sm btn-secondary"
                            :to="{
                              name: 'contract',
                              query: {
                                info: encodeURIComponent(
                                  JSON.stringify({
                                    address: sublease.address,
                                    deposit: deal.deposit,
                                    totalPrice: deal.totalPrice,
                                    startDate: deal.startDate,
                                    endDate: deal.endDate,
                                    subleasee: {
                                      phone: deal.contractorPhone,
                                      name: deal.contractorName,
                                    },
                                    sublessor: {
                                      phone: store.member.phone,
                                      name: store.member.nickname,
                                    },
                                  })
                                ),
                              },
                            }"
                            >계약서 생성</RouterLink
                          >
                        </td>
                        <td v-else class="text-center">
                          <button
                            class="btn btn-primary btn-sm"
                            @click.prevent="handleAccept(deal)"
                          >
                            수락하기
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- 채팅 -->
                <Chat
                  :sublease-id="sublease.subleaseId"
                  :owner-id="sublease.memberId"
                />
                <hr />
                <button
                  class="btn btn-danger w-100"
                  @click.prevent="handleDeleteSublease"
                >
                  매물 삭제하기
                </button>
              </template>
              <template v-else>
                <h4 class="border-bottom pb-2 mb-3">내 집 정보</h4>
                <div class="row pb-3">
                  <div class="col-6">
                    <VueDatePicker
                      class="justify-content-center"
                      v-model="period"
                      inline
                      locale="ko"
                      :range="{ noDisabledRange: true }"
                      :enable-time-picker="false"
                      prevent-min-max-navigation
                      :min-date="new Date()"
                    />
                    <p class="text-center">
                      기간:
                      <span v-if="period">
                        {{
                          period[0].getFullYear() +
                          "-" +
                          period[0].getMonth() +
                          "-" +
                          period[0].getDate()
                        }}
                        ~
                        {{
                          period[1].getFullYear() +
                          "-" +
                          period[1].getMonth() +
                          "-" +
                          period[1].getDate()
                        }}
                      </span>
                    </p>
                  </div>

                  <div class="col-6">
                    <ul class="list-group list-group-flush text-center">
                      <li class="list-group-item">
                        <strong>주소:</strong> {{ store.member.address }}
                      </li>
                      <li class="list-group-item">
                        <strong>주차 가능 여부:</strong>
                        <span v-if="store.member.park"> 가능</span>
                        <span v-else> 불가능</span>
                      </li>
                      <li class="list-group-item">
                        <strong>승강기 개수:</strong>
                        {{ store.member.buildingElevatorNum }} 개
                      </li>
                      <li class="list-group-item">
                        <strong>층수:</strong> {{ store.member.floor }} 층
                      </li>
                      <li class="list-group-item">
                        <strong>평수:</strong> {{ store.member.area }} 평
                      </li>
                      <li class="list-group-item">
                        <strong>방 개수:</strong> {{ store.member.rooms }} 개
                      </li>
                      <li class="list-group-item">
                        <strong>화장실 개수:</strong>
                        {{ store.member.bathrooms }} 개
                      </li>
                    </ul>

                    <div class="input-group">
                      <span class="input-group-text">보증금</span>
                      <input
                        type="text"
                        class="form-control"
                        placeholder="보증금"
                        aria-label="deposit"
                        v-model="fee.deposit"
                      />
                      <span class="input-group-text">하루요금</span>
                      <input
                        type="text"
                        class="form-control"
                        placeholder="요금"
                        aria-label="price"
                        v-model="fee.price"
                      />
                    </div>
                  </div>
                </div>
                <button
                  class="btn btn-primary w-100"
                  @click.prevent="handleSubmit"
                >
                  등록하기
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
<style scoped></style>
