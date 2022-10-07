<template>
  
  <div class="acc">

    <template v-for="pair in Object.entries(pairs)">
       <span>{{pair[0]}}</span>
      <input v-model="pair[1]" />
    </template>
    <div></div>
    <button> Save Changes</button>
  </div>
</template>
<script>
  import '@/static/acc.css'
  export default {
    data: function () {
      return { temp: ""}
    },
    beforeCreate:  function () {
      var cuser = this.$parent.$props.data.data.user;
      var temp = this.$parent.$props.data.data[cuser];
      var key = ['name', 'address', 'contact'];
      var pairs = {};
      key.forEach(function(k)  {
        var val = temp['name'];
        if (val === undefined) val = ""
        pairs[k] = val;
      });
  
      this.pairs = pairs;
      //var = await this.$axios.$post('/api/auth', {});
    },
    methods: {
    }

  }
 </script>
