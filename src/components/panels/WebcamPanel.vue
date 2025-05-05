<style scoped>
/*@import url(https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css);*/


iframe {		 /* 2024_06_Jon_Ander*/
	width: 100%;
	height: 100%;
	border: 3px;
	overflow: hidden;
}

 img {
	max-width: 100%;
	max-height: 100%;
	border-radius: 8px;
	/*padding: 5px;*/
}

.img-container {
	overflow: hidden;
} 

.flip-x {
	-moz-transform: scaleX(-1);
	-o-transform: scaleX(-1);
	-webkit-transform: scaleX(-1);
	transform: scaleX(-1);
	filter: FlipH;
	-ms-filter: "FlipH";
}

.flip-y {
	-moz-transform: scaleY(-1);
	-o-transform: scaleY(-1);
	-webkit-transform: scaleY(-1);
	transform: scaleY(-1);
	filter: FlipV;
	-ms-filter: "FlipV";
}

.rotate-90 {
	transform: rotate(90deg);
	-ms-transform: rotate(90deg);
	-moz-transform: rotate(90deg);
	-webkit-transform: rotate(90deg);
	-o-transform: rotate(90deg);
}

.rotate-180 {
	transform: rotate(180deg);
	-ms-transform: rotate(180deg);
	-moz-transform: rotate(180deg);
	-webkit-transform: rotate(180deg);
	-o-transform: rotate(180deg);
}

.rotate-270 {
	transform: rotate(270deg);
	-ms-transform: rotate(270deg);
	-moz-transform: rotate(270deg);
	-webkit-transform: rotate(270deg);
	-o-transform: rotate(270deg);
}
.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 18px;
}

#video_overlays {
    position:absolute;
    width:160px;
    min-height:40px;
    background-color:#dadada;
    z-index:300000;
    bottom:10px;
    left:10px;
    text-align:center;
}
small{
         opacity:0.5;
		 color:white;
    }
.crosshair_wrapper {
         height:70%;
         top:calc(50% / 2);
         left:calc(50% / 2);
         border-radius:100%;
         border:solid 20px rgba(139, 0, 247,0.3);
         }
.line_x {
         background-color:black;
         width:100%;
         height:1px;
         position:relative;
         top:50%;
         }
.line_y {
         background-color:black;
         height:100%;
         width:1px;
         position:relative;
         left:50%;
         }

/*.hover-img {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity .5s ease, transform 2s cubic-bezier(0,0,.44,1.18);
}

 .product-image:hover .hover-img {
  opacity: 1;
  transform: scale(1.12);
}
 .overlay_5 {
  inset: 0;
  transform: scale(0);
  transition: all .3s ease-in-out;
}

.image_wrapper:hover .overlay_5 {
  transform: scale(1);
}

.icon i {
  border-radius: 50%;
  font-size: 40px;
  color: #8c9e54;
  width: 70px;
  height: 70px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
*/
.watermarked {
  position: relative;
}

.watermarked:after {
  content: "";
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  background-image: url("http://placehold.it/100x100/09f/fff.png"),url("http://placehold.it/100x100/09f/fff.png");
  background-size: 100% 3px, 3px 100%;
  background-position: 0px 50%,50% 0px;
  background-repeat: no-repeat , no-repeat;
  opacity: 0.7;
}
</style>

 <template>		  <!--2024_06_Jon_Ander -->
	<v-card>
		<v-card-title class="pt-2 pb-0">
			<v-card-text class="pa-0 img-container text-center">
				<v-icon class="mr-1"> mdi-webcam </v-icon>
				{{ $t('panel.webcam.caption') }}
				<!-- {{ "USB CAM Image" }} -->
			</v-card-text>
		</v-card-title>
	
		<v-card-text class="pa-2 img-container text-center">
			<v-responsive v-if="webcam.embedded" :aspect-ratio="16/9">
				<iframe :src="webcam.url" :class="classList"></iframe>
			</v-responsive>

			<p v-else :href="webcam.liveUrl ? webcam.liveUrl : 'javascript:void(0)'">
				<img  :alt="$t('panel.webcam.noConex')" :src="active ? url : ''" :class="classList">
			</p>
		</v-card-text>
	</v-card>
</template>

<script>
'use strict'

import { mapState, mapGetters } from 'vuex'

export default {
	computed: {
		...mapState('settings', ['webcam']),
		...mapGetters('machine', ['connector']),
		classList() {
			const result = [];

			if (this.webcam.flip === 'x' || this.webcam.flip === 'both') {
				result.push('flip-x');
			}
			if (this.webcam.flip === 'y' || this.webcam.flip === 'both') {
				result.push('flip-y');
			}

			if (this.webcam.rotation === 90) {
				result.push('rotate-90');
			} else if (this.webcam.rotation === 180) {
				result.push('rotate-180');
			} else if (this.webcam.rotation === 270) {
				result.push('rotate-270');
			}

			return result;
		}
	},
	data() {
		return {
			active: true,
			updateTimer: null,
			url: ''
		}
	},
	activated() {
		this.active = true;
	},
	deactivated() {
		this.active = false;
	},
	methods: {
		updateWebcam() {
			let url = this.webcam.url.replace('[HOSTNAME]', this.connector ? this.connector.hostname : location.hostname);
			if (this.webcam.updateInterval > 0) {
				if (this.webcam.useFix) {
					url += "_" + Math.random();
				} else {
					if (url.indexOf("?") === -1) {
						url += "?dummy=" + Math.random();
					} else {
						url += "&dummy=" + Math.random();
					}
				}
			}
			this.url = url;
		}
	},
	mounted() {
		if (!this.webcam.embedded) {
			this.updateWebcam();
			if (this.webcam.updateInterval > 0) {
				this.updateTimer = setInterval(this.updateWebcam, this.webcam.updateInterval);
			}
		}
	},
	watch: {
		webcam: {
			deep: true,
			handler() {
				if (this.webcam.updateInterval === 0) {
					// For persistent images we need to apply updates independently of the update loop
					this.updateWebcam();
				}
			}
		}
	},
	beforeDestroy() {
		if (this.updateTimer) {
			clearInterval(this.updateTimer);
		}
	}
}
</script>
