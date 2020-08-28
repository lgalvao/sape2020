<template>
  <div>
    <div class="badge-pendencias" v-show="mostrarBadgePendencias">
      {{ numPendencias }}
    </div>

    <b-btn v-b-modal.sapemodal :id="'zona' + zona.numero" v-show="mostrarZona" class="botao-zona"
           :class="{shadow: ativa}" :style="{'background-color': cor(zona.numero),
                    opacity: esmaecimento,
                    color: corTexto,
                    width: largura,
                    height: altura}"
           :disabled="naoVerificar" @click="$emit('zona-clicada', zona.numero)">

      {{ zona.numero }}

      <b-progress class="barra-progresso" v-if="destacaPendencias && ativa">
        <b-progress-bar :value="zona.percRealizado" class="barra-progress-detalhe"/>
      </b-progress>
    </b-btn>
  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex'

export default {
  name: 'ZonaItem',
  props: ['zona', 'largura', 'altura'],
  data() {
    return {
      etapaRecemAlterada: false,
      recemIniciado: false
    }
  },
  created() {
    this.etapaRecemAlterada = false
  },
  mounted() {
    this.recemIniciado = true
  },
  computed: {
    andamento() {
      return this.zona.andamento
    },
    descAndamento() {
      if (this.andamentos[this.andamento - 1]) {
        return this.andamentos[this.andamento - 1].descricao || ''
      } else return ''
    },
    esmaecimento() {
      return this.inativa ? '0.5' : '1.0'
    },
    temPendencias() {
      return (this.zona.pendencias && this.zona.pendencias.length > 0)
    },
    numPendencias() {
      if (!this.zona.pendencias) return 0;
      else return this.zona.pendencias.length
    },
    corTexto() {
      return (this.naoVerificar || this.inativa) ? 'lightgray' : 'white'
    },
    mostrarBadgePendencias() {
      return this.mostrarZona &&
          this.temPendencias &&
          this.destacaPendencias &&
          this.ativa
    },
    destacaPendencias() {
      if (this.andamentos[this.andamento - 1]) {
        return (this.andamentos[this.andamento - 1].destacaPendencias)
      } else return false
    },
    ativa() {
      return (this.zona.situacaoVerificacao === 'ATIVA')
    },
    inativa() {
      return (this.zona.situacaoVerificacao === 'INATIVA')
    },
    naoVerificar() {
      return (this.zona.situacaoVerificacao === 'NV')
    },
    mostrarZona() {
      return (this.poloSelecionado === this.zona.numPolo || this.poloSelecionado === 0)
    },
    ...mapState({
      etapa: state => state.etapa,
      poloSelecionado: state => state.poloSelecionado,
      ativarNotificacoes: state => state.ativarNotificacoes
    }),
    ...mapGetters({
      andamentos: 'getAndamentos',
      cor: 'getCorZona'
    })
  },
  watch: {
    etapa() {
      this.etapaRecemAlterada = true
    },
    andamento() {
      if (this.ativarNotificacoes && !this.etapaRecemAlterada && !this.recemIniciado) {
        let conferente;
        if (this.descAndamento === 'Conferência em andamento') {
          conferente = this.zona.conferente
        }
        this.etapaRecemAlterada = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
$fundo-pendencia: #DE3F00;
$texto-pendencia: white;
$fundo-progresso: darkgray;

.botao-zona {
  font-family: "Roboto Condensed", sans-serif;
  border-radius: 5px;
  border-width: 0;
  margin-bottom: calc(2px + 0.7vmin);
  margin-right: calc(2px + 0.7vmin);
  height: 7.2vmin;
  width: 6.40vmax;
  min-width: 60px;
  min-height: 40px;
  font-size: calc(8px + 2.5vmin);
  z-index: 1
}

.botao-zona:hover {
  filter: brightness(1.3);
}

.barra-progresso {
  height: 4px;
  background-color: $fundo-progresso;
  border-radius: 3px;
}

.barra-progress-detalhe {
  background-color: white;
  z-index: 1;
}

.badge-pendencias {
  font-family: "Roboto Condensed", sans-serif;
  font-size: calc(5px + 1.5vmin);
  background-color: $fundo-pendencia;
  color: $texto-pendencia;
  float: right;
  position: relative;
  margin-right: calc(5px + 0.7vmax);
  margin-left: calc(2px - 5vmax);
  width: calc(5px + 1vmax);
  text-align: center;
  border-bottom-left-radius: 7px;
  border-bottom-right-radius: 7px;
  z-index: 2;
}
</style>
