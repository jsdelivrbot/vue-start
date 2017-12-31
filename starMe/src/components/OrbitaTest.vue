<template>
  <div class="orbita">
    <div class="mainContentOrbita">
      <md-table class="mainTable">
        <!--<md-table-header>-->
        <!--<md-table-row>-->
        <!--&lt;!&ndash;<md-table-head v-for="(header) in dataOrbitaHeaders">{{header}}</md-table-head>&ndash;&gt;-->
        <!--<md-table-head v-for="hdr in dataOrbitaHeaders">{{hdr}}</md-table-head>-->
        <!--</md-table-row>-->
        <!--</md-table-header>-->
        
        <md-table-body>
          <md-table-row v-for="rowOrbita in dataOrbita">
            <!--<md-table-cell v-for="cellOrbita in rowOrbita">{{cellOrbita}}</md-table-cell>-->
            <md-table-cell class="detailsTab">
              <div class="detailsTab">
                <div class="price detailsDiv">
                  <span class="detailHeder">₪ Price</span>
                  <span class="detailValue">{{rowOrbita.price}}</span>
                </div>
                <div class="city detailsDiv">
                  <span class="detailHeder">City</span>
                  <span class="detailValue">{{rowOrbita.city}}</span>
                </div>
                
                <div class="detailsDiv">
                  <!--<span class="detailHeder">Street</span>-->
                  <span>{{rowOrbita.area}}</span>
                </div>
                
                
                <div class="detailsDiv">
                  <span class="detailHeder">Furniture</span>
                  <span class="detailValue">{{rowOrbita.furniture}}</span>
                </div>
                <div class="detailsDiv">
                  <span class="detailHeder">Floor</span>
                  <span class="detailValue">{{rowOrbita.floor}}</span>
                </div>
                <div class="detailsDiv">
                  <span class="detailHeder">Rooms</span>
                  <span class="detailValue">{{rowOrbita.rooms}}</span>
                </div>
                <br><br>
                <div class="phoneDetail detailsDiv">
                  <span class="detailHeder">Phone</span>
                  <span class="detailValue">{{rowOrbita.phone || '-'}}</span>
                </div>
              
              </div>
            
            
            </md-table-cell>
            <md-table-cell class="textTab">
              <div class="fullText">{{rowOrbita.fullText}}</div>
            
            </md-table-cell>
            <md-table-cell class="photoTab">
              
              <div class='imageThumb' v-for="image in rowOrbita.images"><a :href="image" target="_blank"><img
                :src='image' alt="foto"></a></div>
            </md-table-cell>
          </md-table-row>
        </md-table-body>
      </md-table>
    </div>
  </div>
</template>
<script>
  export default {
    mounted: function () {
      let self = this;
      self.dataOrbitaHeaders = [];
      self.getData();
    },
    name: 'orbita',
    data() {
      return {
        dataOrbita: [
          {
            "type": "  Квартиры - Сдам",
            "city": "Бат Ям",
            "date": "",
            "area": "Центр- у моря - ул. Бальфур,Бат ям.",
            "rooms": "3",
            "floor": "-",
            "furniture": "да",
            "price": "1000 шек.",
            "fullText": "Я НЕ МАКЛЕР - нет никакой дополнительной платы кроме арендной, а также нет залога. \n\n••• просторные комнаты только для пар или двух женщин на улице Бальфур и Арлозоров. Центр Бат Яма, вблизи моря. 1000-1200 шек за одного человека. В комнате - большой холодильник, мебель, интернет. Все коммунальные включены в цену. \n\nДля мужчин - 900-1000шек для одного человека в комнатах по 2. \nКомнаты с мебелью и холодильником: \nв центре города у моря. Со всеми расходами, wifi, стиральная, белье, одеяла и подушки\n\nЖеня: ‭055-9713138‬\nWhatsapp +972‭55-9713138‬",
            "phone": " 055 9713138‬",
            "images": []
          },
          {
            "type": "  Квартиры - Сдам",
            "city": "Бат Ям",
            "date": "",
            "area": "Бен Гурион 99",
            "rooms": "-",
            "floor": "-",
            "furniture": "да",
            "price": "6000 шек.",
            "fullText": "Двухкомнатная квартира в отеле Леонардо полностью мебелированная ,Интернет есть, на самом берегу моря, цена включает только аренду ,коммунальные услуги отдельно., БЕЗ МАКЛЕРА .тел хозяйки 0526502928 Нира, можно жить до 4 человек",
            "images": [
              "http://static.doska.orbita.co.il/images/users/1888/188793_img_1284936.jpg",
              "http://static.doska.orbita.co.il/images/users/1888/188793_img_1284937.jpg",
              "http://static.doska.orbita.co.il/images/users/1888/188793_img_1284938.jpg",
              "http://static.doska.orbita.co.il/images/users/1888/188793_img_1284939.jpg",
              "http://static.doska.orbita.co.il/images/users/1888/188793_img_1284940.jpg"
            ]
          },
          {
            "type": "  Квартиры - Сдам",
            "city": "Бат Ям",
            "date": "",
            "area": "-",
            "rooms": "-",
            "floor": "-",
            "furniture": "да",
            "price": "-",
            "fullText": "Сдается КОЙКО-МЕСТО в центре города Бат-Ям рабочим и туристам – 1300 шек/мес. В квартире есть вся необходимая мебель, оборудованная \nкухня, wi-fi. Рядом море (3 мин пешком), автобусные остановки, банки, рынок, магазины. Не маклер!!! phone. 054-6395646 0527563025 Дмитрий\n\nСдается комната на длительный срок в центре города Бат-Ям одному работающему человеку (без вредных привычек!!!). В комнате есть вся необходимая мебель, кухня полностью оборудованная, есть wi-fi,\nДом расположен возле моря Бат-Ям - рядом банки, рынок, магазины, автобусные остановки во все направления. Аренда 1900 шек/мес (все включено)\nphone. 054-6395646 Дмитрий",
            "phone": " 054 6395646",
            "images": []
          },
          {
            "type": "  Квартиры - Сдам",
            "city": "Бат Ям",
            "date": "28.12.2017",
            "area": "-",
            "rooms": "-",
            "floor": "-",
            "furniture": "-",
            "price": "-",
            "fullText": "в центре сдается 3.5 с половиной комнаты\nбез чеков могут обращаться репатрианты\nтуристы и беженцы \n\n053 520 47 85\nАлександра",
            "images": []
          },
          {
            "type": "  Квартиры - Сдам",
            "city": "Бат Ям",
            "date": "28.12.2017",
            "area": "-",
            "rooms": "1",
            "floor": "1",
            "furniture": "частично",
            "price": "2800 шек.",
            "fullText": "Сдаётся 1ком.кв.1этаж,мебель. Бат-ям центр.2800.",
            "phone": " 02 0545517119",
            "images": []
          },
          {
            "type": "  Квартиры - Сдам",
            "city": "Бат Ям",
            "date": "28.12.2017",
            "area": "-",
            "rooms": "3",
            "floor": "2",
            "furniture": "да",
            "price": "4000 шек.",
            "fullText": "Сдаётся 3ком.кв.2этаж,мебель. Бат-ям центр.4000.",
            "phone": " 02 0545517119",
            "images": []
          },
          {
            "type": "  Квартиры - Сдам",
            "city": "Бат Ям",
            "date": "28.12.2017",
            "area": "-",
            "rooms": "-",
            "floor": "-",
            "furniture": "-",
            "price": "-",
            "fullText": "Сдается в БАТ ЯМЕ комната на подселения для работущего мужчины. Комната полностью мебелированая в очень хорошоем районе. 0503493030",
            "images": []
          },
          {
            "type": "  Квартиры - Сдам",
            "city": "Бат Ям",
            "date": "28.12.2017",
            "area": "-",
            "rooms": "-",
            "floor": "-",
            "furniture": "-",
            "price": "-",
            "fullText": "квартира комната 3 ком. в центре\nсрочное решение КВАРТИРНОГО ВОПРОСА в том числе ДЛЯ ТУРИСТОВ \nсдается в аренду для туристов \nмебель\n053 520 47 85\nАлександра",
            "images": []
          },
          {
            "type": "  Квартиры - Сдам",
            "city": "Бат Ям",
            "date": "28.12.2017",
            "area": "-",
            "rooms": "-",
            "floor": "-",
            "furniture": "-",
            "price": "-",
            "fullText": "Сдается комната в квартире с двухспальной кроватью, рядом каньйон бат ям,для пары - цена 1250 шек. с одного человека включая все коммунальные расходы, есть все необходимое для жизни.\nНе Маклер.",
            "phone": " 055 9535596",
            "images": []
          },
          {
            "type": "  Квартиры - Сдам",
            "city": "Бат Ям",
            "date": "28.12.2017",
            "area": "-",
            "rooms": "-",
            "floor": "-",
            "furniture": "-",
            "price": "-",
            "fullText": "Сдается койко место в комнате где 2 кровати, только для мужчин , цена 1200 шек в месяц, в квартире есть все необходимое для жизни. Находится рядом с каньйоном Бат ям.\nНе маклер.",
            "phone": " 055 9535596",
            "images": []
          }
        ],
        dataOrbitaHeaders: []
      }
    },
    methods: {
      getData: function () {
        let options = {
          method: 'get',
          url: '/getDataOrbita',
        };
        this.$http(options)
          .then(
            response => {
              console.log(response);
              try {
                this.dataOrbita = JSON.parse(response.body);
              }
              catch (err) {
                this.dataOrbita = response.body;
              }
              this.dataOrbitaHeaders = [];
              for (let i in this.dataOrbita[0]) {
                this.dataOrbitaHeaders.push(i);
              }
            },
            error => console.warn(error)
          )
          .catch(
            error => console.warn(error)
          );
        
      }
      
      
    },
    
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .orbita {
    position: relative;
    height: 99%;
  }
  
  h1, h2 {
    font-weight: normal;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
    text-align: left;
  }
  
  li {
    display: block;
    margin: 0 10px;
    text-align: left;
    
  }
  
  a {
    color: #42b983;
  }
  
  td.text {
    text-align: left;
  }
  
  td.hours {
    text-align: right;
  }
  
  .buttons, .inputs {
    font-size: 24px;
    position: relative;
    width: 100%;
    display: inline-block;
  }
  
  .task, .hours, .url {
    display: inline-block;
    width: 25%;
  }
  
  .hours {
    width: 7%;
  }
  
  .fa-icon {
    width: auto;
    height: 1em; /* or any other relative font sizes */
    /* You would have to include the following two lines to make this work in Safari */
    max-width: 100%;
    max-height: 100%;
  }
  
  .textTab {
    text-align: left;
  }
  
  .photoTab {
    width: 128px;
    text-align: left;
  }
  
  .imageThumb {
    display: inline-block;
    width: 100%;
    
  }
  
  .fullText {
    text-align: justify;
    font-size: 16px;
    vertical-align: top;
    position: absolute;
    top: 12px;
  }
  
  .mainTable {
    width: 1000px;
    margin: auto;
    /*width: 100vh;*/
  }
  
  .mainContentOrbita {
    align-items: center;
  }
  
  .detailsTab {
    min-height: 16em;
    width: 300px;
    text-align: left;
    vertical-align: top;
  }
  
  .phoneDetail {
    
    bottom: 8px;
  }
  
  .detailsDiv {
    /*width: 300px;*/
    font-size: 18px;
    margin-top: 8px;
    margin-bottom: 8px;
  }
  
  .detailValue {
    display: inline-block;
    position: absolute;
    right: 16px;
  }

  .price{
    color: darkred;
  }
  
  

</style>
