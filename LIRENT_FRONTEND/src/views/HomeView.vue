<script setup>
import { onMounted, onUpdated, reactive, ref, watch } from "vue";
import { subleaseAxios } from "@/util/http-commons";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
import KakaoMap from "@/util/KakaoMap";

// 통신
const subleaseHttp = subleaseAxios();

// 라우터 관련
const route = useRoute();
const router = useRouter();

// 변수들
const mapInstance = ref();

// 매물 관련 변수
const subleaseList = ref();
const currentSublease = ref();

// 매물 관련 변수 초기화
subleaseHttp.get("").then(({ data }) => {
  subleaseList.value = data;

  data.forEach((sublease) => {
    if (sublease.subleaseId == route.params.subleaseId) {
      currentSublease.value = sublease;
    }
  });
});

onMounted(async () => {
  // 카카오 맵 생성
  mapInstance.value = new KakaoMap(
    document.getElementById("map"),
    "37.413294",
    "127.269311"
  );

  // 카카오 맵 로드되기까지 대기
  await mapInstance.value.waitForMap();

  // 지도 위치 이동
  if (currentSublease.value) {
    mapInstance.value.setCenter({
      latitude: currentSublease.value.latitude,
      longitude: currentSublease.value.longitude,
    });
  } else {
    getCurrentCoord().then((data) => {
      mapInstance.value.setCenter({
        latitude: data.latitude,
        longitude: data.longitude,
      });
    });
  }

  // CustomOverlay 표시
  initOverlay();
});

// 선택된 매물이 변경될 경우 현재 매물값 변경
onBeforeRouteUpdate((to, from) => {
  subleaseHttp.get(`${to.params.subleaseId}`).then(({ data }) => {
    currentSublease.value = data;
  });
});

// 현재 매물이 변하면 지도 오버레이 컬러 변경
watch(currentSublease, setOverlaiesColor);

function initOverlay() {
  for (const sublease of subleaseList.value) {
    // init Overlay
    const adjustedPrice = sublease.price / 10000;
    const content = document.createElement("div");
    content.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      color: black;
      font-size: 14px;
      font-weight: bold;
      border: 2px solid black;
      border-radius: 10px;
      padding: 5px;
      text-align: center;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);`;

    if (route.params.subleaseId == sublease.subleaseId) {
      content.className = "text-bg-info";
    } else {
      content.className = "text-bg-light";
    }
    content.innerText = `${adjustedPrice}만원 / 하루`;
    content.addEventListener("click", () =>
      router.push({
        name: "detail",
        params: { subleaseId: parseInt(sublease.subleaseId) },
      })
    );

    mapInstance.value.setOverlay(
      sublease.subleaseId,
      {
        latitude: sublease.latitude,
        longitude: sublease.longitude,
      },
      content
    );
  }
}

function getCurrentCoord() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const coord = pos.coords;
        resolve({ latitude: coord.latitude, longitude: coord.longitude });
      });
    }
  });
}

function setOverlaiesColor() {
  for (const overlayInfo of mapInstance.value.customOverlaies) {
    const targetOverlay = overlayInfo.overlay;
    const content = targetOverlay.getContent();

    if (overlayInfo.id == currentSublease.value.subleaseId) {
      content.className = "text-bg-info";
    } else {
      content.className = "text-bg-light";
    }

    targetOverlay.setContent(content);
  }
}
</script>

<template>
  <div id="map">
    <RouterView v-if="currentSublease" :current-sublease="currentSublease" />
  </div>
</template>

<style scoped>
#map {
  width: 100%;
  height: 100vh; /* 화면 전체 높이 */
  position: absolute; /* 지도 절대 위치 */
  top: 0; /* 상단부터 시작 */
  left: 0; /* 왼쪽부터 시작 */
  z-index: 1; /* 네브바보다 뒤에 위치 */
}
</style>
