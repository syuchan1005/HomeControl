<template>
  <div class="top">
    <v-flex xs12 sm8 md4>
      <v-card class="elevation-12">
        <v-toolbar class="elevation-1">
          <v-scale-transition>
            <v-btn icon v-show="active === 1" @click="active--">
              <v-icon>fas fa-angle-left</v-icon>
            </v-btn>
          </v-scale-transition>
          <v-toolbar-title>Sign {{['in', 'up'][active]}}</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form lazy-validation ref="signForm">
            <v-text-field
              v-model="name"
              prepend-icon="person"
              label="Name"
              type="text"
              :rules="[rules.signUp, rules.required, rules.minmax(4, 20)]"
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
          <v-btn v-if="active === 0" dark color="rgba(0, 0, 0, 0.7)"
            @click="clickSignin">
            Sign in
          </v-btn>
          <apollo-mutation v-else
            :mutation="require('../graphql/SignUp.gql')"
            :variables="{ name, pass }"
            @done="({ data }) => clickSignin(data.signUp.username)"
            @error="(e) => {
              signUp.show = true;
              signUp.message = e.graphQLErrors[0].message;
              $nextTick($refs.signForm.validate);
            }">
            <template slot-scope="{ mutate, loading, error }">
              <v-btn dark :color="error ? 'error' : 'rgba(0, 0, 0, 0.7)'"
                     @click="!$refs.signForm.validate() || mutate()"
                     :disabled="loading">
                Sign up
              </v-btn>
            </template>
          </apollo-mutation>
          <v-spacer />
        </v-card-actions>
        <v-scale-transition>
          <v-card-actions v-show="active === 0">
            <v-spacer />
            <v-btn outline small color="primary" @click="active++">
              Have no account?
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </v-scale-transition>
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
import { localOAuthClient } from '../../Config';

export default {
  name: 'Top',
  data() {
    return {
      rules: {
        required: v => !!v || 'Required',
        minmax: (min, max) => (v) => {
          if (!v || v.length < min) return `Min ${min} characters`;
          if (v.length > max) return `Max ${max} characters`;
          return true;
        },
        signUp: () => {
          if (this.active === 1 && this.signUp.show) {
            this.signUp.show = false;
            return this.signUp.message;
          }
          return true;
        },
      },
      active: 0,
      showPassword: false,
      name: '',
      pass: '',
      signUp: {
        show: false,
        message: '',
      },
      invalidSignIn: false,
    };
  },
  mounted() {
    const refreshToken = window.sessionStorage.getItem('RefreshToken');
    if (refreshToken !== undefined) {
      this.$http({
        url: '/oauth/token',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: Object.entries({
          client_id: localOAuthClient.id,
          client_secret: localOAuthClient.secret,
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }).reduce((p, e) => p.append(e[0], e[1]) || p, new URLSearchParams()),
      }).then(({ data }) => {
        window.sessionStorage.setItem('AccessToken', data.access_token);
        window.sessionStorage.setItem('RefreshToken', data.refresh_token);
        this.$nextTick(() => { this.$router.push('/home'); });
      }).catch(() => { /* ignored */ });
    }
  },
  methods: {
    clickSignin(welcome) {
      if (!this.$refs.signForm.validate()) return;
      this.$http({
        url: '/oauth/token',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: Object.entries({
          client_id: localOAuthClient.id,
          client_secret: localOAuthClient.secret,
          grant_type: 'password',
          username: this.name,
          password: this.pass,
        }).reduce((p, e) => p.append(e[0], e[1]) || p, new URLSearchParams()),
      }).then(({ data }) => {
        window.sessionStorage.setItem('AccessToken', data.access_token);
        window.sessionStorage.setItem('RefreshToken', data.refresh_token);
        this.$nextTick(() => {
          this.$router.push(welcome ? {
            path: '/home',
            query: { welcome },
          } : '/home');
        });
      }).catch(() => { this.invalidSignIn = true; });
    },
  },
};
</script>

<style scoped lang="scss">
.top {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
