<script setup>
import { computed, onBeforeMount, reactive, ref, watch } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { basketAxios, subleaseDealAxios } from "@/util/http-commons";
import { createRouterMatcher, useRouter } from "vue-router";
import { useMemberStore } from "@/stores/member";

const router = useRouter();
const dealHttp = subleaseDealAxios();
const basketHttp = basketAxios();

const store = useMemberStore();

const props = defineProps({
  sublease: Object,
});

// 현재 매물이 즐겨찾기 됐는지
const isBasketed = ref();

// 현재 매물의 계약들 관련 데이터
const deals = ref();

// 선택된 계약 기간 변수
const rentPeriod = ref();

// 기간 계산용 computed
const dayDifference = computed(() => {
  if (rentPeriod.value) {
    const startDate = rentPeriod.value[0];
    const endDate = rentPeriod.value[1]
      ? rentPeriod.value[1]
      : rentPeriod.value[0];

    const diffTime = endDate.getTime() - startDate.getTime(); // 밀리초 단위 차이 계산
    const diffDays = diffTime / (1000 * 60 * 60 * 24); // 일 단위로 변환
    return diffDays + 1;
  } else {
    return 0;
  }
});

// 비활성화할 날짜 계산용 computed
const disabledDates = computed(() => {
  const dates = [];
  if (deals.value) {
    for (const deal of deals.value) {
      console.log(deal);

      if (deal.accepted) {
        const startDate = new Date(deal.startDate);
        const endDate = new Date(deal.endDate);

        while (startDate <= endDate) {
          dates.push(new Date(startDate));
          // 하루 증가
          startDate.setDate(startDate.getDate() + 1);
        }
      }
    }
  }
  return dates;
});

// sublease 변경시 수행
watch(
  () => props.sublease,
  (newVal, oldVal) => {
    // 계약정보 로드
    dealHttp.get(`/${newVal.subleaseId}`).then(({ data }) => {
      deals.value = data;
    });

    // 즐겨찾기 정보 로드
    basketHttp.get("").then(({ data }) => {
      for (const element of data) {
        if (element.subleaseId == props.sublease.subleaseId) {
          isBasketed.value = true;
          return;
        }
      }

      isBasketed.value = false;
      return;
    });
  },
  { immediate: true }
);

function offerDeal() {
  dealHttp
    .post("", {
      subleaseId: props.sublease.subleaseId,
      startDate: rentPeriod.value[0],
      endDate: rentPeriod.value[1] ? rentPeriod.value[1] : rentPeriod.value[0],
      deposit: props.sublease.deposit,
      totalPrice: props.sublease.price * dayDifference.value,
    })
    .then(() => {
      alert("예약 성공");
      router.push({ name: "mydeal" });
    })
    .catch(() => {
      alert("로그인이 필요합니다.");
    });
}

function handleAddBasket() {
  basketHttp
    .post("", {
      memberId: store.member.id,
      subleaseId: props.sublease.subleaseId,
    })
    .then(() => {
      isBasketed.value = true;
    });
}

function handleDeleteBasket() {
  basketHttp.delete(`/${props.sublease.subleaseId}`).then(() => {
    isBasketed.value = false;
  });
}
</script>

<template>
  <!-- Fixed Info Card -->
  <div class="card fixed-card">
    <div class="custom-card-header">
      <h5 class="fw-bold">{{ props.sublease.address }}</h5>
      <div class="d-flex align-items-center justify-content-between">
        <div v-show="store.member" class="d-flex align-items-center p-0">
          <span>즐겨찾기</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            width="22.5"
            viewBox="0 0 576 512"
            v-show="!isBasketed"
            @click.prevent="handleAddBasket()"
          >
            <path
              d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            width="22.5"
            viewBox="0 0 576 512"
            v-show="isBasketed"
            @click.prevent="handleDeleteBasket()"
          >
            <path
              fill="#FFD43B"
              d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
            />
          </svg>
        </div>

        <p
          v-if="props.sublease.memberId == store.member.id"
          class="text-danger fw-medium m-0"
        >
          *내 매물
        </p>
      </div>
    </div>
    <div class="card-body overflow-auto">
      <!-- 상단 강조 정보 -->
      <div class="mb-4 text-center">
        <h3 class="fw-bold text-primary mb-2">{{ props.sublease.area }}m²</h3>
      </div>

      <!-- 상세 정보 -->
      <div class="row text-center g-3 mb-3">
        <div class="col-6 col-md-4">
          <div class="bg-light rounded p-3">
            <strong>방</strong>
            <p class="mb-0">{{ props.sublease.rooms }}개</p>
          </div>
        </div>
        <div class="col-6 col-md-4">
          <div class="bg-light rounded p-3">
            <strong>욕실</strong>
            <p class="mb-0">{{ props.sublease.bathrooms }}개</p>
          </div>
        </div>
        <div class="col-6 col-md-4">
          <div class="bg-light rounded p-3">
            <strong>층수</strong>
            <p class="mb-0">{{ props.sublease.floor }}층</p>
          </div>
        </div>
        <div class="col-6 col-md-6">
          <div class="bg-light rounded p-3">
            <strong>보증금</strong>
            <p class="mb-0">
              {{ (props.sublease.deposit / 10000).toLocaleString() }}만원
            </p>
          </div>
        </div>
        <div class="col-6 col-md-6">
          <div class="bg-light rounded p-3">
            <strong>1일 당 비용</strong>
            <p class="mb-0">
              {{ (props.sublease.price / 10000).toLocaleString() }}만원
            </p>
          </div>
        </div>
      </div>
      <!-- 날짜 선택 -->
      <div class="bg-light p-3 rounded">
        <h6 class="fw-bold mb-3 text-center">날짜 선택</h6>
        <VueDatePicker
          class="justify-content-center"
          v-model="rentPeriod"
          inline
          locale="ko"
          :enable-time-picker="false"
          prevent-min-max-navigation
          :range="{ noDisabledRange: true }"
          :min-date="props.sublease.startDate"
          :max-date="props.sublease.endDate"
          :disabled-dates="disabledDates"
        />
      </div>
      <hr />
      <!-- 총비용 -->
      <template v-if="rentPeriod">
        <p><strong>전대 기간</strong>: {{ dayDifference }}일</p>
        <p>
          <strong>총 비용</strong>:
          <span class="highlight"
            >{{ props.sublease.price / 10000 }}만원 * {{ dayDifference }}일 =
            {{ (props.sublease.price * dayDifference) / 10000 }}만원</span
          >
        </p>

        <div class="d-grid gap-2 mb-3">
          <button class="btn btn-primary" @click.prevent="offerDeal">
            예약하기
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.fixed-card {
  position: fixed;
  top: 8%;
  left: 20px;
  max-width: 600px;
  max-height: 90%;
  z-index: 1000;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden; /* 카드가 넘치지 않도록 설정 */
}

.card-body {
  overflow-y: auto; /* 카드 내용 스크롤 허용 */
  max-height: calc(90vh - 56px); /* 헤더를 제외한 최대 높이 */
}

.custom-card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  text-align: center;
  padding: 15px;
  border-radius: 8px 8px 0 0;
}
</style>
