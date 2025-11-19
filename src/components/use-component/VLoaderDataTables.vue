<template>
  <v-progress-linear
    indeterminate
    class="loading"
    height="3"
    color="#4CAF50"
  />
</template>

<script>
export default {
  props: { },
  data() {
    return{ }
  },
  computed: { },
  methods:{ },
}
</script>

<style>
.loading {
  margin: 2px 0px;
  text-align: center;
}
</style>