<template>
  <div id="home" >

    <div class="nav">
      <div id="symbol"></div>
      <div id="search">
        <img src="/search.jpg" @click="search" />
        <input placeholder="Search Here .." @keyup="searchenter($event)"id="searchbar" name="searchbar" list="searchbars" autocomplete="off" v-model="searchquery" v-on:keyup="searchsuggester" />
        <datalist id="searchbars"><option v-for="suggestion in searchsuggestion" v-bind:value="suggestion" @click="search" /></datalist>
      </div>
      <div class="nav-elements" v-on:click="openhome();content='home'">Home</div>
      <div class="nav-elements" v-on:click="content='cart'">Cart</div>
      <div class="nav-elements" v-on:click="content='account'">Account</div>
      <div class="nav-elements">About</div>
    </div>
   
    <div id="content">
      <LazyCart v-if="content=='cart'"/>
      <LazyBuy v-if="content=='buy'"/>
      <LazyAcc v-if="content=='account'"/>
      <div id="Home" v-if="content=='home'">
        <div class="filter">
          <div v-for="filter in Object.entries(filters)" style="border-bottom : 0.7px solid rgb(200,200,200);">
            <div>
              <div class="filtertype">
                {{filter[0]}}
                <svg v-bind:class="filter[1].show?'filterdropup':'filterdropdown'" v-on:click="opendrop(filter[0],$event)" width="16" height="27" viewBox="0 0 16 27" xmlns="http://www.w3.org/2000/svg"><path d="M16 23.207L6.11 13.161 16 3.093 12.955 0 0 13.161l12.955 13.161z" fill="rgb(150,150,150)"></path></svg>
              </div>
            </div>
            <div class="allfiltervalue" v-if="filter[1].show">
              <div v-if="filter[0]!='Price'" v-for="filtervalue in filter[1].value" class="filtervalue"> <input type="checkbox" v-bind:value="filtervalue" v-model="filter[1].applied" @change="filterupdate()" /> <span> {{filtervalue}} </span></div>
              <div v-if="filter[0]=='Price'" v-for="name in ['Minimum','Maximum']" class="pricefilter"> <span>{{name}}</span> <input class="pricerange" v-model="filter[1][name]" @change="filterupdate()" /> </div>
            </div>
          </div>
        </div>
        <div v-for="product in filteredproducts" :key="product.name" class="cards">
          <div class="frontcard">
            <img src="https://repository-images.githubusercontent.com/308979240/09c47f00-1c86-11eb-906f-92c53f88be9f" />
            <h2 class="name"> {{product.name}} </h2>
            <h4 class="price"> RS. {{product.Price}} </h4>
            <div class="about">{{product.ship}} <br />  Seller : {{product.seller}} <br /> Delivery in 3 days  </div>

            <button class="buynow" @click="addtocartbuy(product.id,product.minicartnoitems,$event);">Buy Now</button>
            <button class="addcart" v-on:click="flipbackcard">Add to Cart</button>

          </div>
          <div class="backcard">
            <h2 class="priceback"> {{product.price}} </h2>
            <div class="numbers">
              <button class="inc" @click="(product.minicartnoitems>1)?product.minicartnoitems-=1:product.minicartnoitems+=0">-</button>
              <input type="number" value=1 min="1" v-model="product.minicartnoitems" class="count" />
              <button class="inc" @click="product.minicartnoitems+=1">+</button>
            </div>
            <div class="subtotal">
              Subtotal : {{Math.round(product.minicartnoitems * product.Price,2)}}
            </div>
            <button class="addcart" id="miniback" onclick='backmini(event)'>Back </button>
            <button class="addcart" v-on:click="addtocart(product.id,product.minicartnoitems,$event);">Add to Cart</button>
          </div>
        </div>
      </div>
      <!-- home ends here-->
       
    </div>
  </div>
</template>

<link href="https://fonts.googleapis.com/css?family=Open+Sans:400italic,600italic,700italic,400,600,700" rel="stylesheet" type="text/css" />


<script>
  import "@/static/home.css";
  export default {
    head() {
      return {
        script: [
          {
            src: "/home.js",
          }
        ]
      }
    },
   props:['data'],
    beforeCreate: async function () {
      this.products = await this.$axios.$post('/api/products');
      if (typeof this.products == "string") {
        console.log(1)
        this.products = [];
      }
      var p = this.products;
      this.filteredproducts = this.products;
      this.searchedproducts = this.products;
      var dup = { 'Category': { value: [], show: true, applied: [] }, 'Brand': { value: [], show: true, applied: []}, 'Price': { value: [], show: true } };
      p.forEach(function (x) { dup['Category'].value.push(x.Category); dup['Brand'].value.push(x.Brand);  });
      this.filters = dup;
    },
    data: function () {
      return {
        content: "home",
        products: [],
        searchedproducts: [],
        searchsuggestion: [],
        filteredproducts: [],
        searchquery: "",
        filters: {}
      }
    },
    methods: {
      searchenter: function (e) {
        if (e.keyCode == 13) { e.target.blur()}
        this.search()
      },
      openhome: async function () { this.products = await this.$axios.$post('/api/products'); },
      flipbackcard: function () {
        event.target.parentNode.parentNode.style.transform = "rotateY(180deg)";
      },
      addtocart: async function (a, b, event) {

        this.data.data[this.data.data.user].cart[a] = b;
        await this.$axios.$post('/api/addtocart', this.data.data[this.data.data.user].cart)
        event.target.parentNode.parentNode.style.transform = "rotateY(360deg)";
      },
      addtocartbuy: async function (a, b, event) {
        console.log(a,1);
        this.data.data[this.data.data.user].cart[a] = b;
        await this.$axios.$post('/api/addtocart', this.data.data[this.data.data.user].cart)
        event.target.parentNode.parentNode.style.transform = "rotateY(360deg)";
        this.content='cart'
      },
      search: function () {
        var d2 = [];var d1 = this.searchquery;
        this.products.forEach(function (e) { if (e.name.toLowerCase().includes(d1.toLowerCase())) { d2.push(e) } });
        this.searchedproducts = d2; this.filterupdate();
      },
      opendrop: function (k, l) {
        if (l.target.tagName == "svg") {
          this.filters[k].show = !this.filters[k].show;
          if (l.target.getAttribute("class") == "filterdropdown") { l.target.setAttribute("class", 'filterdropup') }
          else { l.target.setAttribute("class", 'filterdropdown') }
        }
      },
      filterupdate: function () {
        var b = [];
        var newprod = {}
        this.searchedproducts.forEach((z) => { newprod[z.id] = z })
        var newprodid = []
        this.searchedproducts.forEach((z) => { newprodid.push(z.id) })
        Object.entries(this.filters).forEach((x) => {
          var a = [];
          if (x[1].applied == undefined) { return }
          if (x[1].applied.length == 0) { b.push(newprodid); return; }
          this.searchedproducts.forEach((y) => { if (x[1].applied.includes(y[x[0]])) { a.push(y.id) } });
          b.push(a);
        });
        console.log(b, 5);
        var price = this.filters.Price;
        var maxi = [];
        var mini = [];
        try { var maxim = parseInt(price.Maximum); this.searchedproducts.forEach((z) => { console.log(maxim, z.Price); if (z.Price <= maxim || isNaN(maxim)) { maxi.push(z.id) } }) } catch (err) { maxi = newprodid }
        try { var minim = parseInt(price.Minimum); this.searchedproducts.forEach((z) => { if (z.Price >= minim || isNaN(minim)) { mini.push(z.id) } }) } catch { mini = newprodid }
        b.push(maxi);
        b.push(mini);
        var result = b.reduce((p, q) => p.filter(c => q.includes(c)));
        var newfilteredproucts = [];
        result.forEach((z) => { newfilteredproucts.push(newprod[z]) })
        console.log(result, newfilteredproucts)
        this.filteredproducts = newfilteredproucts
      },
      searchsuggester: function () { var d2 = []; var d1 = this.searchquery; this.products.forEach(function (e) { if (e.name.toLowerCase().includes(d1.toLowerCase())) { d2.push(e.name) } }); this.searchsuggestion = d2.splice(0,10); }
    }
  }
</script>
