<style lang="scss">
// domotek: vista del trabajo (figura del G-code, webcam o gráfica de capas)
.bio-vista { position: relative; background: #14171A; border-radius: 12px; overflow: hidden; display: flex; align-items: center; justify-content: center; min-height: 0; height: 100%; }
.bio-vista-tabs { position: absolute; left: 8px; top: 8px; z-index: 1; display: flex; gap: 3px; padding: 3px; border-radius: 10px; background: rgba(14, 16, 19, .85); }
.bio-vista-tabs button { height: 28px; padding: 0 11px; border: none; border-radius: 8px; background: transparent; color: #9AA5AF; font: inherit; font-size: 12px; cursor: pointer; }
.bio-vista-tabs button.activo { background: #262C33; color: #E8EDF1; font-weight: 500; }
.bio-vista-figura { max-width: 88%; max-height: 88%; object-fit: contain; image-rendering: auto; }
.bio-vista-vacia { display: flex; flex-direction: column; align-items: center; gap: 8px; color: #5A6670; font-size: 13px; text-align: center; padding: 0 16px; }
.bio-vista-webcam { width: 100%; height: 100%; }
.bio-vista-webcam .v-card { background: transparent !important; box-shadow: none !important; height: 100%; }
.bio-vista-webcam .v-card__title { display: none; }
.bio-vista-webcam img, .bio-vista-webcam iframe { max-width: 100%; max-height: 100%; }
.bio-vista-capas { position: absolute; inset: 40px 6px 6px; display: flex; }
.bio-vista-capas .v-card { background: transparent !important; box-shadow: none !important; }
.bio-vista-capas .v-card__title { font-size: 12px !important; padding: 0 8px 4px; color: #9AA5AF; }
</style>

<template>
	<div class="bio-vista">
		<div v-if="modos.length > 1" class="bio-vista-tabs" role="tablist">
			<button v-for="m in modos" :key="m" type="button" role="tab" :class="{ activo: modo === m }" :aria-selected="modo === m" @click="modo = m">{{ $t('domotek.jobs.view.' + m) }}</button>
		</div>

		<template v-if="modo === 'figura'">
			<img v-if="imagen" :src="imagen" :alt="$t('domotek.jobs.view.figura')" class="bio-vista-figura">
			<div v-else class="bio-vista-vacia">
				<v-icon size="44" color="#3A444D">mdi-cube-outline</v-icon>
				<span>{{ tieneTrabajo ? $t('domotek.jobs.view.noThumbnail') : $t('domotek.jobs.view.noJob') }}</span>
			</div>
		</template>
		<template v-else-if="modo === 'webcam'">
			<div v-if="webcamActiva" class="bio-vista-webcam"><webcam-panel></webcam-panel></div>
			<div v-else class="bio-vista-vacia">
				<v-icon size="44" color="#3A444D">mdi-camera-outline</v-icon>
				<span>{{ $t('domotek.desktop.noWebcam') }}</span>
			</div>
		</template>
		<div v-else class="bio-vista-capas"><layer-chart></layer-chart></div>
	</div>
</template>

<script>
'use strict'

import QOI from 'qoijs'
import { mapState } from 'vuex'
import { ThumbnailFormat } from '@/store/machine/modelEnums'

export default {
	props: {
		modos: { type: Array, default: () => ['figura'] }
	},
	data() {
		return { modo: this.modos[0], imagen: '', datosPintados: '' }
	},
	computed: {
		...mapState('machine/model', { job: state => state.job }),
		...mapState('settings', ['webcam']),
		webcamActiva() { return !!(this.webcam && this.webcam.url); },
		tieneTrabajo() { return !!(this.job && this.job.file && this.job.file.fileName); },
		miniatura() { // la miniatura más grande que ya tenga datos
			const lista = (this.job && this.job.file && this.job.file.thumbnails) || [];
			let mejor = null;
			lista.forEach(t => {
				if (t && t.data && (!mejor || (t.width * t.height) > (mejor.width * mejor.height))) { mejor = t; }
			});
			return mejor;
		}
	},
	methods: {
		async pintar() {
			const t = this.miniatura;
			if (!t) { this.imagen = this.datosPintados = ''; return; }
			if (t.data === this.datosPintados) { return; }
			if (t.format === ThumbnailFormat.jpeg) {
				this.imagen = 'data:image/jpeg;base64,' + t.data;
			} else if (t.format === ThumbnailFormat.png) {
				this.imagen = 'data:image/png;base64,' + t.data;
			} else if (t.format === ThumbnailFormat.qoi) {
				try {
					const resp = await fetch('data:application/octet-stream;base64,' + t.data);
					const img = QOI.decode(await resp.arrayBuffer(), null, null, 4);
					const canvas = document.createElement('canvas');
					canvas.width = img.width; canvas.height = img.height;
					const ctx = canvas.getContext('2d');
					const datos = ctx.createImageData(img.width, img.height);
					datos.data.set(img.data);
					ctx.putImageData(datos, 0, 0);
					this.imagen = canvas.toDataURL('image/png');
				} catch (e) { this.imagen = ''; }
			}
			this.datosPintados = t.data;
		}
	},
	mounted() { this.pintar(); },
	watch: {
		miniatura: { deep: true, handler() { this.pintar(); } },
		modos(to) { if (!to.includes(this.modo)) { this.modo = to[0]; } }
	}
}
</script>
