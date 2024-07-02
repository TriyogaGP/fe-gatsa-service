<template>
	<v-footer dark padless app inset class="text-center d-flex flex-column" style="position: fixed;">
		<span class="textNamaSekolah">{{ `© 2021 - ${new Date().getFullYear()} | ${namaSekolah}` }}</span>
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