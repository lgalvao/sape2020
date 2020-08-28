<template>
  <div id="aplicacao" :key="20200827-1">
    <router-view/>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'

export default {
  name: 'aplicacao',
  computed: {
    ...mapState({
      etapa: state => state.etapa
    })
  },
  mounted() {
    this.obterEleicao();
    this.atualizarEtapaRest(this.etapa);
    this.atualizarPolling()
  },
  methods: {
    ...mapActions([
      'obterEleicao',
      'atualizarEtapaRest',
      'atualizarPolling'
    ])
  }
}
</script>

<style>
@font-face {
  font-family: 'Roboto Condensed';
  font-style: normal;
  font-weight: 400;
  src: local('Roboto Condensed'), local('RobotoCondensed-Regular'),
  url('./assets/fontes/roboto-condensed-v18-latin-regular.woff2') format('woff2'),
  url('./assets/fontes/roboto-condensed-v18-latin-regular.woff') format('woff');
}

@font-face {
  font-family: 'Roboto Condensed';
  font-style: normal;
  font-weight: 700;
  src: local('Roboto Condensed Bold'), local('RobotoCondensed-Bold'),
  url('./assets/fontes/roboto-condensed-v18-latin-700.woff2') format('woff2'),
  url('./assets/fontes/roboto-condensed-v18-latin-700.woff') format('woff');
}
</style>

<style scoped>
#aplicacao {
  font-family: "Roboto Condensed", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
