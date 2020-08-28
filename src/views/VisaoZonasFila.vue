<template>
  <div>
    <b-container fluid="true">
      <b-row align-v="start">
        <navegacao/>
      </b-row>

      <b-row class="faixa-informacoes" style="width:100vw; padding-left: 1.8vw" align-h="center">
        <div>{{ estatisticas }}</div>
      </b-row>

      <b-row id="lista-zonas">
        <visao-zonas-item v-for="zona in zonasOrdenado" :key="zona.numero" :zona="zona"
                          @zona-clicada="mostrarDetalhesZona(zona.numero)"/>
      </b-row>

      <b-row id="legenda">
        <legenda/>
      </b-row>

      <visao-zonas-modal :zona="this.zonas[this.zonaSelecionada]"/>
    </b-container>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations, mapState} from 'vuex'
import * as tipos from '../store/mutationtypes'

import Navegacao from '../componentes/Navegacao'
import Legenda from '../componentes/Legenda'
import lodash from 'lodash'

const VisaoZonasModal = () => import('../componentes/ModalZonas.vue');
const VisaoZonasItem = () => import('../componentes/ZonaItem.vue');

export default {
  name: 'VisaoZonasFila',
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
      etapa: state => state.etapa,
      fila: state => state.fila
    }),
    ...mapGetters({
      andamentos: 'getAndamentos'
    }),
    estatisticas() {
      if (this.etapa === 3) {
        return 'Liberadas: ' + this.liberadas
      } else {
        return 'Liberadas hoje: ' + this.liberadas + ' de ' + this.zonasOrdenado.length + ' ' + this.percentualLiberadas
      }
    },
    zonasOrdenado() {
      const saida = [];

      for (let i = 0; i < this.fila.length; i++) {
        const numZona = this.fila[i].zona;
        saida[i] = this.zonasArray.find(z => (z.numero === numZona))
      }
      for (let i = 0; i < this.zonasArray.length; i++) {
        if (this.zonasArray[i].situacaoVerificacao === 'ATIVA') {
          if (!saida.find(z => z.numero === this.zonasArray[i].numero)) {
            saida.push(this.zonasArray[i])
          }
        }
      }
      return lodash.orderBy(saida,
          ['situacaoVerificacao', 'andamento', 'pendencias.length', 'percRealizado'], ['asc', 'asc', 'desc', 'asc'])
    },
    zonasArray() {
      return Object.values(this.zonas)
    },
    percentualLiberadas() {
      if (this.zonasOrdenado.length === 0) return '';
      return '(' + (this.liberadas / this.zonasOrdenado.length * 100).toFixed() + '%)'
    },
    titulo() {
      return this.zonaSelecionada + ' - ' +
          this.zonas[this.zonaSelecionada].municipioSede
    },
    liberadas() {
      let liberadas = 0;
      const andamentoMaximo = this.andamentos[this.andamentos.length - 1].numero;
      for (const zona of this.zonasOrdenado) {
        if (zona.andamento === andamentoMaximo) {
          liberadas++
        }
      }
      return liberadas
    },
    itensRestantes() {
      let itensRestantes = 0;
      for (const zona in this.zonas) {
        itensRestantes += this.zonas[zona].itensRestantes
      }
      return itensRestantes
    },
    itensTotais() {
      let itensTotais = 0;
      for (const zona in this.zonas) {
        itensTotais += this.zonas[zona].itensTotais
      }
      return itensTotais
    }
  },
  methods: {
    ...mapActions([
      'atualizarPolling'
    ]),
    ...mapMutations({
      atualizarVisao: tipos.ATUALIZAR_VISAO,
      atualizarPoloSelecionado: tipos.ATUALIZAR_POLO_SELECIONADO,
      mostrarModal: tipos.MOSTRAR_MODAL_ZONA
    }),
    mostrarDetalhesZona(numZona) {
      this.mostrarModal(true);
      this.zonaSelecionada = numZona
    }
  }
}
</script>

<style scoped>
.faixa-informacoes {
  background-color: rgb(45, 139, 0);
  font-size: calc(7px + 1.1vmin);
  padding: 0.3vmin;
  color: white;
}

#lista-zonas {
  padding-top: calc(1 * (1vw + 1vh - 1vmin));
  padding-left: calc(1.5 * (1vw + 1vh - 1vmin));
  height: 100%
}
</style>
