import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App";
import Login from "./components/login/Login"
import MediaList from "./components/medialist/MediaList";
import Settings from "./components/settings/Settings";
import Search from "./components/search/Search";
import Notifications from "./components/notifications/Notifications";
import Spinner from "./components/base/Spinner";
import MediaView from "./components/media/MediaView";
import ForumOverview from "./components/forum/ForumOverview";
import About from "./components/about/About";

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: "/",
      component: Spinner
    },
    {
      path: "/login",
      component: Login
    },
    {
      path: "/medialist",
      component: MediaList
    },
    {
      path: "/search",
      component: Search
    },
    {
      path: "/notifications",
      component: Notifications
    },
    {
      path: "/forum",
      component: ForumOverview
    },
    {
      path: "/settings",
      component: Settings
    },
    {
      path: "/about",
      component: About
    },
    {
      path: "/media/:id",
      name: "media-view",
      component: MediaView,
      props: true
    }
  ]
});

global.browser = require('webextension-polyfill');
Vue.prototype.$browser = global.browser;

/* eslint-disable no-new */
export default new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
