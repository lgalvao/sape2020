<template>
  <b-modal v-model="mostrarModal" :title="titulo"
           class="modal-polos"
           hide-footer header-bg-variant="dark"
           header-text-variant="light" size="lg">
    <div class="secao">Zonas</div>

    <item-info-modal>
        <span v-for="(item, index) in zonasPolo" :key="item.numero">
                {{ item.numero }}<span v-if="index !== zonasPolo.length-1">,</span>
        </span>
    </item-info-modal>

    <div class="secao">Situação</div>

    <item-info-modal>
      Progresso: {{ polo.percRealizado }}% ({{ itensRealizados }} de {{ polo.itensTotais }})
      <b-progress class="barra-progresso" :max=polo.itensTotais>
        <b-progress-bar :value="itensRealizados" variant="success" animated></b-progress-bar>
      </b-progress>
    </item-info-modal>

    <item-info-modal>
      Andamento {{ polo.andamento }} - {{ descAndamento(polo.andamento) }}
    </item-info-modal>

    <item-info-modal>
      Período de realização: {{ polo.periodoEtapa }}
    </item-info-modal>

    <div class="secao">Suporte Tecnológico</div>
    <b-table :items="sts" small thead-class="sem-cabecalho"></b-table>

    <div class="secao">Pendências</div>

    <div v-if="!polo.pendencias.length">
      <item-info-modal>Sem pendências</item-info-modal>
    </div>

    <!-- TODO Resolver a questão da codificação já no servidor. -->
    <div v-show="polo.pendencias.length">
      <b-list-group>
        <b-list-group-item v-for="pendencia in polo.pendencias" :key="pendencia.codigo">
          <strong>{{ pendencia.descricao }}</strong> (cód. {{ pendencia.codigo }}) <br/>
          <li v-for="item in pendencia.detalhamento.split('|')" :key="item">
            {{ item.replace(/i¿½i¿½/, "çã") }}
          </li>
        </b-list-group-item>
      </b-list-group>
    </div>
  </b-modal>
</template>

<script>
import ItemInfoModal from './ItemInfoModal'
import {mapGetters, mapMutations, mapState} from 'vuex'
import * as tipos from '../store/mutationtypes'

export default {
  name: 'ModalPolos',
  components: {ItemInfoModal},
  props: {
    polo: {
      numero: 1,
      andamento: 1,
      municipioSede: '',
      situacaoVerificacao: 'ATIVO',
      pendencias: [{
        codigo: '',
        descricao: '',
        detalhamento: ''
      }],
      dataUltimaAtualizacao: '',
      percRealizado: 0,
      itensRestantes: 1,
      itensTotais: 1,
      sts: []
    }
  },
  computed: {
    ...mapGetters({
      andamentos: 'getAndamentos',
      descAndamento: 'getDescAndamento',
      zonas: 'getZonasArray'
    }),
    ...mapState({
      _mostrarModal: state => state.mostrarModalPolo
    }),
    mostrarModal: {
      get() {
        return this._mostrarModal
      },
      set(valor) {
        this.atualizarMostrarModal(valor)
      }
    },
    zonasPolo() {
      return this.zonas.filter(zona => zona.numPolo === this.polo.numero)
    },
    sts() {
      return this.polo.sts
    },
    titulo() {
      if (!this.polo) {
        return ''
      }
      return 'Polo ' +
          this.numPoloFormatado + ' - ' + this.polo.municipioSede
    },
    /* TODO usar formatação nativa no JS */
    numPoloFormatado() {
      if (this.polo) {
        const s = '00' + this.polo.numero;
        return s.substr(s.length - 2)
      } else return '01'
    },
    itensRealizados() {
      return this.polo.itensTotais - this.polo.itensRestantes
    },
    camposTabelaPendencias() {
      return {
        fields: [
          {
            key: 'codigo',
            label: 'Código'
          },
          {
            key: 'descricao',
            label: 'Descrição'
          },
          {
            key: 'detalhamento',
            label: 'Detalhamento'
          }
        ]
      }
    }
  },
  methods: {
    ...mapMutations({
      atualizarMostrarModal: tipos.MOSTRAR_MODAL_POLO
    })
  }
}
</script>

<style scoped>
.modal-polos {
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
