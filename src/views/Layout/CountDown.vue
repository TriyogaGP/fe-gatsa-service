<template>
	<div class="timer">
		<!-- <div class="day">
			<span class="number">{{ days }}</span>
			<div class="format">{{ wordString.day }}</div>
		</div> -->
		<div class="hour">
			<span :class="hours === 0 && minutes <= 5 ? `numberS` : `number`">{{ hours }}</span>
			<div class="format">{{ wordString.hours }}</div>
		</div>
		<div class="min">
			<span :class="hours === 0 && minutes <= 5 ? `numberS` : `number`">{{ minutes }}</span>
			<div class="format">{{ wordString.minutes }}</div>
		</div>
		<div class="sec">
			<span :class="hours === 0 && minutes <= 5 ? `numberS` : `number`">{{ seconds }}</span>
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
			if(this.hours === 0 && this.minutes === 0 && this.seconds === 0) {
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
<style scoped>
/* Timer Section */
.timer {
  text-align: center;
  font-size: 15pt;
	display: flex;
}

.timer .day,
.timer .hour,
.timer .min,
.timer .sec {
  display: inline-block;
  font-weight: bold;
  text-align: center;
  margin: 0 20px;
}

.timer .day .format,
.timer .hour .format,
.timer .min .format,
.timer .sec .format {
  font-weight: bold;
  font-size: 15px;
  color: #FFF;
}

.timer .number {
  color: #000;
  background: #FFF;
  padding: 0 5px;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.timer .numberS {
  color: #F00;
  background: #FFF;
  padding: 0 5px;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.timer .message {
  font-size: 14px;
  font-weight: 400;
  margin-top: 5px;
}

.timer .status-tag {
  width: 270px;
  margin: 10px auto;
  padding: 8px 0;
  font-weight: 500;
  color: #000;
  text-align: center;
  border-radius: 15px;
}

.timer .status-tag.upcoming {
  background-color: lightGreen;
}

.timer .status-tag.running {
  background-color: gold;
}

.timer .status-tag.expired {
  background-color: silver;
}
</style>