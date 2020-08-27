<template>
  <div>
    <div>
      <h2>搜索附近餐廳</h2>
      <label>
        <gmap-autocomplete @place_changed="setPlace" :options="{fields: ['geometry', 'address_components']}"></gmap-autocomplete>
        <button @click="addMarker">搜索</button>
      </label>
      <br />
    </div>
    <br />
    <div class="main">
      <GmapMap :center="center" :zoom="14" class="item" ref="map" :options="options">
        <GmapMarker
          :key="index"
          v-for="(m, index) in markers"
          :position="m.position"
          @click="opwindow(m.id)"
        >
          <GmapInfoWindow :opened="m.windowStatus">
            <p>{{m.name}}</p>
            <p>{{m.add}}</p>
          </GmapInfoWindow>
        </GmapMarker>
      </GmapMap>
      <div class="item">
        <p>列表</p>
        <ul v-for="m in places" :key="m.place_id">
          <li>{{m.name}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { gmapApi } from "gmap-vue";
import gmapStyles from "@/assets/googleStyles.json";

export default {
  name: "GoogleMap",
  data() {
    return {
      // default to Montreal to keep it simple
      // change this to whatever makes sense
      center: { lat: 24.9816756, lng: 121.4105578 },
      markers: [],
      places: [],
      currentPlace: null,
      Gmap: "",
      options: {
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        disableDefaultUi: false,
        styles: gmapStyles
      }
    };
  },
  computed: { google: gmapApi },
  created: function() {
    this.$gmapApiPromiseLazy({}).then(() => {
      this.autocompleteService = new this.google.maps.places.AutocompleteService();
      this.geocoderService = new this.google.maps.Geocoder();
      this.bounds = new this.google.maps.LatLngBounds();
      console.log("mapOK");
    });
  },
  mounted() {
    this.geolocate();
    const _this = this;
    this.$refs.map.$mapPromise.then(map => {
      map.panTo(_this.center);
    });
  },

  methods: {
    setPlace(place) {
      this.currentPlace = place;
    },
    addMarker() {
      //添加標記
      if (this.currentPlace) {
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng()
        };
        console.log(this.currentPlace);
        this.places = [];
        this.markers = [];
        this.markers.push({
          position: marker,
          name: this.currentPlace.name,
          windowStatus: false
        });
        this.center = marker;
        this.currentPlace = null;
        setTimeout(() => {
          this.search();
        }, 500);
      }
    },
    geolocate: function() {
      navigator.geolocation.getCurrentPosition(position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      });
    },
    search() {
      const _this = this;
      _this.$refs.map.$mapPromise.then(map => {
        //googleApi 只有在此作用域生效
        const service = new _this.google.maps.places.PlacesService(map);
        const search = {
          bounds: map.getBounds(),
          types: ["restaurant"], //餐廳
          radius: "100"
        };
        service.nearbySearch(search, (results, status) => {
          if (status === _this.google.maps.places.PlacesServiceStatus.OK) {
            results.splice(0, 1);
            console.log(results);
            for (let i = 0; i < results.length; i++) {
              let marker = {
                lat: results[i].geometry.location.lat(),
                lng: results[i].geometry.location.lng()
              };
              _this.markers.push({
                position: marker,
                name: results[i].name,
                id: results[i].place_id,
                add: results[i].vicinity,
                windowStatus: false
              });
              _this.places.push(results[i]);
            }
          }
        });
      });
    },
    opwindow(id) {
      const _this = this;
      let windowSta = _this.markers.map(x => x.id).indexOf(id);
      if (_this.markers[windowSta].windowStatus) {
        _this.markers[windowSta].windowStatus = false;
      } else {
        _this.markers[windowSta].windowStatus = true;
      }
    }
  }
};
</script>
<style>
.main {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 300px;
  padding: 15px;
  justify-content: space-around;
}
.item > p {
  text-align: center;
}
.item {
  text-align: left;
  width: 50%;
  height: 400px;
}
</style>