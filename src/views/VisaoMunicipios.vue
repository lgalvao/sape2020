<template>
  <b-container fluid="true">
    <b-row align-v="start">
      <navegacao/>
    </b-row>

    <b-row id="mapa-municipios" align-v="center"/>

    <b-row>
      <legenda/>
    </b-row>

    <visao-municipios-modal :municipio="municipios[municipioSelecionado]"/>
  </b-container>
</template>

<script>
import * as tipos from '../store/mutationtypes'
import {mapActions, mapGetters, mapMutations, mapState} from 'vuex'

import L from 'leaflet'
import Navegacao from '../componentes/Navegacao'
import Legenda from '../componentes/Legenda'

import mapa from '../assets/geo/mapamunicipios.js'
import mapanordeste from '../assets/geo/nordeste.js'

import VisaoMunicipiosModal from '../componentes/ModalMunicipios'

export default {
  name: 'VisaoMunicipios',
  components: {
    VisaoMunicipiosModal,
    Legenda,
    Navegacao
  },
  data() {
    return {
      municipioSelecionado: '2600054',
      mapa: null,
      camadaGeo: null,
      camadaFundo: null,
      camadaFundo2: null,
      info: null
    }
  },
  computed: {
    ...mapState({
      municipios: state => state.municipios,
      etapa: state => state.etapa
    }),
    ...mapGetters({
      andamentos: 'getAndamentos',
      corMunicipio: 'getCorMunicipio',
      andamentosEtapa: 'getAndamentosEtapaMunicipios'
    })
  },
  watch: {
    andamentosEtapa() {
      this.atualizarMapa()
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.atualizarVisao(to.name);
      vm.atualizarPolling();
      vm.atualizarMapa()
    })
  },
  mounted() {
    const opcoesMapa = {
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      zoomSnap: 0.1,
      zoomDelta: 0.1
    };

    if (this.mapa === null || this.mapa === undefined) {
      this.mapa = L.map('mapa-municipios', opcoesMapa)
    }

    if (this.camadaFundo == null) {
      this.camadaFundo = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        id: 'mapbox.light',
        accessToken: 'pk.eyJ1IjoibGVvbmFyZG9nYWx2YW8iLCJhIjoiY2psdjFkYmdiMHEydTNvbzY0c3RpcWVidyJ9.T-CQYKxMiHiPws79nAjETg'
      }).addTo(this.mapa)
    }

    if (this.camadaFundo2 == null) {
      this.camadaFundo2 = L.geoJSON(mapanordeste, {
        style: {fillColor: 'white', color: 'darkgray', weight: 1}
      }).addTo(this.mapa)
    }

    if (this.camadaGeo == null) {
      this.camadaGeo = L.geoJSON(mapa, {
        style: this.estilo,
        onEachFeature: this.atualizarElementos
      }).addTo(this.mapa)
    }

    const bounds = this.camadaGeo.getBounds();
    const zoom = this.mapa.getBoundsZoom(bounds);
    this.mapa.setZoom(zoom - 0.2);
    this.mapa.setMinZoom(zoom);
    this.mapa.setMaxZoom(zoom);
    this.mapa.fitBounds(bounds)
  },
  methods: {
    ...mapActions([
      'atualizarPolling'
    ]),
    ...mapMutations({
          atualizarVisao: tipos.ATUALIZAR_VISAO,
          mostrarModal: tipos.MOSTRAR_MODAL_MUNICIPIO
        }
    ),
    atualizarMapa() {
      this.camadaGeo.remove();

      this.camadaGeo = L.geoJSON(mapa, {
        style: this.estilo,
        onEachFeature: this.atualizarElementos
      }).addTo(this.mapa);

      console.log('Mapa atualizado')
    },
    mostrarDetalhes(e) {
      this.municipioSelecionado = e.target.feature.properties.CODIBGE;
      this.mostrarModal(true)
    },
    obterCor(codIbge) {
      return this.corMunicipio(codIbge) || 'grey'
    },
    estilo(feature) {
      return {
        fillColor: this.obterCor(feature.properties.CODIBGE),
        weight: 2,
        opacity: 1,
        color: 'lightgray',
        fillOpacity: 1
      }
    },
    destacar(e) {
      const layer = e.target;
      const codigo = layer.feature.properties.CODIBGE;
      layer.setStyle({
        weight: 5,
        fillOpacity: 1
      });

      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront()
      }

      this.info = L.popup({
        autoPan: false,
        closeButton: false,
        autoClose: true,
        className: 'estilo-popup-municipio'
      }).setLatLng([-7, -37.8]).openOn(this.mapa);

      const municipio = this.municipios[codigo];
      this.atualizarInfo(municipio.nome + ' (POLO ' + municipio.numPolo + ')')
    },
    cancelarDestaque(e) {
      this.camadaGeo.resetStyle(e.target);
      if (this.info) this.info.remove()
    },
    atualizarElementos(feature, layer) {
      layer.on({
        mouseover: this.destacar,
        mouseout: this.cancelarDestaque,
        click: this.mostrarDetalhes
      });
      const codigo = layer.feature.properties.CODIBGE;
      const municipio = this.municipios[codigo];
      const pontoTranmissaoRemota = municipio.sedePtr;
      if (this.etapa === 6 && pontoTranmissaoRemota) {
        layer.bindTooltip('T', {
              permanent: true,
              direction: 'center',
              opacity: 1.0
            }
        )
      }
    },
    atualizarInfo(conteudo) {
      this.info.setContent(conteudo)
    }
  }
}
</script>

<style>
#mapa-municipios {
  height: 88vh;
  z-index: 1;
}

</style>
