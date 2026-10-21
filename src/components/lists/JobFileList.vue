<style scoped>
.list-icon {
	display: flex;
	flex-shrink: 0;
	align-content: center;
	justify-content: center;
	width: 48px;
}

.icon-menu {
	min-width: 0 !important;
}
</style>

<template>
	<div>
		<v-toolbar class="blue lighten-5">
			<sd-card-btn v-if="volumes.length > 1" v-model="volume" class="hidden-sm-and-down"></sd-card-btn>
			<directory-breadcrumbs v-model="directory"></directory-breadcrumbs>

			<v-spacer></v-spacer>

			<v-btn class="hidden-sm-and-down mr-3" :disabled="uiFrozen" :elevation="1" @click="showNewDirectory = true">
				<v-icon class="mr-1">mdi-folder-plus</v-icon> {{ $t('button.newDirectory.caption') }}
			</v-btn>
			<v-btn class="hidden-sm-and-down mr-3" color="info" :loading="loading || fileinfoProgress !== -1" :disabled="uiFrozen" :elevation="1" @click="refresh">
				<v-icon class="mr-1">mdi-refresh</v-icon> {{ $t('button.refresh.caption') }}
			</v-btn>
			<upload-btn class="hidden-sm-and-down" :elevation="1" :directory="directory" target="gcodes" color="primary"/>
		</v-toolbar>
		
		<base-file-list ref="filelist" v-model="selection" :headers="headers" :directory.sync="directory" :filelist.sync="filelist" :loading.sync="loading" sort-table="jobs" @directoryLoaded="onDirectoryLoaded" @fileClicked="fileClicked" no-files-text="list.jobs.noJobs">
			<v-progress-linear slot="progress" :indeterminate="fileinfoProgress === -1" :value="(fileinfoProgress / filelist.length) * 100"/>

			<template #folder="{ item }">
				<div :class="{ 'list-icon mr-2': hasThumbnails, 'mr-1': !hasThumbnails }">
					<v-icon> mdi-folder</v-icon>
				</div>
				{{ item.name }}
			</template>
			<template #file="{ item }">
				<div :class="{ 'list-icon mr-2': hasThumbnails, 'mr-1': !hasThumbnails }">
					<v-icon v-if="!(item.thumbnails instanceof Array) || !getSmallThumbnail(item.thumbnails)">
						{{ (item.thumbnails instanceof Array) ? 'mdi-file' : 'mdi-asterisk' }}
					</v-icon>
					<v-menu v-else right offset-x open-on-hover open-on-focus close-on-content-click :min-width="16">
						<template #activator="{ on, attrs }">
							<div v-bind="attrs" v-on="on" @click.stop="" tabindex="0">
								<thumbnail-img :thumbnail="getSmallThumbnail(item.thumbnails)" icon/>
							</div>
						</template>

						<v-card class="d-flex">
							<thumbnail-img :thumbnail="getBigThumbnail(item.thumbnails)"/>
						</v-card>
					</v-menu>
				</div>
				{{ item.name }}
			</template>

			<template #context-menu>
				<v-list-item v-show="isFile && !isPrinting" @click="loadES() , loadUV(), loadEMD() , start">    
					<v-icon class="mr-1">mdi-play</v-icon> {{ $t('list.jobs.start') }}
				</v-list-item>
				<v-list-item v-show="isFile && !isPrinting" @click="simulate">
					<v-icon class="mr-1">mdi-fast-forward</v-icon> {{ $t('list.jobs.simulate') }}
				</v-list-item>
				<v-list-item v-show="isFile" v-for="(menuItem, index) in contextMenuItems.jobFileList" :key="index" @click="contextMenuAction(menuItem)">
					<v-icon class="mr-1">{{ menuItem.icon }}</v-icon> {{ menuItem.name }}
				</v-list-item>
			</template>
		</base-file-list>

		<v-speed-dial v-model="fab" bottom right fixed direction="top" transition="scale-transition" class="hidden-md-and-up">
			<template #activator>
				<v-btn v-model="fab" dark color="primary" fab>
					<v-icon v-if="fab">mdi-close</v-icon>
					<v-icon v-else>mdi-dots-vertical</v-icon>
				</v-btn>
			</template>

			<v-btn fab :disabled="uiFrozen" @click="showNewDirectory = true">
				<v-icon>mdi-folder-plus</v-icon>
			</v-btn>

			<v-btn fab color="info" :loading="loading || fileinfoProgress !== -1" :disabled="uiFrozen" @click="refresh">
				<v-icon>mdi-refresh</v-icon>
			</v-btn>

			<upload-btn fab dark :directory="directory" target="gcodes" color="primary">
				<v-icon>mdi-cloud-upload</v-icon>
			</upload-btn>
		</v-speed-dial>

		<new-directory-dialog :shown.sync="showNewDirectory" :directory="directory"/>
		<confirm-dialog :shown.sync="startJobDialog.shown" :title="startJobDialog.title" :prompt="startJobDialog.prompt" @confirmed="loadES(),loadUV(), loadEMD(), start(startJobDialog.item)"/>
	</div>
</template>

<script>
'use strict'

import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

import i18n from '@/i18n'
import { isPrinting } from '@/store/machine/modelEnums.js'
import { DisconnectedError, InvalidPasswordError } from '@/utils/errors.js'
import Path, { escapeFilename } from '@/utils/path.js'

export default {
	computed: {
		...mapState('machine/cache', ['fileInfos']),
		...mapState('machine/model', {
			gCodesDirectory: state => state.directories.gCodes,
			lastJobFile: state => state.job.lastFileName,
			status: state => state.state.status,
			volumes: state => state.volumes,
		}),
		...mapState('settings', ['language']),
		...mapState('uiInjection', ['contextMenuItems']),
		...mapGetters(['isConnected', 'uiFrozen']),
		headers() {
			return [
				{
					class: 'pl-0',
					cellClass: 'pl-0',
					text: i18n.t('list.baseFileList.fileName'),
					value: 'name'
				},
				{
					text: i18n.t('list.baseFileList.size'),
					value: 'size',
					unit: 'bytes'
				},
				{
					text: i18n.t('list.baseFileList.lastModified'),
					value: 'lastModified',
					unit: 'date'
				},
				{
					text: i18n.t('list.jobs.height'),
					value: 'height',
					precision: 2,
					unit: 'mm'
				},
				{
					text: i18n.t('list.jobs.layerHeight'),
					value: 'layerHeight',
					precision: 2,
					unit: 'mm'
				},
				{
					text: i18n.t('list.jobs.filament'),
					value: 'filament',
					unit: 'filaments'
				},
				{
					text: i18n.t('list.jobs.printTime'),
					value: 'printTime',
					unit: 'time'
				},
				{
					text: i18n.t('list.jobs.simulatedTime'),
					value: 'simulatedTime',
					unit: 'time'
				},
				{
					text: i18n.t('list.jobs.generatedBy'),
					value: 'generatedBy'
				}
			];
		},
		isFile() {
			return (this.selection.length === 1) && !this.selection[0].isDirectory;
		},
		isPrinting() {
			return isPrinting(this.status);
		},
		loading: {
			get() { return this.loadingValue || this.fileinfoProgress !== -1; },
			set(value) { this.loadingValue = value; }
		},
		volume: {
			get() { return Path.getVolume(this.directory); },
			set(value) { this.directory = (value === Path.getVolume(this.gCodesDirectory)) ? this.gCodesDirectory : `${value}:`; }
		},
		enableUV: {	get(){return (this.$store.state.machine.model.global.enableUV);}},
		enableES: {	get(){return (this.$store.state.machine.model.global.enableES);}},
		enableEMD: { get(){return (this.$store.state.machine.model.global.enableEMD);}},
		cadenceEnableUV: {get(){return (this.$store.state.machine.model.global.cadenceEnableUV);}},
		cadenceEnableES: {get(){return (this.$store.state.machine.model.global.cadenceEnableES);}},
		cadenceEnableEMD: {get(){return (this.$store.state.machine.model.global.cadenceEnableEMD);}},
		cadenceAmountUV: {get(){return (this.$store.state.machine.model.global.cadenceAmountUV);}},
		cadenceAmountES: {get(){return (this.$store.state.machine.model.global.cadenceAmountES);}},
		cadenceAmountEMD: {get(){return (this.$store.state.machine.model.global.cadenceAmountEMD);}},
		aplicarFinUV: {get(){return (this.$store.state.machine.model.global.aplicarFinUV);}},
		aplicarFinES: {get(){return (this.$store.state.machine.model.global.aplicarFinES);}},
		aplicarFinEMD: {get(){return (this.$store.state.machine.model.global.aplicarFinEMD);}},
		firstLayerUV: {get(){return (this.$store.state.machine.model.global.firstLayerUV);}},
		enableTMPTools: {get(){return (this.$store.state.machine.model.global.enableTMPTools);}},
		enableTMPBed: {get(){return (this.$store.state.machine.model.global.enableTMPBed);}},
		enableTMPChamber: {get(){return (this.$store.state.machine.model.global.enableTMPChamber);}},

	},
	data() {
		return {
			directory: Path.gCodes,
			selection: [],
			hasThumbnails: false,
			filelist: [],
			loadingValue: false,
			fileinfoDirectory: undefined,
			fileinfoProgress: -1,
			startJobDialog: {
				title: '',
				prompt: '',
				item: undefined,
				shown: false
			},
			showNewDirectory: false,
			fab: false
		}
	},
	methods: {
		...mapActions('machine', {
			machineDownload: 'download',
			machineMove: 'move',
			machineDelete: 'delete',
			getFileList: 'getFileList'
		}),
		...mapActions('machine', ['sendCode', 'getFileInfo']),
		...mapMutations('machine/cache', ['clearFileInfo', 'setFileInfo']),
		getBigThumbnail(thumbnails) {
			let biggestThumbnail = null;
			for (const thumbnail of thumbnails) {
				if (thumbnail.data !== null && (!biggestThumbnail || thumbnail.height > biggestThumbnail.height)) {
					biggestThumbnail = thumbnail;
				}
			}
			return biggestThumbnail;
		},
		getSmallThumbnail(thumbnails) {
			let smallestThumbnail = null;
			for (const thumbnail of thumbnails) {
				if (thumbnail.data !== null && (!smallestThumbnail || Math.abs(48 - thumbnail.height) < Math.abs(48 - smallestThumbnail.height))) {
					smallestThumbnail = thumbnail;
				}
			}
			return smallestThumbnail;
		},
		
		refresh() {
			this.clearFileInfo(this.directory);
			this.$refs.filelist.refresh();
		},
		onDirectoryLoaded() {
			if (this.$store.state.nivelUsuario < 2) {
				this.$refs.filelist.innerFilelist = this.$refs.filelist.innerFilelist.filter(
					item => !(item.isDirectory && item.name === 'Automatically Generated G-codes')
				);
			}
			if (this.$store.state.nivelUsuario < 3) {
				this.$refs.filelist.innerFilelist = this.$refs.filelist.innerFilelist.filter(
					item => !(item.isDirectory && item.name === 'Admin')
				);
			}
		},
		async requestFileInfo(directory, fileIndex, fileCount) {
			if (fileIndex === 0) {
				this.hasThumbnails = false;
			}

			if (this.fileinfoDirectory === directory) {
				if (this.isConnected && fileIndex < fileCount) {
					// Update progress
					this.fileinfoProgress = fileIndex;

					// Try to get file info for the next file
					const file = this.filelist[fileIndex];
					if (!file.isDirectory) {
						let gotFileInfo = false;
						try {
							// Check if it is possible to parse this file
							const filename = Path.combine(directory, file.name);
							if (Path.isGCodePath(file.name, this.gCodesDirectory)) {
								// Get the fileinfo either from our cache or from the Duet
								let fileInfo = this.fileInfos[filename];
								if (!fileInfo) {
									fileInfo = await this.getFileInfo({ filename, readThumbnailContent: true });
									this.setFileInfo({ filename, fileInfo });
								}

								// Start again if the number of files has changed
								if (fileCount !== this.filelist.length) {
									fileIndex = -1;
									fileCount = this.filelist.length;
									this.requestFileInfo(directory, fileIndex, fileCount);
									return;
								}

								// Set file info
								gotFileInfo = true;
								file.height = fileInfo.height;
								file.layerHeight = fileInfo.layerHeight;
								file.filament = fileInfo.filament;
								file.generatedBy = fileInfo.generatedBy;
								file.printTime = fileInfo.printTime ? fileInfo.printTime : null;
								file.simulatedTime = fileInfo.simulatedTime ? fileInfo.simulatedTime : null;
								file.thumbnails = fileInfo.thumbnails ? fileInfo.thumbnails : [];
								if (fileInfo.thumbnails && fileInfo.thumbnails.length !== 0) {
									this.hasThumbnails = true;
								}
							}
						} catch (e) {
							// Deal with the error. If the connection has been terminated, the next call will invalidate everything
							if (!(e instanceof DisconnectedError) && !(e instanceof InvalidPasswordError)) {
								console.warn(e);
								this.$log('error', this.$t('error.fileinfoRequestFailed', [file.name]), e.message);
							}
						}

						// Remove loading state from the items if no info could be found
						if (!gotFileInfo) {
							file.height = null;
							file.layerHeight = null;
							file.filament = [];
							file.generatedBy = null;
							file.printTime = null;
							file.simulatedTime = null;
							file.thumbnails = null;
						}
					}

					// Move on to the next item
					this.requestFileInfo(directory, fileIndex + 1, fileCount);
				} else {
					// No longer connected or finished
					this.fileinfoProgress = -1;
					this.fileinfoDirectory = undefined;
				}
			}
		},
		async directoryLoaded(directory) {
			if (this.fileinfoDirectory !== directory) {
				this.fileinfoDirectory = directory;
				this.filelist.forEach(function(item) {
					if (item.isDirectory) {
						item.height = null;
						item.layerHeight = null;
						item.filament = null;
						item.generatedBy = null;
						item.printTime = null;
						item.simulatedTime = null;
						item.thumbnails = null;
					}
				});

				await this.requestFileInfo(directory, 0, this.filelist.length);
			}
		},
		fileClicked(item) {
			if (!this.isPrinting) {
				this.startJobDialog.title = this.$t('dialog.startJob.title', [item.name]);
				this.startJobDialog.prompt = this.$t('dialog.startJob.prompt', [item.name]);
				this.startJobDialog.item = item;
				this.startJobDialog.shown = true;
			}
		},
		mayores(_a, n=1){
						let res=Array();
						let a=_a.slice();
					//SE ORDENA DE MAYOR A MENOR
					a.sort(function(a, b) {return b - a;});

					//ANTIERRORES
					if(n<0){
						n*=-1;
					}
					if(a.length-1<n){
						n=a.length;
					}

					//PROCESO
					for(var i=0; i<n;i++){
						res[i]=a[i];
					}

					return res;
					},
		menores(_a, n=1){
						let res=Array();
						let a=_a.slice();
					//SE ORDENA DE MAYOR A MENOR
					a.sort(function(a, b) {return a - b;});

					//ANTIERRORES
					if(n<0){
						n*=-1;
					}
					if(a.length-1<n){
						n=a.length;
					}

					//PROCESO
					for(var i=0; i<n;i++){
						res[i]=a[i];
					}

					return res;
					},

		async start(item) {
			/* Chequeamos si UV , ES o EMD se van a aplicar   */
			/* if( ES || UV || EMD) {*/
			/*	PostProcessLayers(`M32 "${Path.combine(this.directory, (item && item.name) ? item.name : this.selection[0].name)}"`);*/
			try {

					//const nomFichero = (item && item.name) ? item.name : this.selection[0].name;
					const gcodesDirectory = "0:/gcodes"; // 
       				const autoGeneratedFolder = "Automatically Generated G-codes"; //los gcodes generados se guardaran en esta carpeta
					const filename = Path.combine(this.directory, (item && item.name) ? item.name : this.selection[0].name);
					const originalName = ((item && item.name) ? item.name : this.selection[0].name).replace(/\.[^/.]+$/, "");  
        			const modifiedName = `${originalName}_mod.g`; 
					const outputPath = Path.combine(gcodesDirectory, autoGeneratedFolder, modifiedName);
					console.info(`Fichero original `);
					console.info(filename);
					console.info(`directory `);
					console.info(this.directory);
					const response = await this.machineDownload({ filename, type: 'text', showSuccess: false });
					var responseTokenized = response.split('\n')
					//console.info(`Analizamos response INI`);
					console.info(`Lineas tokenizadas response` + responseTokenized.length);
					
					//buscamos Z mayor y menor
					var ValorFloatMinimo= parseFloat(1000.0);
					var ValorFloatMaximo= 0;
					var ddData = [];
					let primeraTemperatura = null;
					responseTokenized.forEach(
						function(value) {
							// Excluimos los comentarios
							var token="";
							for (let i = 0; i < value.length; i++) {
									const char = value[i];
									if (char === ';') break; else token+=char;
								}
							// Buscar la primera línea con M104 o G10
							if (!primeraTemperatura && (token.startsWith('M104') || token.startsWith('G10'))) {
								const partes = token.split(' ');
								partes.forEach(parte => {
									if (parte.startsWith('S')) {
										primeraTemperatura = parte.substring(1); // Extrae el valor de S
									}
								});
							}
							if (token.includes('Z'))
							{   
								var subcadena=token.substring(token.indexOf('Z')+1);
								var valorsubcadena="";
								for (let i = 0; i < subcadena.length; i++) {
									const char = subcadena[i];
									if (char === ' ') break; else valorsubcadena+=char;
								}
								var ValorFloat= 0.0;
								ValorFloat= parseFloat(valorsubcadena);
								ddData.push(ValorFloat);
								if(parseFloat(ValorFloat) < parseFloat(ValorFloatMinimo)){
									ValorFloatMinimo=parseFloat(ValorFloat);
									if(ValorFloatMaximo<ValorFloatMinimo)
									{
										ValorFloatMaximo=ValorFloatMinimo;
										
									}	
								}
								else
									if(parseFloat(ValorFloat) > parseFloat(ValorFloatMaximo)){
										ValorFloatMaximo=parseFloat(ValorFloat);
									}
							}
							
						}
					);
					//const mayores = (ddData, len=2) => ddData.slice().sort(function(a, b){return b-a}).splice(0, len);
					console.info(`ddData `);
					console.info(ddData.length);
					let myUniqueArray = [...new Set(ddData)]; // myArray = [...new Set(myArray)];
					console.log(myUniqueArray); // console.log(myArray)
					var cadenciageneral= 0.0;
					myUniqueArray.sort((a, b) => a - b);// Ordenamos el array de alturas únicas
					// Recorremos el array buscando la primera diferencia pequeña (entre 0.05mm y 1mm)
					for (let i = 1; i < myUniqueArray.length; i++) {
						let diff = myUniqueArray[i] - myUniqueArray[i - 1];
						if (diff > 0.05 && diff < 1.0) { // asumimos altura de capa entre 0.05 y 1 mm
							cadenciageneral = parseFloat(diff.toFixed(3));
							break;
						}
					}
					console.info(`Cadencia Detectada:${cadenciageneral}`);
					// generamos el fichero de salida 
					console.info(`generamos el fichero de salida `);
					console.info(`enableUV-> `+this.enableUV);
					var layers = 0;
					var currentZ = 0.0;
					var primeraCapaES = false
					var ultimaCapaES = this.aplicarFinES;
					var primeraCapaUV = this.firstLayerUV;
					var ultimaCapaUV = this.aplicarFinUV;
					var primeraCapaEMD = this.firstLayerEMD;
					var ultimaCapaEMD = this.aplicarFinEMD;
					var frecuenciaCapasES = this.cadenceAmountES;
					var frecuenciaCapasUV = this.cadenceAmountUV;
					var frecuenciaCapasEMD = this.cadenceAmountEMD;
					var primeraCapaUVInsertada = false;	
					var secuenciaES = 'M98 P"/macros/Scripts/ESMacro.g" ';
					var secuenciaUV = 'M98 P"/macros/Scripts/UVMacro.g" ';
					var secuenciaEMD = 'M98 P"/macros/Scripts/EMDMacro.g" ';
					var removeTempCommands = this.enableTMPChamber || this.enableTMPTools || this.enableTMPBed; //añadido Gorka
					const filenameES = "0:/macros/Scripts/ESMacro.g";
					const filenameUV = "0:/macros/Scripts/UVMacro.g";
					const filenameEMD = "0:/macros/Scripts/EMDMacro.g";
					console.info(`Fichero ESMacro `);
					console.info(filenameES);
					console.info(`Fichero UVMacro `);
					console.info(filenameUV);
					console.info(`Fichero EMDMacro `);
					console.info(filenameEMD);
					this.filenameES = "0:/macros/Scripts/ESMacro.g";
					console.info(`carga filenameES `);
					//const secuenciaES2 = this.machineDownload({ filenameES, type: 'blob', showSuccess: false });
					//console.info(secuenciaES2);
					console.info(`cargado filenameES `);
					console.info(`carga filenameUV `);
					//const secuenciaUV = this.machineDownload({ filenameUV, type: 'text', showSuccess: false });
					console.info(`cargado filenameUV `);
					console.info(`carga filenameEMD `);
					console.info(`cargado filenameEMD `);
					//var secuenciaUV = 'M98 P"/macros/Scripts/UVMacro.g" '
					var enableUV = this.enableUV;
					var cadenceEnableUV = this.cadenceEnableUV;
					var enableES = this.enableES;
					var cadenceEnableES = this.cadenceEnableES;
					var enableEMD = this.enableEMD;
					var cadenceEnableEMD = this.cadenceEnableEMD;
					var enableTMPTools = this.enableTMPTools;
					var enableTMPBed = this.enableTMPBed;
					var enableTMPChamber = this.enableTMPChamber;
					//inicializamos sensores Z hop y primera capa
					var capaZeroDet = false;
					var firstTravelDet = false;
					//inicializamos secuencia fichero Temporal
					var ficTemporal = '';
					// ficTemporal += 'M30 "/gcodes/Selected_Job.g"' + '\n';
					// ficTemporal += 'M28 "/gcodes/Selected_Job.g"' + '\n';
					ficTemporal += `M30 "${outputPath}"\n`;
        			ficTemporal += `M28 "${outputPath}"\n`;
					responseTokenized.forEach(
						function(value) {
							// Excluimos los comentarios
							var token="";
							for (let i = 0; i < value.length; i++) {
									const char = value[i];
									if (char === ';') break; else token+=char;
								}
							if (removeTempCommands && (token.startsWith("M104 S0") || token.startsWith("M140 S0") || token.startsWith("M141 S0"))) {
								console.info(`Eliminando línea: ${token}`);
								return;
							}
							
							if (token.includes('Z'))
							{   
								var subcadena=token.substring(token.indexOf('Z')+1);
								var valorsubcadena="";
								for (let i = 0; i < subcadena.length; i++) {
									const char = subcadena[i];
									if (char === ' ') break; else valorsubcadena+=char;
								}
								var ValorFloat= 0.0;
								ValorFloat=  parseFloat(valorsubcadena);
								if (ValorFloat == ValorFloatMinimo){
									ficTemporal += value  + '\n'; //console.info("FIRST         LAYER "+layers+":"+ value);
									if(primeraCapaES && enableES){
										console.info(`añadir filenameES `);
										ficTemporal += secuenciaES  + '\n';	
										console.info(`añadido filenameES `);
									}
									if(primeraCapaUV && enableUV && !primeraCapaUVInsertada){
										console.info(`añadir filenameUV `);
										ficTemporal += secuenciaUV  + '\n';	
										console.info(`añadido filenameUV `);
										primeraCapaUVInsertada = true;
									}
									if(primeraCapaEMD && enableEMD){
										console.info(`añadir filenameEMD `);
										ficTemporal += secuenciaEMD  + '\n';	
										console.info(`añadido filenameEMD `);
									}
									capaZeroDet = true;
									console.info(`LAYER: ${layers} valor: ${ValorFloat}  CurrentZ: ${currentZ} Cadencia: ${cadenciageneral} valor: ${ValorFloat}`);
									console.info(`Primer LAYER`);
									currentZ = ValorFloat;
									layers=1;
								}
								else 
									{
										if (ValorFloat == ValorFloatMaximo){
											if(!capaZeroDet){
												if(!firstTravelDet){
													ficTemporal += value  + '\n'; //console.info("FIRST Z       LAYER "+layers+":"+ value);
													firstTravelDet=true;
												}
												else
													{
														ficTemporal += value  + '\n'; //console.info("LAST TRAVEL Z LAYER "+layers+":"+ value);
														layers++;
														console.info(`LAYER: ${layers}  valor: ${ValorFloat} CurrentZ: ${currentZ} Cadencia: ${cadenciageneral} `);
														if((layers % frecuenciaCapasUV == 0) && (enableUV == true) && (cadenceEnableUV == true)) {
															ficTemporal += secuenciaUV  + '\n';
														}
														if((layers % frecuenciaCapasES == 0) && (enableES == true) && (cadenceEnableES == true)) {
															ficTemporal += secuenciaES  + '\n';
														}
														if((layers % frecuenciaCapasEMD == 0) && (enableEMD == true) && (cadenceEnableEMD == true)) {
															ficTemporal += secuenciaEMD  + '\n';
														}
													}	
											}
											else
											{	
												ficTemporal += value  + '\n'; //console.info("FIRST Z       LAYER "+layers+":"+ value);	
											}
										}
										else
											{
												ficTemporal += value  + '\n'; //console.info("    CAMBIO DE LAYER "+layers+":"+ value);
												if(ValorFloat > currentZ){
													var evaluarCapa = 0.0;
													evaluarCapa = 	currentZ + cadenciageneral;
													console.info(`EVAL: ${parseFloat(evaluarCapa).toFixed(2)}`) 
													var comp1 = parseFloat(parseFloat(evaluarCapa).toFixed(2));
													var comp2 = parseFloat(parseFloat(ValorFloat).toFixed(2));
													console.info(`COMP1: ${comp1} COMP2: ${comp2}`);
													if (comp2 > comp1 ){
														
														console.info(`LAYER: ${layers}  valor: ${ValorFloat} CurrentZ: ${currentZ} Cadencia: ${cadenciageneral} `);
														console.info(`Z-Hop ${parseFloat(ValorFloat).toFixed(2)} > ${parseFloat(currentZ+cadenciageneral).toFixed(2)}`);		
													}
													else
													{
														console.info(`New Layer`);		
														currentZ = ValorFloat;
														layers++;
														console.info(`LAYER: ${layers}  valor: ${ValorFloat} CurrentZ: ${currentZ} Cadencia: ${cadenciageneral} `);
														if((layers % frecuenciaCapasUV == 0) && (enableUV == true) && (cadenceEnableUV == true)) {
															ficTemporal += secuenciaUV  + '\n';
														}
														if((layers % frecuenciaCapasES == 0) && (enableES == true) && (cadenceEnableES == true)) {
															ficTemporal += secuenciaES  + '\n';
														}
														if((layers % frecuenciaCapasEMD == 0) && (enableEMD == true) && (cadenceEnableEMD == true)) {
															ficTemporal += secuenciaEMD  + '\n';
														}
													}	
													
												}
											}
									}
							}
							else{
								if(token.includes("M0")){
									if(ultimaCapaUV && enableUV){
										ficTemporal += secuenciaUV  + '\n';
									}
									if(ultimaCapaES && enableES){
										ficTemporal += secuenciaES  + '\n';
									}
									if(ultimaCapaEMD && enableEMD){
										ficTemporal += secuenciaEMD  + '\n';
									}
									// Añadir el comando de standby al final del G-code
									if (primeraTemperatura !== null) {
										ficTemporal += `M104 S${primeraTemperatura} R${primeraTemperatura}\n`;
									}
									ficTemporal += value  + '\n'; //console.info("              LAYER "+layers+":"+ value);

								}
								else
								{
									ficTemporal += value  + '\n'; //console.info("              LAYER "+layers+":"+ value);
								}	
							}
						}
					);
					
					//aqui habria que aniadir lo de la ultima capa
					ficTemporal += 'M29' + '\n';
					// ficTemporal += 'M32 "/gcodes/Selected_Job.g"' + '\n';
					ficTemporal += `M32 "${outputPath}"\n`;
					//console.info(`Lineas fichero generado` + ficTemporal);
					if(enableES || enableUV || enableEMD|| enableTMPTools || enableTMPBed || enableTMPChamber){
						this.sendCode({ code: `${ficTemporal}`, log: false });
					}	
					else {
						console.info(`lanzando:`+`M32 "${Path.combine(this.directory, (item && item.name) ? item.name : this.selection[0].name)}"`);
						this.sendCode(`M32 "${Path.combine(this.directory, (item && item.name) ? item.name : this.selection[0].name)}"`);
						//this.sendCode({ code: `${ficTemporal}`, log: false });
					}	
					//console.info(`generado` + ficTemporal);
					console.info(`lanzando /gcodes/Selected_Job`);
					
					//this.sendCode(`M32 "/sys/Selected_Job"`);
				
			} catch (e) {
				//if (!(e instanceof DisconnectedError) && !(e instanceof OperationCancelledError)) {
					console.info(`Analizamos response ERROR INI`);
					console.info(e);
					console.info(`Analizamos response ERROR FIN`);
				//}
			}
		
				/* 0 get File for edition*/
				/* 1 tokenize file */
				/* 2 detect layer transition */
				/* 3 reconstruct file with macros ES */
				/* 4 delete tempFile */
				/* 5 save new tempFile  */
				/* 6 launch M32 tempFile */

			/* }else { */
			/*	this.sendCode(`M32 "${Path.combine(this.directory, (item && item.name) ? item.name : this.selection[0].name)}"`); */
			/* } */	
		},

		async loadES() {
			try {   console.info(`----------------------- ENTRADA EN LOAD ES ------------------- `);
					// var secuenciaES = 'M98 P"/macros/Scripts/ESMacro.g" ';
					// const filenameES = "0:/macros/Scripts/ESMacro.g";
					// console.info(`Fichero ESMacro `);
					// console.info(filenameES);
					// this.filenameES = "0:/macros/Scripts/ESMacro.g";
					// console.info(`carga filenameES `);
					// secuenciaES = this.machineDownload({ filenameES, type: 'blob', showSuccess: false });
					// console.info(secuenciaES);
					// console.info(`cargado filenameES `);
			} catch (e) {
				//if (!(e instanceof DisconnectedError) && !(e instanceof OperationCancelledError)) {
					console.info(`Analizamos response ERROR INI`);
					console.info(e);
					console.info(`Analizamos response ERROR FIN`);
				//}
			}
		},
		async loadUV() {
			try {
					console.info(`----------------------- ENTRADA EN LOAD UV ------------------- `); 
					// var secuenciaUV = 'M98 P"/macros/Scripts/UVMacro.g" ';
					// const filenameUV = "0:/macros/Scripts/UVMacro.g";
					// console.info(`Fichero UVMacro `);
					// console.info(filenameUV);
					// this.filenameUV = "0:/macros/Scripts/UVMacro.g";
					// console.info(`carga filenameUV `);
					// secuenciaUV = this.machineDownload({ filenameUV, type: 'blob', showSuccess: false });
					// console.info(secuenciaUV);
					// console.info(`cargado filenameUV `);
			} catch (e) {
				//if (!(e instanceof DisconnectedError) && !(e instanceof OperationCancelledError)) {
					console.info(`Analizamos response ERROR INI`);
					console.info(e);
					console.info(`Analizamos response ERROR FIN`);
				//}
			}
		},
		async loadEMD() {
			try {
					console.info(`----------------------- ENTRADA EN LOAD EMD	 ------------------- `); 
					// var secuenciaEMD = 'M98 P"/macros/Scripts/EMDMacro.g" ';
					// const filenameEMD = "0:/macros/Scripts/EMDMacro.g";
					// console.info(`Fichero EMDMacro `);
					// console.info(filenameEMD);
					// this.filenameEMD = "0:/macros/Scripts/EMDMacro.g";
					// console.info(`carga filenameEMD `);
					// secuenciaEMD = this.machineDownload({ filenameEMD, type: 'blob', showSuccess: false });
					// console.info(secuenciaEMD);
					// console.info(`cargado filenameEMD `);
			} catch (e) {
				//if (!(e instanceof DisconnectedError) && !(e instanceof OperationCancelledError)) {
					console.info(`Analizamos response ERROR INI`);
					console.info(e);
					console.info(`Analizamos response ERROR FIN`);
				//}
			}
		},



		simulate(item) {
			this.sendCode(`M37 P"${escapeFilename(Path.combine(this.directory, (item && item.name) ? item.name : this.selection[0].name))}"`);
		},
		contextMenuAction(menuItem){
			let path = Path.combine(this.directory, this.selection[0].name);
			if (menuItem.path !== '') {
				this.$router.push(menuItem.path).then(() => {
					this.$root.$emit(menuItem.action, path);
				})
			} else {
				this.$root.$emit(menuItem.action, path);
			}
		}
	},
	mounted() {
		this.directory = this.gCodesDirectory;
	},
	watch: {
		gCodesDirectory(to, from) {
			if (Path.equals(this.directory, from) || !Path.startsWith(this.directory, to)) {
				this.directory = to;
			}
		},
		lastJobFile(to) {
			if (Path.equals(this.directory, Path.extractDirectory(to))) {
				// Refresh the filelist after a short moment so DSF and RRF can update the simulation time first
				setTimeout(this.$refs.filelist.refresh.bind(this), 2000);
			}
		},
		 // Cuando cambia el nivel de usuario, refrescar la lista
		'$store.state.nivelUsuario'() {
			this.refresh();
		}
	}
}
</script>
