<template>
  <div class="min-h-[50vh]" ref="mapElement"></div>
</template>

<script lang="ts">
import 'mapbox-gl/dist/mapbox-gl.css'

// TODO: set developer API in .env

// Props
// TODO: Set coordinates of map
// TODO: Set marker on map
// TODO: Set polygon on map

// Emit
// TODO: Return coordinates of tap / click on map

// API
// TODO: Replace location with coordinates
import mapboxgl, { MapMouseEvent } from 'mapbox-gl'
import { onMounted, ref } from 'vue-demi'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'

export default {
  setup(props, { emit }) {
    const mapElement = ref<HTMLDivElement>()

    //@ts-ignore
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

    const initMap = () => {
      if (!mapElement.value) return

      const map = new mapboxgl.Map({
        container: mapElement.value, // container ID

        style: 'mapbox://styles/mapbox/streets-v11', // style URL

        center: [3.2495710000008273, 50.824616240381374], // starting position [lng, lat]

        zoom: 9, // starting zoom // projection: { name: 'globe' } // display the map as a 3D globe
      }) //set marker on map

      const marker = new mapboxgl.Marker()

        .setLngLat([-74.5, 40])

        .addTo(map)

      const marker2 = new mapboxgl.Marker()

        .setLngLat([3.2495710000008273, 50.824616240381374])

        .addTo(map) //set polygon on map

      map.on('load', () => {
        map.addSource('route', {
          type: 'geojson',

          data: {
            type: 'Feature',

            properties: {},

            geometry: {
              type: 'Polygon',

              coordinates: [
                [
                  [-74.2, 40.1],

                  [-74.6, 40.1],

                  [-74.5, 39.9],

                  [-74.2, 40.1],
                ],
              ],
            },
          },
        })

        map.addLayer({
          id: 'route',

          type: 'fill',

          source: 'route', // reference the data source

          layout: {},

          paint: {
            'fill-color': '#0080ff', // blue color fill

            'fill-opacity': 0.5,
          },
        })

        map.addLayer({
          id: 'outline',

          type: 'line',

          source: 'route',

          layout: {
            'line-join': 'round',

            'line-cap': 'round',
          },

          paint: {
            'line-color': '#000',

            'line-width': 3,
          },
        })
      }) //props //set coordinates of map

      map.addControl(
        new MapboxGeocoder({
          accessToken: mapboxgl.accessToken,

          mapboxgl: mapboxgl,
        }),
      ) //emit //TODO return coordinates of tap / click on map //API //TODO: Replace location with coordinates

      function add_marker(event: MapMouseEvent) {
        emit('marker', event.lngLat)

        marker
          .setLngLat(event.lngLat)

          .addTo(map)
      }

      map.on('click', add_marker)
    }

    onMounted(() => {
      initMap()
    })

    return {
      mapElement,
    }
  },
}
</script>
