<template>
  <b-btn class="zona-item2">
    {{ zona }}
  </b-btn>
</template>

<script>
export default {
  name: "ZonaItem2",
  props: ['zona', 'andamento', 'situacao']
}
</script>

<style scoped lang="scss">
@use "sass:math";

.zona-item2 {
  font-family: $fonte;
  font-size: 2vmax;
  border-radius: 0;
  height: 8vmin;
  border: 0;
}

.zona-item2:hover {
  filter: brightness(1.5);
}
</style>