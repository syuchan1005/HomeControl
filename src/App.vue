<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline">
        <span>HomeControl</span>
        <span class="font-weight-light body-1"> by syuchan1005</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn outline v-if="$route.path !== '/'" @click="sign0ut">
        Sign out
      </v-btn>
      <v-btn icon href="https://github.com/syuchan1005/HomeControl" target="_blank">
        <v-icon>fab fa-github</v-icon>
      </v-btn>
    </v-toolbar>

    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  methods: {
    sign0ut() {
      window.sessionStorage.removeItem('AccessToken');
      window.sessionStorage.removeItem('RefreshToken');
      this.$router.push('/');
    },
  },
};
</script>
