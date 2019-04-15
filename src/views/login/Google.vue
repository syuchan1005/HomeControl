<template>
  <div class="google">
    <v-flex xs12 sm8 md4>
      <v-card class="elevation-12">
        <v-toolbar class="elevation-1">
          <v-toolbar-title>Sign in</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form lazy-validation ref="signForm">
            <v-text-field
              v-model="name"
              prepend-icon="person"
              label="Name"
              type="text"
              :rules="[rules.required, rules.minmax(4, 20)]"
              counter />
            <v-text-field
              v-model="pass"
              :append-icon="showPassword ? 'visibility_off' : 'visibility'"
              :type="showPassword ? 'text' : 'password'"
              prepend-icon="lock"
              label="Password"
              name="password"
              :rules="[rules.required, rules.minmax(8, 20)]"
              counter
              @click:append="showPassword = !showPassword" />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn dark color="rgba(0, 0, 0, 0.7)" @click="clickSignIn()">
            Sign in
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-flex>

    <v-snackbar bottom :timeout="0" v-model="invalidSignIn">
      Username or Password was incorrect.
      <v-btn color="pink" flat @click="invalidSignIn = false">
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: 'GoogleLogin',
  data() {
    return {
      rules: {
        required: v => !!v || 'Required',
        minmax: (min, max) => (v) => {
          if (!v || v.length < min) return `Min ${min} characters`;
          if (v.length > max) return `Max ${max} characters`;
          return true;
        },
      },
      showPassword: false,
      name: '',
      pass: '',
      invalidSignIn: false,
    };
  },
  methods: {
    clickSignIn() {
      if (!this.$refs.signForm.validate()) return;
      this.$http({
        url: '/oauth/token',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: Object.entries({
          client_id: Config.localOAuthClient.id,
          client_secret: Config.localOAuthClient.secret,
          grant_type: 'password',
          username: this.name,
          password: this.pass,
        }).reduce((p, e) => p.append(e[0], e[1]) || p, new URLSearchParams()),
      }).then(({ data }) => {
        window.location.href = `/oauth/google/auth/callback${window.location.search}&access_token=${data.access_token}`;
      }).catch(() => { this.invalidSignIn = true; });
    },
  },
};
</script>

<style scoped lang="scss">
.google {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
