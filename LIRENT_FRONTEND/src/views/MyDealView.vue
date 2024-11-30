<script setup>
import { subleaseAxios, subleaseDealAxios } from "@/util/http-commons";
import { reactive } from "vue";

const dealHttp = subleaseDealAxios();
const subleaseHttp = subleaseAxios();

const infos = reactive([]);
dealHttp.get("").then(({ data }) => {
  for (const deal of data) {
    subleaseHttp.get(`/${deal.subleaseId}`).then(({ data }) => {
      const newInfo = {
        dealId: deal.dealId,
        subleaseId: data.subleaseId,
        address: data.address,
        phone: data.phone,
        startDate: deal.startDate,
        endDate: deal.endDate,
        deposit: deal.deposit,
        totalPrice: deal.totalPrice,
        accepted: deal.accepted,
      };
      infos.push(newInfo);
    });
  }
});

function handleCancelReservation(dealId, index) {
  dealHttp
    .delete(`/${dealId}`)
    .then(() => {
      alert("삭제 성공");
      infos.splice(index, 1);
    })
    .catch(() => alert("삭제 실패"));
}
</script>

<template>
  <div class="container">
    <form class="container py-5">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-10">
          <div class="card shadow-lg border-0">
            <div class="card-body p-5">
              <h1 class="text-center mb-4">내 예약 관리</h1>
              <h4 class="border-bottom pb-2 mb-3">내 집 정보</h4>
              <div class="input-group">
                <table class="table table-hover table-bordered">
                  <thead class="table-secondary text-center">
                    <tr>
                      <th scope="col">주소</th>
                      <th scope="col">전화번호</th>
                      <th scope="col">시작일</th>
                      <th scope="col">종료일</th>
                      <th scope="col">보증금</th>
                      <th scope="col">총 금액</th>
                      <th scope="col">수락 여부</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(info, index) in infos">
                      <td>
                        <RouterLink
                          :to="{
                            name: 'detail',
                            params: { subleaseId: info.subleaseId },
                          }"
                        >
                          {{ info.address }}
                        </RouterLink>
                      </td>
                      <td>{{ info.phone }}</td>
                      <td>{{ info.startDate }}</td>
                      <td>{{ info.endDate }}</td>
                      <td class="text-end">{{ info.deposit / 10000 }}만원</td>
                      <td class="text-end">
                        {{ info.totalPrice / 10000 }}만원
                      </td>
                      <td v-if="info.accepted" class="text-center">확정</td>
                      <td v-else class="text-center">
                        <button
                          class="btn btn-sm btn-warning"
                          @click.prevent="
                            handleCancelReservation(info.dealId, index)
                          "
                        >
                          예약취소
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
