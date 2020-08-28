<template>
  <b-modal v-model="mostrarModal" id="sapemodal" class="modal-zonas" :title="titulo"
           hide-footer header-bg-variant="dark" header-text-variant="light" size="lg"
           @hidden="esconderHistorico">
    <div class="secao">Situação</div>

    <item-info-modal>
      Progresso: {{ zona.percRealizado }}% ({{ itensRealizados }} de {{ zona.itensTotais }})
      <b-progress class="barra-progresso-modal" :max=zona.itensTotais>
        <b-progress-bar :value="itensRealizados" variant="success" animated/>
      </b-progress>
    </item-info-modal>

    <item-info-modal>
      Andamento {{ zona.andamento }} - {{ descAndamento(zona.andamento) }}
    </item-info-modal>

    <item-info-modal>
      Período de realização: {{ zona.periodoEtapa }}
    </item-info-modal>

    <div class="secao" style="margin-bottom: 8px">Suporte Tecnológico</div>
    <b-table :items="sts" small thead-class="sem-cabecalho"/>
    <b-list-group-item style="margin-top:-15px">
      Ramal do polo: {{ _contatos[zona.numPolo].ramal }}
    </b-list-group-item>

    <div class="secao">Pendências</div>
    <div v-if="zona.pendencias.length === 0">
      <item-info-modal>Sem pendências</item-info-modal>
    </div>

    <div v-show="zona.pendencias.length !== 0">
      <b-list-group>
        <b-list-group-item v-for="pendencia in zona.pendencias" :key="pendencia.codigo">
          <strong>{{ pendencia.descricao }}</strong> (cód. {{ pendencia.codigo }}) <br/>
          <ul>
            <li v-for="item in pendencia.detalhamento.split('|')" :key="item">
              {{ item.replace(/i¿½i¿½/, "çã") }}
            </li>
          </ul>
        </b-list-group-item>
      </b-list-group>
    </div>

    <!-- TODO usar constantes para textos fixos -->
    <div class="secao">Conferência</div>
    <b-list-group v-if="zona.situacaoConferencia !== 'Não conferida'">
      <b-list-group-item>{{ zona.conferente }}</b-list-group-item>
      <b-list-group-item>{{ zona.dataConferencia }}</b-list-group-item>
      <b-list-group-item>{{ zona.situacaoConferencia }}</b-list-group-item>
      <b-list-group-item v-if="zona.obsConferencia">Obs.: {{ zona.obsConferencia }}</b-list-group-item>
    </b-list-group>

    <item-info-modal v-if="zona.situacaoConferencia === 'Não conferida'">
      {{ zona.dataConferencia === '' ? zona.situacaoConferencia : '' }}
    </item-info-modal>

    <item-info-modal v-if="historicoConferencias.length">
      <b-btn v-b-toggle.historico size="sm" @click="mostrandoHistorico = !mostrandoHistorico">
        Histórico
        <b-icon v-if="!mostrandoHistorico" name="chevron-down" scale="0.7"/>
        <b-icon v-if="mostrandoHistorico" name="chevron-up" scale="0.7"/>
      </b-btn>

      <b-collapse id="historico" v-show="mostrandoHistorico">
        <div class="secao" style="margin-top:8px">Histórico de conferências</div>
        <b-table :items="historicoConferencias" small thead-class="sem-cabecalho" :fields="campos"
                 style="margin-bottom:-20px;font-size:15px"></b-table>
      </b-collapse>
    </item-info-modal>

    <div v-if="!(zona.situacaoRelatorios === 'NA')">
      <div class="secao">Relatórios</div>
      <b-list-group>
        <b-list-group-item>
          {{ zona.situacaoRelatorios }}
        </b-list-group-item>
        <b-list-group-item v-if="zona.detRelatorios.length > 0">
          <b-table :items="zona.detRelatorios" :fields="camposRelatorios" small style="margin-bottom: -5px"></b-table>
        </b-list-group-item>
      </b-list-group>
    </div>

    <div v-if="!(zona.situacaoAta === 'NA')">
      <div class="secao">Ata</div>
      <b-list-group>
        <b-list-group-item>
          {{ zona.situacaoAta }}
        </b-list-group-item>

        <b-list-group-item v-if="zona.dataGeracaoAta">
          Últ. geração: {{ zona.dataGeracaoAta }} ({{ tempoGeracaoAta }})
        </b-list-group-item>

        <b-list-group-item v-if="zona.detAta.length > 0">
          <b-table :fields="camposAta" :items="zona.detAta" small style="margin-bottom: -10px"></b-table>
        </b-list-group-item>
      </b-list-group>
    </div>
  </b-modal>
</template>

<script>
import ItemInfoModal from './ItemInfoModal'
import * as tipos from '../store/mutationtypes'
import {mapGetters, mapMutations, mapState} from 'vuex'

const moment = require('moment');
moment.locale('pt-BR');

export default {
  name: 'ModalZonas',
  components: {ItemInfoModal},
  props: {
    zona: {
      type: Object,
      default: function () {
        return {
          numero: 1,
          andamento: 1,
          municipioSede: 'RECIFE',
          numPolo: 'Number',
          situacaoVerificacao: '',
          pendencias: [],
          dataUltimaAtualizacao: '',
          percRealizado: 0,
          itensRestantes: 0,
          itensTotais: 0,
          situacaoAta: '',
          dataGeracaoAta: '',
          situacaoConferencia: '',
          dataConferencia: '',
          conferente: '',
          situacaoRelatorios: '',
          detRelatorios: [],
          sts: [],
          periodoEtapa: '',
          histConferencias: []
        }
      }
    }
  },
  data() {
    return {mostrandoHistorico: false}
  },
  computed: {
    ...mapState({
      _mostrarModal: state => state.mostrarModalZona,
      _contatos: state => state.contatos
    }),
    ...mapGetters({
      andamentos: 'getAndamentos',
      descAndamento: 'getDescAndamento'
    }),
    campos() {
      return {
        turno: {label: 'Turno'},
        etapa: {label: 'Etapa'},
        conferente: {label: 'Conferente'},
        observacao: {label: 'Observações'}
      }
    },
    camposRelatorios() {
      return {
        nome: {label: 'Relatório'},
        municipio: {label: 'Município'},
        eleicao: {label: 'Eleição'}
      }
    },
    camposAta() {
      return {
        etapa: {},
        situacao: {label: 'Situação'}
      }
    },
    mostrarModal: {
      get() {
        return this._mostrarModal
      },
      set(valor) {
        this.atualizarMostrarModal(valor)
      }
    },
    titulo() {
      return 'Zona ' +
          this.numZonaFormatado +
          ' - ' +
          this.zona.municipioSede +
          ' (Polo ' +
          this.zona.numPolo +
          ')'
    },
    sts() {
      return this.zona.sts
    },
    historicoConferencias() {
      return this.zona.histConferencias
    },
    numZonaFormatado() {
      const s = '000' + this.zona.numero;
      return s.substr(s.length - 3)
    },
    itensRealizados() {
      return this.zona.itensTotais - this.zona.itensRestantes
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
    },
    tempoGeracaoAta() {
      return moment(this.zona.dataGeracaoAta, 'DD/MM/YYYY HH:mm:ss').fromNow()
    }
  },
  methods: {
    ...mapMutations({
      atualizarMostrarModal: tipos.MOSTRAR_MODAL_ZONA
    }),
    esconderHistorico() {
      this.mostrandoHistorico = false
    }
  }
}
</script>

<style scoped>
.modal-zonas {
  font-family: "Roboto Condensed", sans-serif;
  border: 0;
}

.secao {
  font-weight: bold;
  margin-top: 7px;
}

.barra-progresso-modal {
  margin-top: 5px;
  height: 10px;
}
</style>