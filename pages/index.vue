<template>
  <p v-if="$fetchState.pending">Fetching mountains...</p>
  <p v-else-if="$fetchState.error">An error occurred :(</p>
  <div v-else>
    <div v-if="!data.loginstate" id="loginform">
      <span>The Nuxt Store</span>
      <input id="user" v-model="user" v-on:keyup="signupcheck"/>
      <input id="pass" v-model="pass" />
      <span>{{data.err}}</span>
      <button @click="LOGIN" id="loginbtn" v-if="form=='LOGIN'">LOGIN</button>
      <button @click="SIGNUP" id="loginbtn" v-if="form=='SIGNUP'">SIGN UP</button>
      <div style="display:flex ; flex-direction:row ; "><span id="links">Forgot password</span> <span id="links" v-if="form=='LOGIN'" @click="form='SIGNUP'">Sign Up</span> <span id="links" v-else @click="form='LOGIN'">Login</span></div>
    </div>
    <LazyHome v-if="data.loginstate" v-bind:data="data" />
   
  </div>
</template>
<script>
  import '@/static/login.css'
  export default {
    data: function () {
      return { form: 'LOGIN', user: '', pass: '', data: {}} } ,
    async fetch() {
      this.data = await this.$axios.$post('/api/auth', {});
    },
    methods: {
      LOGIN: async function () { this.data = await this.$axios.$post('/api/auth', { user: this.user, pass: this.pass }); this.cookiecreate(); },
      signupcheck: async function () {
        if (this.form == 'LOGIN') return;
        var err = await this.$axios.$post('/api/auth', { user: this.user, pass: this.pass }); console.log(err); this.data.err = (err.err != 'Invalid username') ? 'Username taken' : 'Username Available'; 
      },
      SIGNUP: async function () { this.data = await this.$axios.$post('/api/signup', { user: this.user, pass: this.pass });this.cookiecreate() },
      cookiecreate: function () {
        try { document.cookie = 'cred=' + this.data.data.cookies } catch{ }
      }
    }
  }
</script>
