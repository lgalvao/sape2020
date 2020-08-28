<template>
  <b-container fluid="true" class="rodape" style="width:100%">
    <b-row class="legenda">
      <legenda-item v-for="andamento in andamentos"
                    :key="andamento.numero"
                    :andamento="andamento"/>
    </b-row>
  </b-container>
</template>

<script>
import LegendaItem from './LegendaItem'
import Copyright from './Copyright'
import {mapGetters} from 'vuex'

export default {
  name: 'Legenda',
  props: ['esconderCopyright'],
  components: {
    Copyright,
    LegendaItem
  },
  computed: {
    ...mapGetters({
      andamentos: 'getAndamentos'
    })
  }
}
</script>

<style scoped>
.rodape {
  background-color: #343a40;
  color: white;
  position: fixed;
  bottom: 0;
  padding-top: 0.5%;
  padding-bottom: 0.5%;
  z-index: 2;
  margin-left: 10px;
}

.legenda {
  padding-top: 0.5%;
  margin-left: 20px;
  padding-bottom: 0.5%;
}

@media only screen and (max-height: 800px) {
  #copyright {
    display: none;
  }
}
</style>
