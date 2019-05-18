<template>
  <v-app>
    <div class="overlay" v-show="$apollo.loading"></div>

    <v-toolbar app>
      <v-toolbar-title class="headline">
        <span>HomeControl</span>
        <span class="font-weight-light body-1"> by syuchan1005</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn outline v-if="$route.meta.showSignOut"
             @click="sign0ut">
        Sign out
      </v-btn>
      <v-btn icon href="https://github.com/syuchan1005/HomeControl" target="_blank">
        <v-icon>fab fa-github</v-icon>
      </v-btn>
    </v-toolbar>

    <v-content>
      <router-view />
    </v-content>

    <v-alert :value="showReloadAlert">
      <div>新しいアップデートがあります! リロードして更新して下さい.</div>
      <v-btn color="primary" @click="locationReload(true)">Reload</v-btn>
    </v-alert>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      showReloadAlert: false,
    };
  },
  mounted() {
    if (window.isUpdateAvailable) { // PWA用の更新処理
      window.isUpdateAvailable.then((available) => {
        this.showReloadAlert = available;
      });
    }
  },
  methods: {
    locationReload: val => window.location.reload(val),
    sign0ut() {
      window.sessionStorage.removeItem('AccessToken');
      window.sessionStorage.removeItem('RefreshToken');
      this.$router.push('/');
    },
  },
};
</script>

<style lang="scss" scoped>
.overlay {
  z-index: 10000;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.05);
}
</style>
