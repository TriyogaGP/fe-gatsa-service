<template>
  <v-btn
    v-if="Bnama !== ''"
    :color="Bcolor"
    :size="Bsize"
    :density="Bmodel"
    depressed
    class="ma-2 white--text text--darken-2"
    :prepend-icon="Bletak === 'start' ? Bicon : ''"
    :append-icon="Bletak === 'end' ? Bicon : ''"
    :disabled="Bdisabled"
    @click="clicked()"
  >
    {{ Bnama }}
  </v-btn>
  <v-btn
    v-else-if="Bnama === ''"
    :color="Bcolor"
    :size="Bsize"
    :density="Bmodel"
    class="white--text text--darken-2"
    :icon="Bicon"
    :disabled="Bdisabled"
    :readonly="Breadonly"
    @click="clicked()"
  />
</template>

<script>
export default {
  props: {
    letakIconButton: {
      type: String,
      default: "start"
    },
    colorButton: {
      type: String,
      default: ""
    },
    iconButton: {
      type: String,
      default: ""
    },
    sizeButton: {
      type: String,
      default: "small"
    },
    modelButton: {
      type: String,
      default: "default"
    },
    namaButton: {
      type: String,
      default: ""
    },
    disabledButton: {
      type: Boolean,
      default: false
    },
    readonlyButton: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return{
      API_URL: process.env.VUE_APP_BASE_URL_VIEW,
    }
  },
  computed: {
    Bletak() {
      return this.letakIconButton;
    },
    Bcolor() {
      return this.colorButton;
    },
    Bicon() {
      return this.iconButton;
    },
    Bsize() {
      return this.sizeButton;
    },
    Bmodel() {
      return this.modelButton;
    },
    Bnama() {
      return this.namaButton;
    },
    Bdisabled() {
      return this.disabledButton;
    },
    Breadonly() {
      return this.readonlyButton;
    },
  },
  methods:{
    clicked(){
      this.$emit("proses");
    }
  },
}
</script>