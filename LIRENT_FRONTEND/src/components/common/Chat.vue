<script setup>
import { useMemberStore } from "@/stores/member";
import { chatsAxios } from "@/util/http-commons";
import { computed, onMounted, onUpdated, ref, watch } from "vue";
import { Client } from "@stomp/stompjs";
import { onBeforeRouteUpdate } from "vue-router";

const { VITE_WS_CHAT_URL } = import.meta.env;

const chatsHttp = chatsAxios();
const store = useMemberStore();

const props = defineProps({
  subleaseId: Number,
  ownerId: Number,
});

// 웹소켓 클라이언트
const stompClient = ref();

// 채팅 데이터
const chats = ref([]);

const myMessage = ref();
const currentMemberIsOwner = computed(() => {
  return props.ownerId === store.member.id;
});

onMounted(() => {
  console.log("최초 마운트 " + props.subleaseId);

  getChats(props.subleaseId);
  connectWebSocket();
});

onBeforeRouteUpdate((to, from) => {
  console.log("라우팅 업데이트 " + to.params.subleaseId);
  stompClient.value.deactivate().then(() => {
    console.log("웹소켓 연결 종료");
  });
  chats.value = null;
  getChats(to.params.subleaseId);
  connectWebSocket();
});

function connectWebSocket() {
  // WebSocket 클라이언트 초기화
  stompClient.value = new Client({
    brokerURL: `${VITE_WS_CHAT_URL}`,
    onConnect: () => {
      console.log("채팅 웹소켓 연결 완료.");

      // 특정 채팅방 구독
      stompClient.value.subscribe(
        `/topic/chatroom/${props.subleaseId}`,
        (message) => {
          console.log("채팅 메세지 수신");

          const chat = JSON.parse(message.body);
          chats.value.push(chat);
        }
      );
    },
    onStompError: (frame) => {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
    },
  });

  // WebSocket 연결 활성화
  stompClient.value.activate();
}

// 채팅 데이터 가져오기
function getChats(subleaseId) {
  chatsHttp.get(`/${subleaseId}`).then(({ data }) => {
    chats.value = data;
  });
}

function sendMessage() {
  if (myMessage.value && store.member.id) {
    const dto = {
      subleaseId: props.subleaseId,
      memberId: store.member.id,
      message: myMessage.value,
      owner: currentMemberIsOwner.value,
    };

    stompClient.value.publish({
      destination: `/app/sendMessage/${props.subleaseId}`,
      body: JSON.stringify(dto),
    });
  }
  myMessage.value = undefined;
}
</script>

<template>
  <div class="card">
    <div class="card-header text-center bg-primary text-white">
      <h5 class="mb-0">채팅</h5>
    </div>
    <div class="card-body" style="max-height: 300px; overflow-y: auto">
      <!-- 받은 메시지 -->
      <template v-for="chat in chats">
        <template v-if="chat.owner">
          <div class="d-flex flex-column align-items-start mb-3">
            <div class="fw-bold">전차인</div>
            <div class="p-2 rounded text-bg-light border">
              {{ chat.message }}
            </div>
          </div>
        </template>

        <!-- 보낸 메시지 -->
        <template v-else>
          <div class="d-flex flex-column align-items-end mb-3">
            <div class="fw-bold">사용자</div>
            <div class="p-2 rounded text-bg-primary text-white">
              {{ chat.message }}
            </div>
          </div>
        </template>
      </template>
    </div>
    <form class="card-footer d-flex gap-2">
      <input
        type="text"
        class="form-control"
        placeholder="메시지 입력..."
        v-model="myMessage"
        :readonly="!store.member.id"
      />
      <button class="btn btn-primary" @click.prevent="sendMessage">
        보내기
      </button>
    </form>
  </div>
</template>

<style scoped></style>
