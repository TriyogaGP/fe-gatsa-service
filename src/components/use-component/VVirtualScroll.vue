<template>
  <v-virtual-scroll
    :height="VSheight"
    :item-height="VSitemheight"
  >
    <template v-slot:default="{ item }">
      <v-list-item
        :subtitle="`Kode #${item.value}`"
        :title="item.label"
      >
        <template v-slot:prepend>
          <v-icon class="success">{{ VSicon }}</v-icon>
        </template>

        <template v-slot:append>
          <v-btn
            icon="mdi mdi-pencil"
            size="x-small"
            variant="tonal"
            class="mr-1"
            @click="clicked(item)"
          />
          <v-btn
            icon="mdi mdi-close"
            size="x-small"
            variant="tonal"
            class="ml-1"
            @click="clear(item)"
          />
        </template>
      </v-list-item>
    </template>
  </v-virtual-scroll>
</template>

<script>
export default {
  props: {
    iconVs: {
      type: String,
      default: ""
    },
    heightVs: {
      type: String,
      default: "100"
    },
    itemHeightVs: {
      type: String,
      default: "50"
    },
  },
  data() {
    return{
      API_URL: process.env.VUE_APP_BASE_URL_VIEW,
    }
  },
  computed: {
    VSicon() {
      return this.iconVs;
    },
    VSheight() {
      return this.heightVs;
    },
    VSitemheight() {
      return this.itemHeightVs;
    },
  },
  methods:{
    clicked(item){
      this.$emit("proses", item);
    },
    clear(item){
      this.$emit("clear", item);
    }
  },
}
</script>