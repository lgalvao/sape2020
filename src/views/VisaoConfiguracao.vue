<template>
  <b-container fluid="true">
    <b-row align-v="start">
      <navegacao titulo-geral="Configurações"/>
    </b-row>

    <b-row style="font-size: large">
      <b-col cols="12" md="7">
        <b-form>
          <b-list-group>
            <b-list-group-item>
              <b-form-checkbox id="cbTelao" v-model="modoTelao">
                Modo telão
              </b-form-checkbox>
            </b-list-group-item>

            <b-list-group-item>
              <b-form-checkbox id="cbAlternar" v-model="alternarEtapas">
                Alternar geração/preparação
              </b-form-checkbox>
            </b-list-group-item>

            <b-list-group-item>
              <b-form-checkbox id="cbTesteAndamentos" v-model="testeAndamentos">
                Teste de andamentos (usado pela equipe de dev)
              </b-form-checkbox>
            </b-list-group-item>

            <b-list-group-item>
              URL do servidor (usado pela equipe de dev):
              <b-form-input id="urlServidor" v-model="url" placeholder="Endereço do servidor"
                            style="width:50%"></b-form-input>
            </b-list-group-item>

          </b-list-group>
        </b-form>
      </b-col>

    </b-row>
  </b-container>
</template>

<script>
import * as tipos from '../store/mutationtypes'
import Navegacao from '../componentes/Navegacao'
import {mapActions, mapMutations, mapState} from 'vuex'

export default {
  name: 'VisaoConfiguracao',
  components: {
    Navegacao
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.atualizarVisao(to.name);
      vm.atualizarPolling()
    })
  },
  computed: {
    url: {
      get() {
        return this._url
      },
      set(valor) {
        this.atualizarUrl(valor)
      }
    },
    ativarNotificacoes: {
      get() {
        return this._ativarNotificacoes
      },
      set(valor) {
        this.atualizarAtivarNotificacoes(valor)
      }
    },
    alternarEtapas: {
      get() {
        return this._alternarEtapas
      },
      set(valor) {
        if (valor === true) {
          this.atualizarModoTelao(false)
        }
        this.atualizarAlternarEtapas(valor)
      }
    },
    modoTelao: {
      get() {
        return this._modoTelao
      },
      set(valor) {
        if (valor === true) {
          this.atualizarAlternarEtapas(false)
        }
        this.atualizarModoTelao(valor)
      }
    },
    testeAndamentos: {
      get() {
        return this._testeAndamentos
      },
      set(valor) {
        this.atualizarTesteAndamentos(valor);
        this.atualizarPolling()
      }
    },
    ...mapState({
      _url: state => state.url,
      _ativarNotificacoes: state => state.ativarNotificacoes,
      _alternarEtapas: state => state.alternarEtapas,
      _modoTelao: state => state.modoTelao,
      _testeAndamentos: state => state.testeAndamentos
    })
  },
  methods: {
    ...mapActions([
      'atualizarPolling'
    ]),
    ...mapMutations({
          atualizarVisao: tipos.ATUALIZAR_VISAO,
          atualizarModoTelao: tipos.ATUALIZAR_MODO_TELAO,
          atualizarAlternarEtapas: tipos.ATUALIZAR_ALTERNAR_ETAPAS,
          atualizarAtivarNotificacoes: tipos.ATIVAR_NOTIFICACOES,
          atualizarUrl: tipos.ATUALIZAR_URL,
          atualizarTesteAndamentos: tipos.ATUALIZAR_TESTE_ANDAMENTOS
        }
    )
  }
}
</script>

<style scoped>

</style>
