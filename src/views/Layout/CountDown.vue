<template>
	<div>
		<!-- <div class="day">
			<span class="number">{{ days }}</span>
			<div class="format">{{ wordString.day }}</div>
		</div> -->
		<div class="hour">
			<span class="number">{{ hours }}</span>
			<div class="format">{{ wordString.hours }}</div>
		</div>
		<div class="min">
			<span class="number">{{ minutes }}</span>
			<div class="format">{{ wordString.minutes }}</div>
		</div>
		<div class="sec">
			<span class="number">{{ seconds }}</span>
			<div class="format">{{ wordString.seconds }}</div>
		</div>
	</div>
</template>
<script>
export default {
  // props: ['starttime','endtime','trans','kondisi'],
	props: {
    starttime: {
      type: String,
      default: null
    },
    endtime: {
      type: String,
      default: null
    },
    trans: {
      type: String,
      default: null
    },
    kondisi: {
      type: Boolean,
      default: null
    },
	},
  data: () => ({
		timer: '',
		wordString: {},
		start: '',
		end: '',
		interval: '',
		days: '',
		minutes: '',
		hours: '',
		seconds: '',
		message: '',
		statusType: '',
		statusText: '',
	}),
	computed: {
		kondisiTimer(){
			if(this.kondisi === false){
				this.start = new Date(this.starttime).getTime();
				this.end = new Date(this.endtime).getTime();
				this.interval = setInterval(() => {
					this.timerCount(this.start,this.end);
				}, 1000);
			}else{
				this.days = 0
				this.hours = 0
				this.minutes = 0
				this.seconds = 0
			}
      return this.kondisi
		}
	},
	watch: {},
	updated() {
		if(this.kondisiTimer !== false){
			this.days = 0
			this.hours = 0
			this.minutes = 0
			this.seconds = 0
		}
	},
  created() {
		this.wordString = JSON.parse(this.trans);
	},
  mounted(){
		this.days = 0
		this.hours = 0
		this.minutes = 0
		this.seconds = 0
  },
  methods:{
    timerCount(start,end){
			let now = new Date().getTime();
			let passTime =  end - now;
			
			this.days = Math.floor(passTime / (1000 * 60 * 60 * 24));
			this.hours = Math.floor((passTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			this.minutes = Math.floor((passTime % (1000 * 60 * 60)) / (1000 * 60));
			this.seconds = Math.floor((passTime % (1000 * 60)) / 1000);
			if(this.minutes === 0 && this.seconds === 0) {
				this.message = this.wordString.expired;
				this.statusType = "Waktu Habis";
				this.statusText = this.wordString.status.expired;
				this.$emit("selesaiwaktu", true);
				this.kondisiTimer = true
				return clearInterval(this.interval);
			}else if(this.minutes > 0 && this.seconds > 0) {
				this.message = this.wordString.running;
				this.statusType = "Masih Berlangsung";
				this.statusText = this.wordString.status.running;
			}
    },
    calcTime(dist){
			this.days = Math.floor(dist / (1000 * 60 * 60 * 24));
			this.hours = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			this.minutes = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
			this.seconds = Math.floor((dist % (1000 * 60)) / 1000);
    }
  },
}
</script>
<style>
</style>