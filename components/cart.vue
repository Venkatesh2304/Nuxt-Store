<template>
  <div class="cart">
    <div class="cartcards" v-for="card in cart">
      <img src="https://repository-images.githubusercontent.com/308979240/09c47f00-1c86-11eb-906f-92c53f88be9f" />
      <div class="cartdetails">
        <h1 class="cartname"> {{card.name}}</h1>
        <h2 class="cartprice"> Rs . {{card.Price}} </h2>
      </div>
      <div class="cartnumber"><button class="cartinc" @click="card.qty = (card.qty>1)?card.qty-1:card.qty ; cartupdate();">-</button> <input class="cartnumberinput" type="number" @change="cartupdate" v-model="card.qty" /> <button class="cartinc" @click="card.qty += 1;cartupdate();">+</button> </div>
      <div class="cartvalue">{{card.qty*card.Price}} </div>
      <div class="cartdelete"><button @click="removes(card)">Remove</button> </div>

    </div>
    <div class="buycart" v-if="reqstate"><span>Total : Rs. {{totalvalue}}</span><button @click="checkout">Checkout</button> </div>
    <div class="noproduct" v-if="errstate"> No products have been added to cart , <span @click="gotohome"> click here </span> </div>
  </div>
</template>
<script>
  import '@/static/cart.css'
  export default {
    props: [],
    data: function () { return { cart: [], errstate: false , reqstate:false}},
    beforeCreate: async function () {
      this.cart = await this.$axios.$post('/api/cart'); this.totalupdate();
      if (Object.keys(this.cart).length != 0) { this.reqstate = true; this.errstate = false; }
      else { this.errstate = true; this.reqstate = false;}
      
    },
   
    methods: {
      created: function () { console.log(document.cookie) },
      removes: function (x) { var y = this.cart; this.cart = y.filter(item => item !== x); this.cartupdate(); },
      cartupdate: async function () {
        this.totalupdate();
         var carts = this.cart; var cartformat = {}; carts.forEach((z) => { cartformat[z.id] = z.qty; }); await this.$axios.$post('/api/addtocart', cartformat)
      },
      totalupdate: function () { var sums = 0; this.cart.forEach((p) => { sums += (p.qty * p.Price) }); this.totalvalue = sums; },
      checkout: function () {
        this.$parent.$data.content = "buy";
      },
      gotohome: function() { this.$parent.$data.content ='home' }
    }

  }
 </script>
