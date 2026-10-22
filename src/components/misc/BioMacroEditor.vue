<style lang="scss">
// domotek: editor de macros del modo escritorio (tema oscuro)
.bio-editor {
	height: calc(100vh - 48px - 32px);
	display: grid;
	grid-template-columns: 260px minmax(0, 1fr);
	gap: 12px;
	font-size: 13px;

	button { font-family: inherit; color: inherit; border: none; cursor: pointer; background: none; }
}
.bio-arbol {
	background: var(--bio-sup); border-radius: 12px; padding: 12px; min-height: 0;
	display: flex; flex-direction: column; gap: 8px;
}
.bio-arbol-busca { display: flex; gap: 8px; }
.bio-arbol-busca input {
	flex: 1; min-width: 0; height: 38px; border-radius: 10px; border: 1px solid var(--bio-sup3);
	background: var(--bio-hondo); color: var(--bio-texto); padding: 0 12px; font: inherit; outline: none;
	&:focus { border-color: var(--bio-acento); }
}
.bio-arbol-raices { display: flex; gap: 4px; background: var(--bio-hondo); border-radius: 10px; padding: 3px; }
.bio-arbol-raices button { flex: 1; height: 32px; border-radius: 8px; color: var(--bio-tenue); font-size: 13px; }
.bio-arbol-raices button.activo { background: var(--bio-sup2); color: var(--bio-texto); font-weight: 500; }
.bio-btn-cuadrado {
	width: 38px; height: 38px; border-radius: 10px !important; background: var(--bio-sup2) !important;
	display: flex; align-items: center; justify-content: center; flex: none;
	.v-icon { color: var(--bio-acento) !important; }
}
.bio-arbol-ruta { font-size: 12px; color: var(--bio-tenue); font-family: 'IBM Plex Mono', ui-monospace, monospace; }
.bio-arbol-lista { flex: 1; overflow-y: auto; min-height: 0; margin: 0 -6px; }
.bio-nodo {
	display: flex; align-items: center; gap: 6px; width: 100%; text-align: left;
	height: 28px; padding: 0 8px; border-radius: 7px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
	.v-icon { font-size: 18px; color: var(--bio-tenue) !important; }
	&:hover { background: var(--bio-sup2); }
	&.abierto { background: var(--bio-acento-bg); color: var(--bio-acento); .v-icon { color: var(--bio-acento) !important; } }
	.nombre { overflow: hidden; text-overflow: ellipsis; }
}
.bio-arbol-pie { font-size: 12px; color: var(--bio-tenue); text-align: center; padding: 6px; border: 1px dashed var(--bio-sup3); border-radius: 10px; }
.bio-arbol-pie.arrastrando { border-color: var(--bio-acento); color: var(--bio-acento); }

.bio-edit {
	background: var(--bio-sup); border-radius: 12px; min-height: 0; overflow: hidden;
	display: flex; flex-direction: column;
}
.bio-edit-cab { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-bottom: 1px solid var(--bio-sup2); }
.bio-edit-archivo { font-family: 'IBM Plex Mono', ui-monospace, monospace; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bio-edit-sucio { font-size: 12px; color: var(--bio-calor); white-space: nowrap; }
.bio-edit-btn {
	height: 32px; padding: 0 12px; border-radius: 8px !important; background: var(--bio-sup2) !important; font-size: 12.5px; font-weight: 500;
	display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; text-decoration: none; color: var(--bio-texto) !important;
	.v-icon { font-size: 18px; color: inherit !important; }
	&.acento { background: var(--bio-acento) !important; color: var(--bio-rail) !important; font-weight: 600; }
	&:disabled { opacity: .45; cursor: default; }
}
.bio-edit-cuerpo { flex: 1; min-height: 0; position: relative; }
.bio-edit-cuerpo .vue-codemirror, .bio-edit-cuerpo .CodeMirror { height: 100%; }
.bio-edit-vacio { height: 100%; display: flex; align-items: center; justify-content: center; color: var(--bio-tenue); flex-direction: column; gap: 8px; }
.bio-edit-pie { display: flex; gap: 18px; padding: 8px 14px; border-top: 1px solid var(--bio-sup2); font-size: 12px; color: var(--bio-tenue); }

// Tema de CodeMirror a juego
.cm-s-bio.CodeMirror {
	background: var(--bio-codigo); color: var(--bio-texto);
	font-family: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 13px; line-height: 1.5;
	.CodeMirror-gutters { background: var(--bio-codigo); border-right: 1px solid var(--bio-sup2); }
	.CodeMirror-linenumber { color: var(--bio-apagado); }
	.CodeMirror-cursor { border-left-color: var(--bio-acento); }
	.CodeMirror-activeline-background { background: var(--bio-acento-suave); }
	.CodeMirror-selected, &.CodeMirror-focused .CodeMirror-selected { background: var(--bio-acento-sombra); }
	.cm-comment { color: var(--bio-apagado); font-style: italic; }
	.cm-keyword { color: var(--bio-acento); font-weight: 500; }
	.cm-string { color: var(--bio-amarillo); }
	.cm-number { color: var(--bio-calor); }
	.cm-variable, .cm-builtin { color: var(--bio-lila); }
	.cm-atom { color: var(--bio-azul); }
	.cm-qualifier { color: var(--bio-texto); }
}
</style>

<template>
	<div class="bio-editor" @dragover.prevent="arrastrando = true" @dragleave.prevent="arrastrando = false" @drop.prevent="soltar">
		<section class="bio-arbol" :aria-label="$t('domotek.editor.files')">
			<div class="bio-arbol-raices" role="tablist">
				<button v-for="r in raices" :key="r.ruta" type="button" role="tab" :class="{ activo: raiz === r.ruta }" :aria-selected="raiz === r.ruta" @click="cambiarRaiz(r.ruta)">{{ r.nombre }}</button>
			</div>
			<div class="bio-arbol-busca">
				<label :for="idBuscar" class="d-sr-only">{{ $t('domotek.editor.search') }}</label>
				<input :id="idBuscar" v-model="busqueda" type="search" :placeholder="$t('domotek.editor.search')">
				<button v-if="puedeCrear" type="button" class="bio-btn-cuadrado" :title="$t('domotek.editor.newFile')" :aria-label="$t('domotek.editor.newFile')" @click="nuevoArchivo"><v-icon>mdi-plus</v-icon></button>
				<button type="button" class="bio-btn-cuadrado" :title="$t('domotek.editor.refresh')" :aria-label="$t('domotek.editor.refresh')" @click="recargar"><v-icon>mdi-refresh</v-icon></button>
			</div>
			<span class="bio-arbol-ruta">{{ raiz }}/</span>
			<div class="bio-arbol-lista">
				<template v-for="n in nodosVisibles">
					<button :key="n.ruta" type="button" class="bio-nodo" :class="{ abierto: n.ruta === archivo }" :style="{ paddingLeft: (8 + n.nivel * 16) + 'px' }" @click="pulsarNodo(n)">
						<v-icon v-if="n.carpeta">{{ abiertas[n.ruta] ? 'mdi-chevron-down' : 'mdi-chevron-right' }}</v-icon>
						<v-icon v-else>mdi-file-code-outline</v-icon>
						<span class="nombre">{{ n.nombre }}</span>
					</button>
				</template>
				<div v-if="cargando" class="bio-arbol-ruta pa-2">{{ $t('domotek.editor.loading') }}</div>
				<div v-else-if="!nodosVisibles.length" class="bio-arbol-ruta pa-2">{{ $t('domotek.editor.empty') }}</div>
			</div>
			<div v-if="puedeCrear" class="bio-arbol-pie" :class="{ arrastrando }">{{ $t('domotek.editor.dropHint', [carpetaDestino]) }}</div>
		</section>

		<section class="bio-edit" :aria-label="$t('domotek.editor.editor')">
			<div class="bio-edit-cab">
				<span class="bio-edit-archivo">{{ archivo ? rutaRelativa(archivo) : $t('domotek.editor.noFile') }}</span>
				<span v-if="sucio" class="bio-edit-sucio">● {{ $t('domotek.editor.unsaved') }}</span>
				<div style="flex: 1"></div>
				<a class="bio-edit-btn" href="https://docs.duet3d.com/User_manual/Reference/Gcodes" target="_blank" rel="noopener"><v-icon>mdi-help-circle-outline</v-icon>{{ $t('dialog.fileEdit.gcodeReference') }}</a>
				<button type="button" class="bio-edit-btn" :disabled="!archivo || !esMacro" :title="$t('domotek.editor.runHint')" @click="ejecutar"><v-icon>mdi-play</v-icon>{{ $t('domotek.editor.run') }}</button>
				<button type="button" class="bio-edit-btn acento" :disabled="!archivo || guardando" @click="guardar"><v-icon>mdi-content-save-outline</v-icon>{{ $t('dialog.fileEdit.save') }}</button>
			</div>
			<div class="bio-edit-cuerpo">
				<codemirror v-if="archivo" ref="cm" v-model="texto" :options="cmOptions" @changes="sucio = true" @cursorActivity="moverCursor"></codemirror>
				<div v-else class="bio-edit-vacio">
					<v-icon size="40" color="var(--bio-linea2)">mdi-file-code-outline</v-icon>
					{{ $t('domotek.editor.pickFile') }}
				</div>
			</div>
			<div class="bio-edit-pie">
				<span v-if="archivo">{{ $t('domotek.editor.cursor', [cursor.linea, cursor.columna]) }}</span>
				<span>G-code (RRF 3.4)</span>
				<span>UTF-8</span>
				<div style="flex: 1"></div>
				<span>Ctrl+S {{ $t('domotek.editor.toSave') }}</span>
			</div>
		</section>
	</div>
</template>

<script>
'use strict'

import { codemirror } from 'vue-codemirror'
import 'codemirror/addon/dialog/dialog.js'
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/addon/selection/active-line.js'
import 'codemirror/addon/search/search.js'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/addon/search/jump-to-line.js'
import 'codemirror/lib/codemirror.css'
import '../dialogs/FileEditDialog/gcode-mode.js'

import { mapActions, mapState } from 'vuex'

let contador = 0;

export default {
	components: { codemirror },
	data() {
		return {
			idBuscar: `bio-buscar-${++contador}`,
			raiz: '0:/macros',
			busqueda: '',
			hijos: {},          // ruta carpeta -> [{ nombre, ruta, carpeta }]
			abiertas: {},       // ruta carpeta -> true
			cargando: false,
			archivo: null,
			texto: '',
			sucio: false,
			guardando: false,
			arrastrando: false,
			cursor: { linea: 1, columna: 1 }
		}
	},
	computed: {
		...mapState('machine/model', { macrosDir: state => state.directories.macros, sysDir: state => state.directories.system }),
		nivel() { return this.$store.state.nivelUsuario || 0; },
		rutaMacros() { return (this.macrosDir || '0:/macros').replace(/\/$/, ''); },
		rutaSistema() { return (this.sysDir || '0:/sys').replace(/\/$/, ''); },
		// E500 (nivel 2) solo entra a sys/domoBIO/UserSettings y solo ve Mod_variables.g (igual que SystemFileList)
		sistemaRestringido() { return this.nivel === 2; },
		raizSistema() { return this.sistemaRestringido ? this.rutaSistema + '/domoBIO/UserSettings' : this.rutaSistema; },
		raices() {
			const r = [{ nombre: this.$t('domotek.editor.macros'), ruta: this.rutaMacros }];
			if (this.nivel >= 2) { r.push({ nombre: this.$t('domotek.editor.system'), ruta: this.raizSistema }); }
			return r;
		},
		enSistema() { return this.raices.length > 1 && this.raiz === this.raices[1].ruta; },
		// en System restringido no se crean ni suben archivos
		puedeCrear() { return !(this.enSistema && this.sistemaRestringido); },
		esMacro() {
			return !!this.archivo && this.archivo.startsWith(this.rutaMacros + '/');
		},
		cmOptions() {
			return {
				mode: 'application/x-gcode',
				theme: 'bio',
				indentWithTabs: true,
				inputStyle: 'textarea',
				lineNumbers: true,
				styleActiveLine: true,
				extraKeys: { 'Ctrl-S': () => this.guardar(), 'Cmd-S': () => this.guardar() }
			};
		},
		nodosVisibles() {
			const out = [];
			const q = this.busqueda.trim().toLowerCase();
			const recorrer = (ruta, nivel) => {
				(this.hijos[ruta] || []).forEach(n => {
					if (n.carpeta) {
						const antes = out.length;
						out.push({ ...n, nivel });
						if (this.abiertas[n.ruta] || q) { recorrer(n.ruta, nivel + 1); }
						// con búsqueda, oculta carpetas sin coincidencias cargadas
						if (q && out.length === antes + 1 && !n.nombre.toLowerCase().includes(q)) { out.pop(); }
					} else if (!q || n.nombre.toLowerCase().includes(q)) {
						out.push({ ...n, nivel });
					}
				});
			};
			recorrer(this.raiz, 0);
			return out;
		},
		carpetaDestino() {
			if (this.archivo) { return this.rutaRelativa(this.archivo.substring(0, this.archivo.lastIndexOf('/'))) || '/'; }
			return '/';
		}
	},
	methods: {
		...mapActions('machine', ['getFileList', 'download', 'upload', 'sendCode']),
		rutaRelativa(r) {
			return r.startsWith(this.raiz + '/') ? r.substring(this.raiz.length + 1) : r;
		},
		// Mismas reglas que MacroFileList / SystemFileList según el nivel de usuario
		visible(f, carpeta) {
			if (carpeta.startsWith(this.rutaSistema)) {
				if (this.nivel < 2) { return false; }
				if (!this.sistemaRestringido) { return true; }
				return !f.isDirectory && carpeta === this.raizSistema && f.name === 'Mod_variables.g';
			}
			if (f.isDirectory) {
				if (this.nivel < 2 && ['Enable-Disable_AUTO-CAL', 'Enable-Disable_DOOR_DETECTION', 'On-Off_CHAMBER_FAN'].includes(f.name)) { return false; }
				if (this.nivel < 3 && ['Scripts', 'Run scripts'].includes(f.name)) { return false; }
			}
			return true;
		},
		// ¿Se puede abrir / escribir esta ruta con el nivel actual?
		permitida(ruta) {
			const raiz = this.raices.find(r => ruta.startsWith(r.ruta + '/'));
			if (!raiz) { return false; }
			const partes = ruta.substring(raiz.ruta.length + 1).split('/');
			let carpeta = raiz.ruta;
			return partes.every((parte, i) => {
				const ok = this.visible({ name: parte, isDirectory: i < partes.length - 1 }, carpeta);
				carpeta = `${carpeta}/${parte}`;
				return ok;
			});
		},
		async cargarCarpeta(ruta) {
			this.cargando = true;
			try {
				const lista = (await this.getFileList(ruta)).filter(f => this.visible(f, ruta));
				const nodos = lista
					.map(f => ({ nombre: f.name, ruta: `${ruta}/${f.name}`, carpeta: !!f.isDirectory }))
					.sort((a, b) => (a.carpeta === b.carpeta) ? a.nombre.localeCompare(b.nombre) : (a.carpeta ? -1 : 1));
				this.$set(this.hijos, ruta, nodos);
			} catch (e) {
				this.$set(this.hijos, ruta, []);
			} finally {
				this.cargando = false;
			}
		},
		async pulsarNodo(n) {
			if (n.carpeta) {
				if (this.abiertas[n.ruta]) {
					this.$delete(this.abiertas, n.ruta);
				} else {
					this.$set(this.abiertas, n.ruta, true);
					if (!this.hijos[n.ruta]) { await this.cargarCarpeta(n.ruta); }
				}
				return;
			}
			await this.abrir(n.ruta);
		},
		async abrir(ruta) {
			if (!this.permitida(ruta)) { return; }
			if (this.sucio && !confirm(this.$t('dialog.fileEdit.confirmClose'))) { return; }
			try {
				const contenido = await this.download({ filename: ruta, type: 'text', showProgress: false, showSuccess: false });
				this.archivo = ruta;
				this.texto = (typeof contenido === 'string') ? contenido : '';
				this.$nextTick(() => { this.sucio = false; });
			} catch (e) {
				// el propio download muestra la notificación de error
			}
		},
		async guardar() {
			if (!this.archivo || this.guardando || !this.permitida(this.archivo)) { return; }
			this.guardando = true;
			try {
				await this.upload({ filename: this.archivo, content: new Blob([this.texto]), showProgress: false });
				this.sucio = false;
			} catch (e) {
				// notificación mostrada por upload
			} finally {
				this.guardando = false;
			}
		},
		async ejecutar() {
			if (!this.esMacro) { return; }
			if (this.sucio) { await this.guardar(); }
			this.sendCode(`M98 P"${this.archivo}"`);
		},
		async nuevoArchivo() {
			if (!this.puedeCrear) { return; }
			const nombre = prompt(this.$t('domotek.editor.newFilePrompt'), 'nueva_macro.g');
			if (!nombre) { return; }
			const carpeta = this.archivo ? this.archivo.substring(0, this.archivo.lastIndexOf('/')) : this.raiz;
			const ruta = `${carpeta}/${nombre.replace(/^\/+/, '')}`;
			try {
				await this.upload({ filename: ruta, content: new Blob(['']), showProgress: false });
				await this.cargarCarpeta(carpeta);
				this.sucio = false;
				await this.abrir(ruta);
			} catch (e) { /* notificación mostrada por upload */ }
		},
		async soltar(e) {
			this.arrastrando = false;
			if (!this.puedeCrear) { return; }
			const archivos = Array.from((e.dataTransfer && e.dataTransfer.files) || []);
			if (!archivos.length) { return; }
			const carpeta = this.archivo ? this.archivo.substring(0, this.archivo.lastIndexOf('/')) : this.raiz;
			for (const f of archivos) {
				try { await this.upload({ filename: `${carpeta}/${f.name}`, content: f }); } catch (err) { /* notificado */ }
			}
			await this.cargarCarpeta(carpeta);
		},
		async cambiarRaiz(ruta) {
			if (this.raiz === ruta || !this.raices.some(r => r.ruta === ruta)) { return; }
			this.raiz = ruta;
			if (!this.hijos[ruta]) { await this.cargarCarpeta(ruta); }
		},
		async recargar() {
			const rutas = [this.raiz, ...Object.keys(this.abiertas).filter(r => r.startsWith(this.raiz + '/'))];
			for (const r of rutas) { await this.cargarCarpeta(r); }
		},
		moverCursor(cm) {
			const c = cm.getCursor();
			this.cursor = { linea: c.line + 1, columna: c.ch + 1 };
		},
		antesDeSalir(e) {
			if (this.sucio) { e.preventDefault(); e.returnValue = ''; }
		}
	},
	mounted() {
		this.raiz = this.raices[0].ruta;
		this.cargarCarpeta(this.raiz);
		window.addEventListener('beforeunload', this.antesDeSalir);
	},
	watch: {
		// Al cambiar de usuario (E500 / D500) se vuelve a cargar todo con las reglas nuevas
		nivel() {
			this.hijos = {};
			this.abiertas = {};
			if (this.archivo && !this.permitida(this.archivo)) { this.archivo = null; this.texto = ''; this.sucio = false; }
			if (!this.raices.some(r => r.ruta === this.raiz)) { this.raiz = this.raices[0].ruta; }
			this.cargarCarpeta(this.raiz);
		},
		raizSistema(a, b) {
			if (this.raiz === b) { this.raiz = a; this.cargarCarpeta(a); }
		}
	},
	beforeDestroy() {
		window.removeEventListener('beforeunload', this.antesDeSalir);
	}
}
</script>
