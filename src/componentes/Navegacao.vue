<template>
  <div style="width:100%">
    <b-navbar toggleable="md" type="dark" variant="dark" class="barra">
      <b-navbar-toggle target="nav_collapse"/>
      <b-navbar-brand class="barra brand">SAPE</b-navbar-brand>

      <b-collapse id="nav_collapse" is-nav>
        <b-nav-text id="titulo" class="barra">
          {{ titulo }}<span class="nome-etapa">{{ nomeEtapa }}</span>
          <span id="data">
            <span v-if="dataUltimaAtualizacao" class="data-atualizacao">
              <b-icon icon="clock" scale="1.3" class="icone-relogio"/>
              {{ dataUltimaAtualizacao }}&nbsp;
            </span>
            <span v-if="tempoUltimaAtualizacao" class="tempo-ult-atualizacao">
            {{ tempo }}
            </span>
          </span>
        </b-nav-text>

        <b-navbar-nav class="ml-auto barra-menus">
          <b-nav-item-dropdown text="Etapa" class="menu" right>
            <b-dropdown-item :active="this._etapa === 1" @click="atualizarEtapa(1)">Geração
            </b-dropdown-item>
            <b-dropdown-item :active="this._etapa === 2" @click="atualizarEtapa(2)">Preparação
            </b-dropdown-item>
            <b-dropdown-item :active="this._etapa === 3" @click="atualizarEtapa(3)">Vistoria
            </b-dropdown-item>
            <b-dropdown-item :active="this._etapa === 4" @click="atualizarEtapa(4)">Votação
            </b-dropdown-item>
            <b-dropdown-item :active="this._etapa === 6" @click="atualizarEtapa(6)">Totalização
            </b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown text="Visão" class="menu" right>
            <b-dropdown-header class="menu-subdivisao">Acompanhamento</b-dropdown-header>
            <b-dropdown-item to="/zonas">Zonas</b-dropdown-item>
            <b-dropdown-item to="/polos">Polos</b-dropdown-item>
            <b-dropdown-item to="/municipios">Municípios</b-dropdown-item>
            <b-dropdown-item to="zonaspolo">Zonas por polo</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-header class="menu-subdivisao">Conferência</b-dropdown-header>
            <b-dropdown-item to="/zonasfila">Zonas por andamento</b-dropdown-item>
            <b-dropdown-item to="/conferencia">Zonas conferência</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item to="/configuracao">Configurações</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

        <img class="logotipo" src="../assets/img/logotre.png" alt="logotipo">
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapState} from 'vuex'

const moment = require('moment');
moment.locale('pt-BR');

export default {
  name: 'Navegacao',
  props: {
    tituloGeral: String,
    mostrarEtapa: Boolean
  },
  data() {
    return {tempo: ''}
  },
  watch: {
    _ciclos() {
      if (this._ciclos > 1) {
        /* Criar função para isso */
        this.tempo = 'há ' + this._ciclos * this._tempoCiclo / 1000 + ' segundos'
      } else {
        return 'há poucos segundos'
      }
    }
  },
  computed: {
    ...mapState({
      _etapa: state => state.etapa,
      _nomeEleicao: state => state.nomeEleicao,
      _nomeEtapa: state => state.nomeEtapa,
      _dataUltimaAtualizacao: state => state.dataUltimaAtualizacao,
      _ciclos: state => state.ciclos,
      _tempoCiclo: state => state.tempoAtualizacao
    }),
    ...mapGetters({
      ultimaAtualizacao: 'getUltimaAtualizacao'
    }),
    titulo() {
      return this.tituloGeral || this._nomeEleicao
    },
    nomeEtapa() {
      if (this.mostrarEtapa || !this.tituloGeral) return this._nomeEtapa; else return ''
    },
    dataUltimaAtualizacao() {
      if (!this.tituloGeral) return this._dataUltimaAtualizacao; else return ''
    }
  },
  methods: {
    ...mapActions({
      atualizarPolling: 'atualizarPolling',
      atualizarEtapa: 'atualizarEtapaRest'
    }),
    tempoUltimaAtualizacao() {
      const agora = moment();
      const ultima = moment(this.dataUltimaAtualizacao(), 'DD/MM/YYYY HH:mm:ss');
      return moment.duration(agora.diff(ultima)).milliseconds()
    }
  }
}
</script>

<style scoped>
@media only screen and (max-width: 800px) {
  #titulo {
    display: none;
  }
}

@media only screen and (max-width: 1200px) {
  #data {
    display: none;
  }
}

.barra {
  font-family: "Roboto Condensed", sans-serif;
  font-size: calc(10px + 0.7vw + 0.7vmin);
  padding-left: calc(0.9 * (1vw + 1vh - 1vmin));
  padding-top: 1.7vmin;
  padding-bottom: 0.3vmin;
  height: 90px;
  z-index: 3;
}

.barra-menus {
  font-size: 80%;
  z-index: 100
}

.logotipo {
  width: 4.5vmin;
  margin-left: calc(1 * (1vw + 1vh - 1vmin));
  margin-right: calc(0.7 * (1vw + 1vh - 1vmin))
}

.brand {
  font-family: 'Roboto Condensed Bold', sans-serif;
  font-weight: bold;
  z-index: 3
}

.nome-etapa {
  font-family: "Roboto Condensed Bold", sans-serif;
  font-weight: bold;
  padding-left: calc(1.5 * (1vw + 1vh - 1vmin));
  color: white;
  opacity: 0.8;
}

.icone-relogio {
  margin-right: 7px;
  margin-bottom: 2px
}

.menu {
  background-color: #343a40;
  z-index: 3
}

.menu-subdivisao {
  font-size: 75%
}

.tempo-ult-atualizacao {
  font-size: 20px;
}

.data-atualizacao {
  font-family: "Roboto Condensed", sans-serif;
  padding-left: calc(1.5 * (1vw + 1vh - 1vmin));
  color: white;
  opacity: 0.8;
  font-size: 80%;
}
</style>
