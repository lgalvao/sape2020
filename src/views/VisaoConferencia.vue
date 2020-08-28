<template>
  <b-container fluid="true">
    <b-row align-v="start">
      <navegacao/>
    </b-row>

    <b-row align-v="start" :style="{height: alturaMinima}">
      <b-col cols="6">
        <b-row style="font-size:calc(8px + 0.5vmax); background: rgb(45, 139, 0); height:50px">
          <b-col class="mt-2 mb-2 ml-2">
            <b-form-input size="sm" placeholder="Conferente" v-model="filtroConferente"/>
          </b-col>
          <b-col class="m-2">
            <b-form-checkbox size="sm" v-model="esconderConcluidas" style="color:white">Esconder concluídas
            </b-form-checkbox>
          </b-col>
        </b-row>

        <b-row align-v="start" ref="tabela">
          <b-table id="tabela-conferencia" class="ml-3" show-empty striped hover small bordered
                   empty-text="Não há dados atendendo aos filtros"
                   empty-filtered-text="Não há dados atendendo aos filtros" :items="filtrados" :fields="campos"
                   stacked="sm">

            <template slot="ata" slot-scope="data">
              {{ infoAta(data.item.zona).replace('Ata', '') }}
            </template>

            <template slot="polo" slot-scope="data">
              <div style="text-align: center">{{ numPoloFormatado(zonas[data.item.zona].numPolo) }}</div>
            </template>
          </b-table>
        </b-row>
      </b-col>

      <b-col cols="6">
        <b-row align-v="center" id="faixa-informacoes">
          {{ iniciadas }} iniciada{{ iniciadas > 1 ? 's' : '' }} • {{ liberadas }}/122
          liberada{{ liberadas > 1 ? 's' : '' }}
          ({{ Math.floor(liberadas / 122 * 100) }}%)
        </b-row>

        <b-row id="lista-zonas" ref="zonas">
          <visao-zonas-item v-for="zona in zonasOrdenado" :key="zona.numero" :zona="zona"
                            @zona-clicada="mostrarDetalhes(zona.numero)"/>
        </b-row>
      </b-col>
    </b-row>

    <b-row id="legenda" align-v="end" ref="legenda">
      <legenda esconderCopyright="true"/>
    </b-row>

    <visao-zonas-modal :zona="this.zonas[this.zonaSelecionada]"/>
  </b-container>
</template>

<script>
import * as tipos from '../store/mutationtypes'
import {mapActions, mapGetters, mapMutations, mapState} from 'vuex'

import Navegacao from '../componentes/Navegacao'
import Legenda from '../componentes/Legenda'

import VisaoZonasItem from '../componentes/ZonaItem'
import VisaoZonasModal from '../componentes/ModalZonas'

import lodash from 'lodash'

const moment = require('moment');
moment.locale('pt-BR');

export default {
  name: 'VisaoConferencia',
  components: {
    Navegacao,
    VisaoZonasItem,
    VisaoZonasModal,
    Legenda
  },
  data() {
    return {
      filtroConferente: '',
      esconderConcluidas: false,
      zonaSelecionada: '1',
      alturaMinima: '200px'
    }
  },
  updated() {
    let alturaTabela, alturaLista, alturaLegenda;
    if (this.$refs.tabela && this.$refs.zonas) {
      alturaTabela = this.$refs.tabela.clientHeight;
      alturaLista = this.$refs.zonas.clientHeight;
      alturaLegenda = this.$refs.legenda.clientHeight
    }
    if (alturaTabela || alturaLista || alturaLegenda) {
      this.alturaMinima = Math.max(alturaTabela, alturaLista) + 'px'
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
      etapa: state => state.etapa,
      zonas: state => state.zonas,
      polos: state => state.polos,
      fila: state => state.fila
    }),
    ...mapGetters({
      andamentos: 'getAndamentos'
    }),
    campos() {
      const saida = {
        zona: {
          label: 'Zona',
          formatter: (value) => {
            return this.numZonaFormatado(value)
          }
        },
        polo: {},
        dtAptaConferencia: {
          label: 'Apta Conf.',
          formatter: (value) => {
            if (value) return value.replace('/2020', '');
            else return ''
          }
        },
        tempoEspera: {
          label: 'Espera',
          formatter: (value) => {
            return this.duracao(value)
          }
        },
        conferente: {label: 'Conferente'},
        dtConferenciaIniciada: {
          label: 'Conf. início',
          formatter: (value) => {
            if (value) return value.replace('/2020', '');
            else return ''
          }
        },
        dtConferenciaFinalizada: {
          label: 'Conf. final',
          formatter: (value) => {
            if (value) return value.replace('/2020', '');
            else return ''
          }
        },
        tempoConferencia: {
          label: 'Tmp conf',
          formatter: (value) => {
            return this.duracao(value)
          }
        },
        ata: {
          label: 'Ata'
        }

      };
      if (this.etapa === 2) {
        delete saida.dtAptaConferencia;
        delete saida.tempoEspera
      }
      return saida
    },
    filtrados() {
      let retorno = [];
      const fila = this.fila;
      if (!this.filtroConferente && !this.esconderConcluidas) {
        retorno = fila
      }
      if (this.filtroConferente) {
        if (this.esconderConcluidas) {
          retorno = fila.filter(
              item => !item.conferente ||
                  (!item.dtConferenciaFinalizada &&
                      (item.conferente && item.conferente.indexOf(this.filtroConferente) > -1)
                  )
          )
        } else {
          retorno = fila.filter(item => !item.conferente ||
              (item.conferente && item.conferente.indexOf(this.filtroConferente) > -1))
        }
      } else if (!this.filtroConferente) {
        if (this.esconderConcluidas) {
          retorno = fila.filter(item => !item.conferente || (!item.dtConferenciaFinalizada))
        } else {
          retorno = fila
        }
      }
      return retorno
    },
    iniciadas() {
      return this.zonasOrdenado.filter(z => z.andamento > 1).length
    },
    zonasOrdenado() {
      const saida = [];

      for (let i = 0; i < this.fila.length; i++) {
        const numZona = this.fila[i].zona;
        saida[i] = this.zonasArray.find(z => (z.numero === numZona))
      }
      for (let i = 0; i < this.zonasArray.length; i++) {
        if (!saida.find(z => z.numero === this.zonasArray[i].numero)) {
          saida.push(this.zonasArray[i])
        }
      }
      return lodash.orderBy(saida.filter(z => this.mostrarZona(z.numero)),
          ['situacaoVerificacao', 'andamento', 'pendencias.length', 'percRealizado', 'numero'],
          ['asc', 'asc', 'desc', 'asc', 'asc'])
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
    mostrarDetalhes(numZona) {
      this.mostrarModal(true);
      this.zonaSelecionada = numZona
    },
    mostrarZona(numZona) {
      return (this.zonas[numZona].andamento >= 3)
    },
    infoAta(numZona) {
      if (this.tempoDecorrido(this.zonas[numZona].dataGeracaoAta)) {
        if (this.zonas[numZona].situacaoAta.includes('desatualizada')) {
          return this.zonas[numZona].situacaoAta
        } else {
          return this.zonas[numZona].situacaoAta + ' ' +
              this.tempoDecorrido(this.zonas[numZona].dataGeracaoAta)
        }
      } else {
        return this.zonas[numZona].situacaoAta
      }
    },
    tempoDecorrido(data) {
      if (!data) return '';
      return moment(data, 'DD/MM/YYYY HH:mm:ss').fromNow()
    },
    duracao(valor) {
      if (valor === undefined) return '';
      if (valor === 0) return '';

      const horas = Math.floor(valor / 3600);
      const minutos = Math.floor(valor / 60) - horas * 60;
      const segundos = valor % 60;

      let retorno = '';
      if (minutos === 0) {
        retorno = '00:' + (segundos < 10 ? '0' + segundos : segundos)
      } else if (horas === 0) {
        retorno = (minutos < 10 ? '0' + minutos : minutos) + ':' +
            (segundos < 10 ? '0' + segundos : segundos)
      } else {
        retorno = (horas < 10 ? '0' + horas : horas) + ':' +
            (minutos < 10 ? '0' + minutos : minutos) + ':' +
            (segundos < 10 ? '0' + segundos : segundos)
      }

      return retorno
    },
    numZonaFormatado(numZona) {
      const s = '000' + numZona;
      return s.substr(s.length - 3)
    },
    numPoloFormatado(numPolo) {
      const s = '00' + numPolo;
      return s.substr(s.length - 2)
    }
  }
}
</script>

<style scoped>
#tabela-conferencia {
  font-size: calc(6px + 0.4vmax);
  margin-bottom: 80px
}

#lista-zonas {
  padding-top: 1vmin;
  padding-left: 0.6vmax;
  height: 100%
}

#faixa-informacoes {
  background-color: rgb(45, 139, 0);
  font-size: calc(7px + 1.1vmin);
  color: white;
  padding-left: 0.8vmax;
  height: 50px
}

</style>
