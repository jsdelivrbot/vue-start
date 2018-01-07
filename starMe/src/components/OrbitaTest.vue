<template>
  <div class="orbita">
    <div class="mainContentOrbita">
      
      <div class="containerMain" v-for="rowOrbita in dataOrbita">
        <div class="header">
          <div>{{rowOrbita.city}}</div>
        </div>
        <div class="main">{{rowOrbita.fullText}}</div>
        <div class="contact">
          <div>{{rowOrbita.phone}}</div>
        </div>
        
        <div class="photo"><img :src='rowOrbita.image || emptyImage' alt="photo"></div>
        
        <div class="photoThumbs">
          <img v-for="image in rowOrbita.images" v-bind:src="image" v-on:click="setImg(rowOrbita, image)">
        </div>
        
        <div class="floor">
          <div>{{rowOrbita.floor}}</div>
        </div>
        <div class="furniture">
          <div>{{rowOrbita.furniture}}</div>
        </div>
        <div class="rooms">
          <div>{{rowOrbita.rooms}}</div>
        </div>
        <div class="parking">
          <div>{{rowOrbita.parking}}</div>
        </div>
        <div class="date">
          <div>{{rowOrbita.date}}</div>
        </div>
        <div class="address">
          <div>{{rowOrbita.area}}</div>
        </div>
        <div class="price">
          <div>{{rowOrbita.price}}</div>
        </div>
      </div>
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
            'image': "http://static.doska.orbita.co.il/images/users/1888/188793_img_1284936.jpg",
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
        dataOrbitaHeaders: [],
        emptyImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAIAAAD2HxkiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzA0QzY4M0I2Nzk0MTFFNDgxQUU4NDkyNzI5RDk4NUUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzA0QzY4M0M2Nzk0MTFFNDgxQUU4NDkyNzI5RDk4NUUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozMDRDNjgzOTY3OTQxMUU0ODFBRTg0OTI3MjlEOTg1RSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozMDRDNjgzQTY3OTQxMUU0ODFBRTg0OTI3MjlEOTg1RSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pt/KQccAACv5SURBVHja7F3Zdh25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'
        
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
            }
          )
          .catch(
            error => {
              console.warn(error);
            }
          );
        
        
      },
      setImg: function (bigImage, image) {
//        bigImage.setImage(image);
        console.log(bigImage);
        bigImage.image = image;
        
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
    text-align: center;
  }
  
  .mainContentOrbita > div {
    margin: auto;
    position: relative;
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
  
  .price {
    color: darkred;
  }
  
  .containerMain > div {
    /*background-color: #cad7f3;*/
    border: 1px solid #8b8b8b;
    position: relative
  }
  
  .containerMain > div > div {
    /*background-color: #cad7f3;*/
    height: 1em;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    font-size: 20px;
  }
  
  .containerMain {
    padding-top: 25px;
    /*width: calc(1200px + 12 * 2px);*/
    display: grid;
    grid-gap: 5px;
    grid-template-columns: repeat(16, calc(100vw / 16 - 5px));
    grid-template-rows: repeat(6, calc(100vw / 16 - 5px));
    grid-template-areas: ". . p  p  p  h h h h h h q q q . . " ". . p  p  p  a a a a a a d d d . . " ". . p  p  p  m m m m m m . . . . . " ". . p0 p0 p0 m m m m m m . . . . . " ". . r0 r1 .  m m m m m m . . . . . " ". . r2 r3 .  m m m m m m c c c . . ";
  }
  
  .header {
    font-size: 20px;
    grid-area: h;
  }
  
  .main {
    grid-area: m;
    overflow-y: auto;
    
  }
  
  .contact {
    grid-area: c;
    font-size: 20px;
    background-color: rgba(138, 162, 180, 0.21);
    
  }
  
  .photo {
    grid-area: p;
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAIAAAD2HxkiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzA0QzY4M0I2Nzk0MTFFNDgxQUU4NDkyNzI5RDk4NUUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzA0QzY4M0M2Nzk0MTFFNDgxQUU4NDkyNzI5RDk4NUUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozMDRDNjgzOTY3OTQxMUU0ODFBRTg0OTI3MjlEOTg1RSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozMDRDNjgzQTY3OTQxMUU0ODFBRTg0OTI3MjlEOTg1RSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pt/KQccAACv5SURBVHja7F3Zdh25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');
  }
  
  .photoThumbs {
    grid-area: p0;
  }
  
  /*.rooms {*/
  /*grid-area: r;*/
  /*}*/
  .rooms {
    grid-area: r0;
  }
  
  .rooms-icon {
    display: inline-block;
    width: 1em;
    height: 1em;
    background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMjIuNjggMjIuNjgiPjxkZWZzPjxzdHlsZT4uY2xzLTEsLmNscy0yLC5jbHMtNXtmaWxsOm5vbmU7fS5jbHMtMiwuY2xzLTV7c3Ryb2tlOiMxZDFkMWI7fS5jbHMtMntzdHJva2UtbWl0ZXJsaW1pdDozLjg2O3N0cm9rZS13aWR0aDowLjlweDt9LmNscy0ze2ZpbGw6IzFkMWQxYjt9LmNscy00e2NsaXAtcGF0aDp1cmwoI2NsaXAtcGF0aCk7fS5jbHMtNXtzdHJva2Utd2lkdGg6MC4yNXB4O308L3N0eWxlPjxjbGlwUGF0aCBpZD0iY2xpcC1wYXRoIj48cmVjdCBjbGFzcz0iY2xzLTEiIHdpZHRoPSIyMi42OCIgaGVpZ2h0PSIyMi42OCIvPjwvY2xpcFBhdGg+PC9kZWZzPjx0aXRsZT5TS0EtSUNPTlNfUlpfMjkwNzIwMTY8L3RpdGxlPjxnIGlkPSJFYmVuZV8xIiBkYXRhLW5hbWU9IkViZW5lIDEiPjxwb2x5Z29uIGNsYXNzPSJjbHMtMiIgcG9pbnRzPSIyLjg0IDMuNDcgMTkuODQgMy40NyAxOS44NCA5LjcxIDE5Ljg0IDEyLjgzIDE5Ljg0IDE5LjIxIDEyLjYyIDE5LjIxIDEyLjYyIDEyLjgzIDIuODQgMTIuODMgMi44NCAzLjQ3IDIuODQgMy40NyIvPjxyZWN0IGNsYXNzPSJjbHMtMyIgeD0iMTIuMTciIHk9IjkuMSIgd2lkdGg9IjAuOSIgaGVpZ2h0PSIzLjM5Ii8+PHJlY3QgY2xhc3M9ImNscy0zIiB4PSIxMi41IiB5PSIxMi4zOSIgd2lkdGg9IjIuMiIgaGVpZ2h0PSIwLjkiLz48cmVjdCBjbGFzcz0iY2xzLTMiIHg9IjE3LjUiIHk9IjEyLjM5IiB3aWR0aD0iMi43NiIgaGVpZ2h0PSIwLjkiLz48cmVjdCBjbGFzcz0iY2xzLTMiIHg9IjEyLjE3IiB5PSIzLjA1IiB3aWR0aD0iMC45IiBoZWlnaHQ9IjMuMzkiLz48L2c+PGcgaWQ9IlJhaG1lbiI+PGcgY2xhc3M9ImNscy00Ij48cGF0aCBjbGFzcz0iY2xzLTUiIGQ9Ik0yLjgzLjEzQTIuNjMsMi42MywwLDAsMCwuMTMsMi44M3YxN2EyLjYzLDIuNjMsMCwwLDAsMi43MSwyLjcxaDE3YTIuNjMsMi42MywwLDAsMCwyLjcxLTIuNzF2LTE3QTIuNjMsMi42MywwLDAsMCwxOS44NC4xM2gtMTdaIi8+PC9nPjwvZz48L3N2Zz4=');
  }
  
  .floor {
    grid-area: r1;
  }
  
  .furniture {
    grid-area: r2;
  }
  
  .parking {
    grid-area: r3;
  }
  
  .date {
    grid-area: d;
  }
  
  .address {
    font-size: 20px;
    grid-area: a;
  }
  
  .price {
    grid-area: q;
    font-size: 24px;
    background-color: rgba(255, 56, 0, 0.21);
  }
  
  .photoThumbs > img {
    width: calc((100vw / 16 - 5px) * 0.5);
    height: calc((100vw / 16 - 5px) * 0.5);
  }
  
  /*
  p = photo
  r = rooms, etc
  q = price
  c = contact
  a = address
  m = main
  d = date
  */

</style>
