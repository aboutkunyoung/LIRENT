<script setup>
import axios from "axios";
import { ref, onMounted, reactive } from "vue";

const emit = defineEmits(["load"]);

//
const isOpen = ref(false);

// 부모로 반환할 데이터
const addressInfo = reactive({
  address: "",
  latitude: undefined,
  longitude: undefined,
});

function loadAddressAPI() {
  return new Promise((resolve, reject) => {
    if (window.daum) {
      resolve(); // 이미 로드된 경우
    } else {
      const script = document.createElement("script");
      script.onload = () => resolve(); // 로드 후 resolve 호출
      script.onerror = reject; // 로드 실패 시 reject 호출
      script.src =
        "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
      document.head.appendChild(script);
    }
  });
}

onMounted(async () => {
  // DAUM 주소 API 불러오기
  await loadAddressAPI();
  loadAddressSearchBox();
});

function loadAddressSearchBox() {
  const searchBoxElement = document.getElementById("daum-address");
  new daum.Postcode({
    width: "100%",
    height: "100%",
    oncomplete: afterAddressSelected,
  }).embed(searchBoxElement);
}

function afterAddressSelected(data) {
  // 검색창 닫기
  isOpen.value = false;

  // 새 검색창 로드
  loadAddressSearchBox();

  // 데이터 처리
  addressInfo.address = `${data.address} ${data.buildingName}`;

  getCoord(addressInfo.address).then(({ latitude, longitude }) => {
    addressInfo.latitude = latitude;
    addressInfo.longitude = longitude;

    emit("load", addressInfo);
  });
}

function getCoord(address) {
  return new Promise((resolve, reject) => {
    axios
      .get("https://dapi.kakao.com/v2/local/search/address.json", {
        headers: { Authorization: `KakaoAK 64f2024741361258ed2a7d642dceac34` },
        params: {
          analyze_type: "exact",
          query: address,
        },
      })
      .then(({ data }) => {
        const result = data.documents[0];
        resolve({ latitude: result.y, longitude: result.x });
      });
  });
}

/*

  "email": "string",
  "password": "string",
  "phone": "string",
  "address": "string",
  "nickname": "string",
  "park": true,
  "buildingElevatorNum": 0,
  "floor": 0,
  "area": 0,
  "rooms": 0,
  "bathrooms": 0,
  "latitude": "string",
  "longitude": "string"
 */
</script>
<template>
  <div class="col-12">
    <label for="address" class="form-label">주소</label>
    <p v-show="addressInfo.address" class="lead text-center">
      {{ addressInfo.address }}
    </p>
    <button
      class="btn btn-outline-secondary w-100"
      @click.prevent="isOpen = !isOpen"
    >
      주소 찾기
    </button>
    <div
      v-show="isOpen"
      class="w-100 p-2 p"
      style="height: 300px"
      id="daum-address"
    ></div>
  </div>
</template>

<style scoped></style>
