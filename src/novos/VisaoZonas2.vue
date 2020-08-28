<template>
  <div style="margin: auto; width:95%">
    <b-container fluid="true">
      <zona-item2 v-for="indice in 122" :key="indice" :zona="indice"/>
    </b-container>
  </div>
</template>

<script>
import ZonaItem2 from "../novos/ZonaItem2";

export default {
  name: "VisaoZonas2",
  components: {ZonaItem2}
}
</script>

<style scoped>

</style>