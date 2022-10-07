<template>
  
  <div class="placeorder">
    <div>
      <div class="details">
        <div class="label">
          <label v-bind:for="detail[0]" v-for="detail in details">{{detail[1]}} : </label>
        </div>
        <div class="input">
          <input type="text" v-for="detail in details" v-bind:id="detail[0]"  />
        </div>
        <div class="pricebuy" v-if="reqstate">
          Total Amount :  Rs. {{this.value}}
        </div>
      </div>
    </div>

      <button class="confirmbuybtn" @click="confirmorder">Confirm Order</button>

  </div>
</template>
<script>
  import '@/static/buy.css'
  export default {
    beforeCreate: async function () {
      this.cart = await this.$axios.$post('/api/cart');
      var val = 0;
      this.cart.forEach((z) => {val+=z.Price*z.qty})
      this.value = val;
      this.reqstate = true;
    },
    data: function () {return { reqstate: false, cart: [], value: "", details: [['name', 'Name'], ['number', 'Phone Number'], ['address', 'Address']] } },
    methods:  {
      confirmorder: async function () {
        var data = {};
        if (process.client) {
          
          document.querySelectorAll(".placeorder  input").forEach((z) => { data[z.id] = z.value })
          var msg = await this.$axios.$post("/api/confirmorder", data);
          alert(msg);
          var cuser = this.$parent.$props.data.data.user
          this.$parent.$props.data.data[cuser]
          this.$parent.$data.content = 'home'
        }
      }
    }

  }
 </script>
