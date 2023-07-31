<template>
  <div id="app">
    <NavBar :color="color"/>
    <router-view @update="updateColor" @checkLogin="checkLogin" @footer="enableFooter" @noFooter="disableFooter"></router-view>
    <Footer v-if="footer"/>
  </div>
</template>

<script>
import {uuidv4} from "@/utils";
import NavBar from "@/components/elements/navbar/NavBar";
import Footer from "@/components/elements/Footer";
import axios from "axios";
import config from "../../config.json";

export default {
  name: "App",
  components: {NavBar, Footer},
  data: () => {
    return {
      color: "#947cea",
      footer: false,
    };
  },
  mounted() {
    if (!localStorage.userToken) {
      localStorage.userToken = uuidv4();
    }
  },
  methods: {
    updateColor(color) {
      this.color = color;
    },
    checkLogin() {
      axios
          .get(
              `${config.baseUrl}:${config.apiPort}/api/v1/discord/login-status/${localStorage.userToken}`
          )
          .then((res) => {
            if (!res.data.data.loggedIn) {
              location.replace("/login")
            }
          })
    },
    disableFooter() {
      this.footer = false
    },
    enableFooter(){
      this.footer = true
    }
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap");

:root {
  --default-font-family: Source Sans Pro, -apple-system, BlinkMacSystemFont,
  Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif;
  --secondary-font-family: "Montserrat", sans-serif;
}

body {
  padding: 0;
  margin: 0;
}

#content-site {
  padding: 25px;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #23272a;
}

::-webkit-scrollbar-thumb {
  background: #8569e7;
  transition: 0.2s;
}

::-webkit-scrollbar-thumb:hover {
  background: #7c5eea;
}

::-webkit-scrollbar-thumb:active {
  background: #957ceb;
}
</style>
