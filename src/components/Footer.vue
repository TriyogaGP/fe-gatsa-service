<template>
	<v-footer dark padless app inset class="text-center d-flex flex-column" style="position: fixed;">
		<div class="py-2 white--text">
			© {{new Date().getFullYear()}} - <strong>{{ namaSekolah }}</strong>
		</div>
	</v-footer>
</template>
<script>
export default {
	props: {
    namaSekolah: {
      type: String,
      default: null
    },
  },
	data: () => ({
	}),
}
</script>