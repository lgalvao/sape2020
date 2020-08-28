<template>
  <div>
    <b-container fluid="true">
      <b-row align-v="start">
        <navegacao style="width: calc(100 * (1vw + 1vh - 1vmin))"/>
      </b-row>

      <b-row>
        <b-button-group class="grupoBotoes">
          <b-btn class="botaoPolo" @click="cancelarFiltroPolos" style="width:8.5rem; text-align: center"
                 :style="{'background-color': poloSelecionado === 0 ? 'rgb(45, 139, 0)' : 'transparent'}">
            Todos os polos
          </b-btn>

          <b-btn class="botaoPolo" v-for="polo in polos" :key="polo.numero" @click="filtrarPolos(polo.numero)"
                 :style="{'background-color': poloSelecionado === polo.numero ? 'rgb(45, 139, 0)' : 'transparent'}">
            <span id="nome-polo">Polo </span>{{ zeroEsquerda(polo.numero) }}
          </b-btn>

        </b-button-group>
      </b-row>

      <b-row style="margin-left: calc(0.4 * (1vw + 1vh - 1vmin))">
        <div v-for="zona in zonas" :key="zona.numero">
          <visao-zonas-item :zona="zona" @zona-clicada="mostrarDetalhes(zona.numero)"/>
        </div>
      </b-row>

      <b-row align-v="end">
        <legenda/>
      </b-row>

      <visao-zonas-modal :zona="zonas[zonaSelecionada]"/>
    </b-container>
  </div>

</template>

<script>
import * as tipos from '../store/mutationtypes'
import {mapActions, mapMutations, mapState} from 'vuex'

import Navegacao from '../componentes/Navegacao'
import Legenda from '../componentes/Legenda'

const VisaoZonasModal = () => import('../componentes/ModalZonas.vue');
const VisaoZonasItem = () => import('../componentes/ZonaItem.vue');

export default {
  name: 'VisaoZonasPolo',
  components: {
    VisaoZonasModal,
    VisaoZonasItem,
    Navegacao,
    Legenda
  },
  data() {
    return {
      zonaSelecionada: '1',
      mapa: null,
      camadaGeo: null,
      camadaFundo: null
    }
  },
  computed: {
    titulo() {
      return this.zonaSelecionada + ' - ' +
          this.zonas[this.zonaSelecionada].municipioSede
    },
    ...mapState({
      zonas: state => state.zonas,
      polos: state => state.polos,
      poloSelecionado: state => state.poloSelecionado
    })
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.atualizarVisao(to.name);
      vm.atualizarPoloSelecionado(0);
      vm.atualizarPolling()
    })
  },
  methods: {
    ...mapActions([
      'atualizarPolling'
    ]),
    ...mapMutations({
      atualizarPoloSelecionado: tipos.ATUALIZAR_POLO_SELECIONADO,
      atualizarVisao: tipos.ATUALIZAR_VISAO,
      mostrarModal: tipos.MOSTRAR_MODAL_ZONA
    }),
    mostrarDetalhes(numZona) {
      this.mostrarModal(true);
      this.zonaSelecionada = numZona
    },
    cancelarFiltroPolos() {
      this.atualizarPoloSelecionado(0)
    },
    filtrarPolos(numeroPolo) {
      this.atualizarPoloSelecionado(numeroPolo)
    },
    zeroEsquerda(numero) {
      const s = '00' + numero;
      return s.substr(s.length - 2)
    }
  }
}
</script>

<style scoped>
.grupoBotoes {
  border: 0;
  background-color: rgba(0, 0, 0, 0.6);
  width: calc(100 * (1vw + 1vh - 1vmin));
  margin-bottom: calc(0.5 * (1vw + 1vh - 1vmin));
  padding-left: calc(1 * (1vw + 1vh - 1vmin));
}

.botaoPolo {
  border: 0;
  border-radius: 0;
  background-color: transparent;
  width: calc(4.3 * (1vw + 1vh - 1vmin));
  min-width: 40px;
  font-family: "Roboto Condensed", sans-serif;
  font-size: 16px;
  text-align: center;
}

@media only screen and (max-width: 1500px) {
  #nome-polo {
    display: none;
  }
}
</style>
