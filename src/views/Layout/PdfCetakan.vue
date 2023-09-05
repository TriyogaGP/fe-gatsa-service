<template>
  <div class="ViewCetakan">
    <iframe
      class="mt-1"
      :src="urlSkVal"
      datatype="application/pdf"
      style="width: 100%; height: 100%"
      frameborder="0"
    />
  </div>
</template>
  
<script>
export default {
	props: {
		dialogPdf: {
			type: Boolean,
			default: true
		},
		urlSk: {
			type: String,
			default: ""
		}
	},
	data() {
		return{

		}
	},
	computed: {
		urlSkVal() {
			return this.urlSk;
		}
	},
}
</script>
  
<style scoped>
.v-toolbar{
	height: 50px !important;
}
.v-toolbar__items > .v-btn {
	border-radius: 0;
	height: 85% !important;
	max-height: none;
}
.ViewCetakan {
  height: 450px;
}
@media screen and (min-width: 1920px) {
	.ViewCetakan {
		height: 740px;
  }
}
</style>