<template>
  <v-select
    v-if="pilihanA === 'select'"
    :items="AData"
    :label="ALabel"
    variant="solo"
    density="comfortable"
    color="light-black darken-3"
    bg-color="white"
    hide-details
    :clearable="AClearable"
    :disabled="ADisable"
    :readonly="AReadonly"
    @update:modelValue="changed($event)"
  />
  <v-autocomplete
    v-else-if="pilihanA === 'autocomplete'"
    :items="AData"
    :label="ALabel"
    variant="solo"
    density="comfortable"
    color="light-black darken-3"
    bg-color="white"
    hide-details
    :clearable="AClearable"
    :disabled="ADisable"
    :readonly="AReadonly"
    @update:modelValue="changed($event)"
  />
  <v-autocomplete
    v-else-if="pilihanA === 'autocompleteslot'"
    :items="AData"
    :label="ALabel"
    variant="solo"
    density="comfortable"
    color="light-black darken-3"
    bg-color="white"
    hide-details
    :clearable="AClearable"
    :disabled="ADisable"
    :readonly="AReadonly"
    @update:modelValue="changed($event)"
  >
    <template v-slot:chip="{ props, item }">
      <v-chip
        v-if="slotA === 'first'"
        v-bind="props"
        :prepend-avatar="item.raw.fotoProfil"
        :text="item.raw.text"
      />
      <v-chip
        v-else-if="slotA === 'second'"
        v-bind="props"
        :text="item.raw.title"
      >
        <template v-slot:prepend>
          <v-avatar v-if="item.raw.type === 'Gambar'" size="30">
            <v-img :src="item.raw.file"></v-img>
          </v-avatar>
          <v-avatar v-if="item.raw.type === 'File'" size="30">
            <v-icon v-if="item.raw.ext === 'docx'" color="black" icon="mdi mdi-file-word-box" />
            <v-icon v-if="item.raw.ext === 'xlsx'" color="black" icon="mdi mdi-file-excel-box" />
            <v-icon v-if="item.raw.ext === 'pdf'" color="black" icon="mdi mdi-file-pdf-box" />
            <v-icon v-if="item.raw.ext === 'txt'" color="black" icon="mdi mdi-file-document" />
          </v-avatar>
        </template>
      </v-chip>
    </template>

    <template v-slot:item="{ props, item }">
      <v-list v-if="slotA === 'first'" density="compact">
        <v-list-item
          v-bind="props"
          :subtitle="item.raw.group"
        >
          <template v-slot:prepend>
            <v-avatar size="30">
              <v-img :src="item.raw.fotoProfil"></v-img>
            </v-avatar>
          </template>
          <template v-slot:title>
            <span class="textPilihan" v-html="item.raw.text" />
          </template>
        </v-list-item>
      </v-list>
      <v-list v-else-if="slotA === 'second'" density="compact">
        <v-list-item
          v-bind="props"
          :subtitle="item.raw.type"
        >
          <template v-slot:prepend>
            <v-avatar v-if="item.raw.type === 'Gambar'" size="30">
              <v-img :src="item.raw.file"></v-img>
            </v-avatar>
            <v-avatar v-if="item.raw.type === 'File'" size="30">
              <v-icon v-if="item.raw.ext === 'docx'" icon="mdi mdi-file-word-box" />
              <v-icon v-if="item.raw.ext === 'xlsx'" icon="mdi mdi-file-excel-box" />
              <v-icon v-if="item.raw.ext === 'pdf'" icon="mdi mdi-file-pdf-box" />
              <v-icon v-if="item.raw.ext === 'txt'" icon="mdi mdi-file-document" />
            </v-avatar>
          </template>
          <template v-slot:title>
            <span class="textPilihan" v-html="item.raw.title" />
          </template>
        </v-list-item>
      </v-list>
    </template>
  </v-autocomplete>
</template>

<script>
export default {
  props: {
    pilihanA: {
      type: String,
      default: "autocomplete"
    },
    slotA: {
      type: String,
      default: "first"
    },
    dataA: {
      type: Array,
      default: []
    },
    labelA: {
      type: String,
      default: ""
    },
    clearableA: {
      type: Boolean,
      default: false
    },
    disabledA: {
      type: Boolean,
      default: false
    },
    readonlyA: {
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
    APilihan() {
      return this.pilihanA;
    },
    ASlot() {
      return this.slotA;
    },
    AData() {
      return this.dataA;
    },
    ALabel() {
      return this.labelA;
    },
    AClearable() {
      return this.clearableA;
    },
    ADisable() {
      return this.disabledA;
    },
    AReadonly() {
      return this.readonlyA;
    },
  },
  methods:{
    changed(e){
      this.$emit("ubah", e);
    }
  },
}
</script>

<style scoped>
.textPilihan {
	font-size: 0.8125rem;
  font-weight: 500;
  align-items: center;
  display: flex;
  line-height: normal;
  margin-bottom: 5px;
}
</style>