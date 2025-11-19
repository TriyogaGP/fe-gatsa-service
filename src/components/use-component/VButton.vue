<template>
  <v-tooltip v-if="BtooltipCondition" :location="BtooltipPosition">
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        v-if="Bnama === ''"
        :color="Bcolor"
        :size="Bsize"
        :density="Bmodel"
        class="ma-2 white--text text--darken-2"
        :icon="Bicon"
        :disabled="Bdisabled"
        :readonly="Breadonly"
        @click="clicked()"
      />
    </template>
    <span>{{ Btooltip }}</span>
  </v-tooltip>
  <v-btn
    v-else-if="Bnama !== ''"
    :color="Bcolor"
    :size="Bsize"
    :density="Bmodel"
    variant="elevated"
    depressed
    class="ma-2 white--text text--darken-2"
    :prepend-icon="BPrependicon"
    :append-icon="BAppendicon"
    :disabled="Bdisabled"
    :readonly="Breadonly"
    @click="clicked()"
  >
    {{ Bnama }}
    <template v-slot:loader>
      <v-progress-circular indeterminate :size="15" />
    </template>
    <!-- <v-tooltip v-if="BtooltipCondition" activator="parent" :location="BtooltipPosition">{{ Btooltip }}</v-tooltip> -->
  </v-btn>
  <v-btn
    v-else-if="!BtooltipCondition && Bnama === ''"
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
    iconPrependButton: {
      type: String,
      default: ""
    },
    iconAppendButton: {
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
    tooltipButton: {
      type: String,
      default: ""
    },
    tooltipPositionButton: {
      type: String,
      default: "top"
    },
    tooltipConditionButton: {
      type: Boolean,
      default: false
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
    BPrependicon() {
      return this.iconPrependButton;
    },
    BAppendicon() {
      return this.iconAppendButton;
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
    Btooltip() {
      return this.tooltipButton;
    },
    BtooltipPosition() {
      return this.tooltipPositionButton;
    },
    BtooltipCondition() {
      return this.tooltipConditionButton;
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