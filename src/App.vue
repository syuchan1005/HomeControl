<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline">
        <span>HomeControl</span>
        <span class="font-weight-light body-1"> by syuchan1005</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn outline v-if="$route.path !== '/' || !$route.path.startsWith('/login')"
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
