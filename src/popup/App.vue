<template>
  <div class="container">
    <Sidebar :unreadNotifications="unreadNotifications" @add-toast="addToast"/>
    <div class="content">
      <keep-alive>
        <router-view
          @update-notifications="updateNotifications"
          @update-theme="updateTheme"
          @add-toast="addToast"
        />
      </keep-alive>
    </div>
    <div class="content toasts">
      <transition-group name="fade">
        <Toast v-for="toast in toasts" :toast="toast" :key="toast.message"/>
      </transition-group>
    </div>
  </div>
</template>

<script>
import Sidebar from "./components/Sidebar";
import Toast from "./components/base/Toast";
import {updateUser} from "../assets/js/utils";

export default {
  components: {Toast, Sidebar},
  data () {
    return {
      unreadNotifications: 0,
      toasts: []
    }
  },
  methods: {
    updateNotifications(unread) {
      this.unreadNotifications = unread;
      this.$browser.browserAction.setBadgeText({ text: unread > 0 ? unread.toString() : "" });
      this.$browser.storage.local.set({ currentNotifications: unread});
    },
    updateTheme() {
      this.$browser.storage.local.get({theme: "light", accent_color: "color-blue", wide: false}).then(value => {
        document.documentElement.style.setProperty("--color-accent", `var(--${value.accent_color})`);
        document.documentElement.style.setProperty("--content-width", value.wide ? "716px" : "525px");
        document.getElementsByTagName("body")[0].className = `theme-${value.theme}`;
      });
    },
    addToast(toast) {
      toast.born = new Date().getTime();
      this.toasts.push(toast);
    }
  },
  created() {
    this.updateTheme();

    setInterval(() => {
      const now = new Date().getTime();
      this.toasts = this.toasts.filter(toast => {
        const lifeSpan = toast.time || 5000;
        return now - toast.born < lifeSpan;
      });
    }, 1);

    const _self = this;
    this.$browser.storage.local.get({ access_token: "", theme: "light", accent_color: "color-blue", last_page: "login", currentNotifications: 0 }).then(value => {
      if (!_self.$router.currentRoute.path.endsWith("login") && !_self.$router.currentRoute.path.endsWith(value.last_page))
        _self.$router.push("/" + (value.access_token === "" ? "login" : value.last_page));

      _self.updateNotifications(value.currentNotifications);
    });

    this.$browser.runtime.onMessage.addListener((message, sender, response) => {
      if (message.type === "update_user")
        updateUser();

      if (message.type === "update_notifications")
        this.updateNotifications(message.notification_count);

      if (message.type === "change_page")
        _self.$router.push(message.page);

      if (message.type === "display_toast")
        this.addToast(message.toast);
    });
  }
}
</script>

<style>
  @import url("../assets/css/main.css");
  @import url("../assets/css/font.css");
  @import url("../assets/css/form.css");
  @import url("../assets/css/theme.css");

  :root {
    /* Theme modifiable */
    --color-background: 237, 241, 245;
    --color-foreground: 250, 250, 250;
    --color-foreground-grey: 245, 246, 246;
    --color-foreground-grey-dark: 234, 236, 237;
    --color-foreground-blue: 246, 248, 251;
    --color-foreground-blue-dark: 241, 243, 247;
    --color-text: 92, 114, 138;
    --color-text-light: 122, 133, 143;
    --color-text-lighter: 146, 153, 161;
    /* No theming */
    --color-overlay: 31, 38, 49;
    --color-text-bright: 237, 241, 245;
    --color-blue: 61, 180, 242;
    --color-red: 232, 93, 117;
    --color-blue-dim: 141, 178, 219;
    --color-white: 255, 255, 255;
    --color-black: 0, 0, 0;
    --color-peach: 250, 122, 122;
    --color-orange: 247, 154, 99;
    --color-yellow: 247, 191, 99;
    --color-green: 123, 213, 85;
    --color-purple: 146, 86, 243;
    --color-pink: 252, 157, 214;
    /* Changeable option */
    --color-accent: var(--color-blue);
    --content-width: 525px;
  }

  /* Global tag modifiers */
  body {
    line-height: 1.15;
    margin: 0;
    font-family: Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    -webkit-font-smoothing: antialiased;
    background-color: rgb(var(--color-background));
    font-size: 12px;
    color: rgb(var(--color-text));
  }

  a {
    text-decoration: none;
    color: rgb(var(--color-text));
    transition: .3s;
  }

  a:hover {
    color: rgb(var(--color-accent));
  }

  /* Chrome: Scroll bar */

  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: none;
  }

  ::-webkit-scrollbar-thumb {
    background: rgb(var(--color-accent));
  }

  .container {
    width: var(--content-width);
    height: 600px;
  }

  .content {
    position: absolute;
    overflow-y: scroll;
    overflow-x: hidden;
    padding: 20px 10px 10px;
    width: calc(var(--content-width) - 76px);
    height: 570px;
    left: 56px;
  }

  .toasts {
    pointer-events: none;
    overflow: hidden;
    z-index: 2;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .2s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
