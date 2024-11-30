import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import RegisterView from "@/views/RegisterView.vue";
import LoginView from "@/views/LoginView.vue";
import QuestionView from "@/views/QuestionView.vue";
import MyPageView from "@/views/MyPageView.vue";
import UpdateUserView from "@/views/UpdateUserView.vue";
import ResetPasswordView from "@/views/ResetPasswordView.vue";
import HomeDetailView from "@/views/HomeDetailView.vue";
import ContractView from "@/views/ContractView.vue";
import MyBuketView from "@/views/MyBuketView.vue";
import MySubleaseView from "@/views/MySubleaseView.vue";
import MyDealView from "@/views/MyDealView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "landing",
      component: HomeView,
      children: [
        {
          path: "detail/:subleaseId",
          name: "detail",
          component: HomeDetailView,
          props: true,
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/logout",
      name: "logout",
      redirect: { name: "login" }, // 로그아웃 시 로그인 화면으로 리다이렉트
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
    },
    {
      path: "/mypage",
      name: "mypage",
      component: MyPageView,
    },
    {
      path: "/mybuket",
      name: "mybuket",
      component: MyBuketView,
    },
    {
      path: "/mysublease",
      name: "mysublease",
      component: MySubleaseView,
    },
    {
      path: "/mydeal",
      name: "mydeal",
      component: MyDealView,
    },
    {
      path: "/updateUser",
      name: "updateUser",
      component: UpdateUserView,
    },
    {
      path: "/resetPassword",
      name: "resetPassword",
      component: ResetPasswordView,
    },
    {
      path: "/qna",
      name: "qna",
      component: QuestionView,
    },
    {
      path: "/contract",
      name: "contract",
      component: ContractView,
      props: (route) => {
        let info = null;
        if (route.query.info) {
          try {
            info = JSON.parse(decodeURIComponent(route.query.info));
          } catch (error) {
            console.log("JSON 파싱 오류");
          }
        }
        return { info: info };
      },
    },
  ],
});

export default router;
