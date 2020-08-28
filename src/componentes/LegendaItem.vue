<template>
  <!--TODO Tirar uso de tabelas ou usar um componente nativo -->
  <table>
    <tr>
      <td>
        <div class="item-cor" v-b-popover.hover="andamento.detalhamento" :style="{'background-color': andamento.cor}"/>
      </td>
      <td>
        <div class="item-descricao"> {{ andamento.descricao }}</div>
      </td>
    </tr>
  </table>

</template>

<script>
export default {
  name: 'LegendaItem',
  props: {
    andamento: {
      numero: Number,
      cor: String,
      descricao: String,
      destacaPendencias: Boolean,
      detalhamento: String
    }
  }
}
</script>

<style scoped lang="scss">
.item-cor {
  width: calc(20px + 1vmax);
  height: calc(20px + 1vmax);
  border: 0.12vmax solid gray;
  padding-left: 0.5%;
}

.item-descricao {
  font-family: "Roboto Condensed", sans-serif;
  min-width: 90px;
  min-height: 25px;
  width: 6.5vmax;
  padding-left: 0.5%;
  line-height: 1.05;
  font-size: calc(10px + 0.43vmin);
}
</style>
