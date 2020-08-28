<template>
  <b-container fluid="true">
    <b-row align-v="start">
      <navegacao/>
    </b-row>

    <b-row id="mapa-polos" align-v="center"/>

    <b-row align-v="end">
      <legenda/>
    </b-row>

    <visao-polos-modal :polo="polos[poloSelecionado]"/>
  </b-container>
</template>

<script>
import * as tipos from '../store/mutationtypes'
import {mapActions, mapGetters, mapMutations, mapState} from 'vuex'

import L from 'leaflet'
import Navegacao from '../componentes/Navegacao'
import Legenda from '../componentes/Legenda'

import mapa from '../assets/geo/mapapolos.js'
import mapanordeste from '../assets/geo/nordeste.js'
import VisaoPolosModal from '../componentes/ModalPolos'

export default {
  name: 'VisaoPolos',
  components: {
    VisaoPolosModal,
    Legenda,
    Navegacao
  },
  data() {
    return {
      poloSelecionado: '1',
      mapa: null,
      camadaGeo: null,
      camadaFundo: null,
      camadaFundo2: null,
      info: null
    }
  },
  computed: {
    ...mapState({
      zonas: state => state.zonas,
      polos: state => state.polos,
      etapa: state => state.etapa
    }),
    ...mapGetters({
      andamentos: 'getAndamentos',
      obterCor: 'getCorPolo',
      descAndamento: 'getDescAndamento',
      andamentosEtapaPendencias: 'getAndamentosPendenciasPolos'
    })
  },
  watch: {
    andamentosEtapaPendencias() {
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
      this.mapa = L.map('mapa-polos', opcoesMapa)
    }

    if (this.camadaFundo == null) {
      this.camadaFundo = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        id: 'mapbox.light',
        accessToken: 'pk.eyJ1IjoibGVvbmFyZG9nYWx2YW8iLCJhIjoiY2psdjFkYmdiMHEydTNvbzY0c3RpcWVidyJ9.T-CQYKxMiHiPws79nAjETg'
      }).addTo(this.mapa)
    }

    if (this.camadaFundo2 == null) {
      this.camadaFundo2 = L.geoJSON(mapanordeste, {
        style: {fillColor: 'white', color: 'white', weight: 1}
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
    this.mapa.setZoom(zoom);
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
      mostrarModal: tipos.MOSTRAR_MODAL_POLO
    }),
    atualizarMapa() {
      this.camadaGeo.remove();

      this.camadaGeo = L.geoJSON(mapa, {
        style: this.estilo,
        onEachFeature: this.atualizarElementos
      }).addTo(this.mapa);

      console.log('Mapa atualizado')
    },
    mostrarDetalhes(e) {
      this.poloSelecionado = e.target.feature.properties.id;
      this.mostrarModal(true)
    },
    estilo(feature) {
      return {
        fillColor: this.obterCor(feature.properties.id),
        weight: 3,
        opacity: 1,
        color: 'white',
        fillOpacity: 1
      }
    },
    destacar(e) {
      const layer = e.target;
      const id = layer.feature.properties.id;
      layer.setStyle({
        weight: 7,
        fillOpacity: 1
      });
      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront()
      }

      this.info = L.popup({
        autoPan: false,
        closeButton: false,
        autoClose: true,
        className: 'estilo-popup-polo'
      }).setLatLng([-7.1, -37.8]).openOn(this.mapa);

      this.atualizarInfo(id + ' - ' + this.polos[id].municipioSede)
    },
    cancelarDestaque(e) {
      this.camadaGeo.resetStyle(e.target);
      if (this.info) this.info.remove()
    },
    atualizarInfo(conteudo) {
      this.info.setContent(conteudo)
    },
    atualizarElementos(feature, layer) {
      layer.on({
        mouseover: this.destacar,
        mouseout: this.cancelarDestaque,
        click: this.mostrarDetalhes
      });
      const numPolo = feature.properties.id;
      const polo = this.polos[numPolo];
      const numPendencias = polo.pendencias.length;
      const indiceAndamento = polo.andamento - 1;

      let ajuste = [0, 0];
      switch (numPolo) {
        case 1:
          ajuste = [-8, 4];
          break;
        case 3:
          ajuste = [-10, 0];
          break;
        case 5:
          ajuste = [-10, -7];
          break;
        case 6:
          ajuste = [-35, 5];
          break;
        case 15:
          ajuste = [-10, -8];
          break;
        case 16:
          ajuste = [-17, -19];
          break
      }
      if (this.andamentos[indiceAndamento].destacaPendencias && numPendencias > 0) {
        layer.bindTooltip(numPendencias.toString(), {
              permanent: true,
              direction: 'center',
              opacity: 1.0,
              className: 'estilo-tooltip-polo',
              offset: ajuste
            }
        )
      } else layer.unbindTooltip()
    }
  }
}
</script>

<style>
#mapa-polos {
  height: 88vh;
  z-index: 1;
}

</style>
