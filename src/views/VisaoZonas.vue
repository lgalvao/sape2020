<template>
  <div>
    <b-container fluid="true">
      <b-row id="navegacao" align-v="start">
        <navegacao/>
      </b-row>

      <b-row id="listazonas">
        <visao-zonas-item v-for="zona in zonas" :key="zona.numero" :zona="zona"
                          @zona-clicada="mostrarDetalhes(zona.numero)"/>
      </b-row>

      <visao-zonas-modal :zona="zonas[zonaSelecionada]"/>

      <b-row id="legenda">
        <legenda/>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Navegacao from '../componentes/Navegacao'
import Legenda from '../componentes/Legenda'

import * as tipos from '../store/mutationtypes'
import {mapActions, mapMutations, mapState} from 'vuex'

const VisaoZonasModal = () => import('../componentes/ModalZonas.vue');
const VisaoZonasItem = () => import('../componentes/ZonaItem.vue');

export default {
  name: 'VisaoZonas',
  components: {
    Legenda,
    Navegacao,
    VisaoZonasModal,
    VisaoZonasItem
  },
  data() {
    return {
      zonaSelecionada: '1'
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.atualizarVisao(to.name);
      vm.atualizarPoloSelecionado(0);
      vm.atualizarPolling()
    })
  },
  computed: {
    ...mapState({
      zonas: state => state.zonas,
      etapa: state => state.etapa
    }),
    titulo() {
      const indiceZonaSel = this.zonaSelecionada;
      return indiceZonaSel + ' - ' + this.zonas[indiceZonaSel].municipioSede
    }
  },
  methods: {
    ...mapActions([
      'atualizarPolling'
    ]),
    ...mapMutations({
      atualizarPoloSelecionado: tipos.ATUALIZAR_POLO_SELECIONADO,
      atualizarVisao: tipos.ATUALIZAR_VISAO,
      atualizarMostrarModal: tipos.MOSTRAR_MODAL_ZONA
    }),
    mostrarDetalhes(numZona) {
      this.zonaSelecionada = numZona;
      this.atualizarMostrarModal(true)
    }
  }
}
</script>

<style scoped>
#listazonas {
  padding-top: 1%;
  padding-left: 2%
}
</style>

<style lang="scss"></style>