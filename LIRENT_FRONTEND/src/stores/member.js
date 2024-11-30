import { reactive, ref } from "vue";
import { defineStore } from "pinia";
import { memberAxios } from "@/util/http-commons";

export const useMemberStore = defineStore(
  "member",
  () => {
    const memberHttp = memberAxios();
    const accessToken = ref();

    // 상태 관리 객체
    const member = reactive({
      id: null,
      nickname: null,
      email: null,
      // 비밀번호는 상태에서 제거
      phone: null,
      address: null,
      park: false,
      buildingElevatorNum: 0,
      floor: 0,
      area: 0,
      rooms: 0,
      bathrooms: 0,
      latitude: null,
      longitude: null,
    });

    function login(email, password) {
      return memberHttp
        .post("/token", { email, password }, { withCredentials: true })
        .then((res) => {
          accessToken.value = res.data.accessToken; // 토큰 저장
          getUserData(); // 유저 정보 가져오기
          return accessToken.value; // 토큰 반환
        })
        .catch((err) => {
          console.error("로그인 실패:", err.response || err);
          throw err; // 예외 전달
        });
    }

    function logout() {
      accessToken.value = null; // 토큰 삭제
      for (const key in member) {
        member[key] = ""; // 상태 초기화
      }
    }

    function getUserData() {
      return memberHttp
        .get("/userinfo", {
          headers: {
            Authorization: `Bearer ${accessToken.value}`,
          },
        })
        .then((res) => {
          console.log("사용자 정보 가져오기 성공:", res.data);
          const data = res.data;

          // 서버에서 받은 모든 데이터를 상태에 저장
          member.id = data.memberId;
          member.email = data.email;
          member.nickname = data.nickname;
          member.phone = data.phone;
          member.address = data.address;
          member.park = data.park;
          member.buildingElevatorNum = data.buildingElevatorNum;
          member.floor = data.floor;
          member.area = data.area;
          member.rooms = data.rooms;
          member.bathrooms = data.bathrooms;
          member.latitude = data.latitude;
          member.longitude = data.longitude;
          console.log("현재 사용자 상태:", member);
        })
        .catch((err) => {
          console.error("사용자 정보 가져오기 실패:", err.response || err);
          throw err;
        });
    }

    function register({
      email,
      password,
      phone,
      address,
      nickname,
      park,
      buildingElevatorNum,
      floor,
      area,
      rooms,
      bathrooms,
      latitude,
      longitude,
    }) {
      return memberHttp
        .post("", {
          email,
          password,
          phone,
          address,
          nickname,
          park,
          buildingElevatorNum,
          floor,
          area,
          rooms,
          bathrooms,
          latitude,
          longitude,
        })
        .then((res) => {
          console.log("Register 성공함:", res);
          return res; // 성공 결과 반환
        })
        .catch((err) => {
          console.error("회원가입 실패:", err);
          throw err; // 에러를 상위로 전달
        });
    }

    function updateUser(data) {
      return memberHttp
        .put("", data)
        .then((res) => {
          console.log("회원 정보 업데이트 성공:", res.data);
        })
        .catch((err) => {
          console.error("회원 정보 업데이트 실패:", err.response?.data || err);
          throw err;
        });
    }

    function deleteUser() {
      return memberHttp
        .delete("", {
          headers: {
            Authorization: `Bearer ${accessToken.value}`, // JWT 토큰 추가
          },
        })
        .then(() => {
          console.log("회원 삭제 성공");
        })
        .catch((err) => {
          console.error("회원 삭제 실패:", err.response || err);
          alert("회원 삭제에 실패했습니다.");
        });
    }

    function checkEmailExists(email) {
      return memberHttp
        .get(`/exists/${email}`) // 인증 헤더 제거
        .then((res) => {
          console.log("이메일 중복 확인 성공:", res.data);
          return res.data;
        })
        .catch((err) => {
          console.error("이메일 중복 확인 실패:", err.response || err);
          throw err;
        });
    }

    function resetPassword(name, email) {
      return memberHttp
        .post("/reset-password", {
          name,
          email,
        })
        .then((res) => {
          console.log("비밀번호 초기화 성공");
          return res;
        })
        .catch((err) => {
          console.error("비밀번호 초기화 실패:", err);
          throw err; // 에러를 상위로 전달
        });
    }

    return {
      member,
      accessToken,
      login,
      logout,
      register,
      updateUser,
      deleteUser,
      resetPassword,
      getUserData,
      checkEmailExists,
    };
  },
  {
    persist: true, // persist 옵션은 정의 스토어의 두 번째 인자로 분리
  }
);
