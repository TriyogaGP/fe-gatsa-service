<template>
  <v-select
    v-if="pilihanA === 'select'"
    no-data-text="Tidak ada data"
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
    <template v-slot:item="{ props, item }">
      <v-list :lines="false" density="comfortable" nav class="list-menu">
        <v-list-item v-bind="props" style="width: 100%;">
          <template v-slot:title>
            <span class="textPilihan" v-html="item.title" />
          </template>
        </v-list-item>
      </v-list>
    </template>
  </v-select>
  <v-autocomplete
    v-else-if="pilihanA === 'autocomplete'"
    no-data-text="Tidak ada data"
    :items="AData"
    :label="ALabel"
    variant="solo"
    density="comfortable"
    color="light-black darken-3"
    bg-color="white"
    hide-details="auto"
    :rules="ARules ? [rules.required] : []"
    :clearable="AClearable"
    :disabled="ADisable"
    :readonly="AReadonly"
    @update:modelValue="changed($event)"
  >
    <template v-slot:item="{ props, item }">
      <div class="scroll-select">
        <v-list :lines="false" density="comfortable" nav class="list-menu">
          <v-list-item v-bind="props" style="width: 100%;" :disabled="item.raw.disabled">
            <template v-slot:title>
              <span class="textPilihan" v-html="item.title" />
            </template>
          </v-list-item>
        </v-list>
      </div>
    </template>
  </v-autocomplete>
  <v-autocomplete
    v-else-if="pilihanA === 'autocompleteslot'"
    no-data-text="Tidak ada data"
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
        <v-list-subheader v-if="item.raw.type === 'subheader'">{{ item.raw.text }}</v-list-subheader>
    		<v-divider v-if="item.raw.divider" :thickness="2" color="white" class="border-opacity-100" />
        <v-list-item
          v-if="item.raw.type !== 'subheader' && !item.raw.divider"
          v-bind="props"
        >
          <template v-slot:prepend>
            <v-avatar size="30">
              <v-img :src="item.raw.fotoProfil"></v-img>
            </v-avatar>
          </template>
          <template v-slot:title>
            <span class="textPilihan" v-html="item.raw.text" />
          </template>
          <template v-slot:subtitle>
            <span class="textPilihan" v-html="item.raw.group" />
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
    rulesA: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return{
      API_URL: process.env.VUE_APP_BASE_URL_VIEW,
      rules: {
        required: value => !!value || 'Field ini wajib diisi !'
      },
      focus: false,
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
    ARules() {
      return this.rulesA;
    },
  },
  methods:{
    changed(e){
      this.$emit("ubah", e);
    },
  },
}
</script>

<style>
.scroll-select {
  width: auto !important;
  height: 100% !important;
  max-height: 100px !important;
  overflow-y: auto;
  overflow-x: hidden;
}
.scroll-select::-webkit-scrollbar {
  width: 16px;
}
.scroll-select::-webkit-scrollbar-thumb {
  background-color: #272727;
  border: 5px solid #e1e1f0;
  border-radius: 10rem;
}
.scroll-select::-webkit-scrollbar-track {
  position: absolute;
  right: -3rem;
  top: -50rem;
  background: transparent;
}
</style>

<style scoped>
.textPilihan {
	font-size: 10pt;
  font-weight: 500;
  align-items: center;  
  display: flex;
  line-height: normal;
  margin-bottom: 5px;
}
.list-menu {
  height: 30px;
  overflow: hidden;
  border-radius: 5px;
	background-color: #272727;
  margin: 5px;
  justify-content: left;
  display: flex;
  align-items: center;
}
.list-menu:hover {
	background-color: #4CAF50;
}
</style>