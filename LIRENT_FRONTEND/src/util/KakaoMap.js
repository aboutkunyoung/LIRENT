const { VITE_KAKAO_API_KEY } = import.meta.env;

export default class KakaoMap {
  map;
  customOverlaies = [];

  constructor(container, latitude, longitude) {
    this.loadKakaoMapAPI().then(() => {
      console.log("KAKAO MAP LOADED");

      const options = {
        center: new kakao.maps.LatLng(latitude, longitude),
        level: 3,
      };

      this.map = new kakao.maps.Map(container, options);
    });
  }

  loadKakaoMapAPI() {
    return new Promise((resolve, reject) => {
      if (window.kakao && window.kakao.maps) {
        resolve(); // 이미 로드된 경우
      } else {
        const script = document.createElement("script");
        script.onload = () => kakao.maps.load(resolve); // 로드 후 resolve 호출
        script.onerror = reject; // 로드 실패 시 reject 호출
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${VITE_KAKAO_API_KEY}`;
        document.head.appendChild(script);
      }
    });
  }

  // map이 로드될때까지 기다리는 메서드
  waitForMap() {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (this.map) {
          clearInterval(checkInterval); // 초기화 완료 시 반복 중지
          resolve();
        }
      }, 50); // 50ms 간격으로 초기화 여부 확인
    });
  }

  //   initMap() {
  //     const container = document.getElementById("map");
  //     const options = {
  //       center: new kakao.maps.LatLng(36.358843, 127.344192),
  //       level: 3,
  //     };

  //     this.map = new kakao.maps.Map(container, options);
  //   }

  setOverlay(id, coords, content) {
    const kakaoCoords = new kakao.maps.LatLng(
      coords.latitude,
      coords.longitude
    );

    const newOverlay = new kakao.maps.CustomOverlay({
      position: kakaoCoords,
      content: content,
      xAnchor: 0.3,
      yAnchor: 0.91,
    });

    newOverlay.setMap(this.map);
    this.customOverlaies.push({ id, overlay: newOverlay });
  }

  deleteOverlay() {
    for (const overlay of this.customOverlaies) {
      overlay.setMap(null);
    }
    this.customOverlaies = {};
  }

  setCenter(coords) {
    console.log("KakaoMap.setCenter executed");
    const kakaoCoords = new kakao.maps.LatLng(
      coords.latitude,
      coords.longitude
    );
    this.map.setCenter(kakaoCoords);
  }
}
