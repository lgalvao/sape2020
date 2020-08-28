<template>
  <b-modal v-model="mostrarModal" :title="titulo" class="estilo-modal-municipio"
           hide-footer header-bg-variant="dark" header-text-variant="light" size="lg">
    <div class="secao">Situação</div>

    <item-info-modal>
      Progresso: {{ municipio.percRealizado }}% ({{ itensRealizados }} de {{ municipio.itensTotais }})
      <b-progress class="barra-progresso" :max=municipio.itensTotais>
        <b-progress-bar :value="itensRealizados" variant="success" animated></b-progress-bar>
      </b-progress>
    </item-info-modal>

    <item-info-modal>
      Andamento {{ municipio.andamento }} - {{ descAndamento(municipio.andamento) }}
    </item-info-modal>

    <item-info-modal>
      Período de realização: {{ municipio.periodoEtapa }}
    </item-info-modal>

    <div v-if="municipio.pontoTr">
      <div class="secao">Transmissão remota</div>
      <item-info-modal>
        {{ municipio.pontoTr.numero }} - {{ municipio.pontoTr.descricao }}
      </item-info-modal>
    </div>

    <div class="secao">Suporte Tecnológico</div>
    <b-table :items="municipio.sts" small thead-class="sem-cabecalho"></b-table>

  </b-modal>
</template>

<script>
import ItemInfoModal from './ItemInfoModal'
import {mapGetters, mapMutations, mapState} from 'vuex'
import * as tipos from '../store/mutationtypes'

export default {
  name: 'ModalMunicipios',
  components: {ItemInfoModal},
  props: {
    municipio: {
      codIbge: 2600054,
      andamento: 1,
      situacaoVerificacao: 'ATIVO',
      dataUltimaAtualizacao: '',
      percRealizado: 0,
      itensRestantes: 1,
      itensTotais: 1,
      sts: [],
      sedePtr: false,
      pontoTr: {
        numero: 3,
        descricao: '',
        latitude: '',
        longitude: '',
        tipo: 'PAT'
      }
    }
  },
  computed: {
    ...mapState({
      _mostrarModal: state => state.mostrarModalMunicipio,
      municipios: state => state.municipios
    }),
    ...mapGetters({
      andamentos: 'getAndamentos',
      descAndamento: 'getDescAndamento'
    }),
    mostrarModal: {
      get() {
        return this._mostrarModal
      },
      set(valor) {
        this.atualizarMostrarModal(valor)
      }
    },
    titulo() {
      if (!this.municipio) {
        return ''
      }
      return 'Município ' + this.municipio.nome +
          ' (Polo ' + this.numPoloFormatado + ')'
    },
    numPoloFormatado() {
      const s = '00' + this.municipio.numPolo;
      return s.substr(s.length - 2)
    },
    itensRealizados() {
      return this.municipio.itensTotais - this.municipio.itensRestantes
    }
  },
  methods: {
    ...mapMutations({
      atualizarMostrarModal: tipos.MOSTRAR_MODAL_MUNICIPIO
    })
  }
}
</script>

<style>
.estilo-modal-municipio {
  font-family: "Roboto Condensed", sans-serif;
}

.secao {
  font-weight: bold;
  margin-top: 7px;
}

.barra-progresso {
  height: 25px;
}
</style>
