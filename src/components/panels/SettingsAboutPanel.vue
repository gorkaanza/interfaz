<template>
	<v-card outlined class="blue lighten-5" elevation="5">
		<v-card-title class="pb-0">
			<span>Custom domoBIO v1.8.7 DWC {{ version }} </span>
			<!--  <v-spacer></v-spacer>-->
			<!--<a href="https://github.com/Duet3D/DuetWebControl" target="_blank">
				<v-icon small>mdi-star</v-icon> GitHub
			</a> -->
		</v-card-title>

		<!-- <v-card-text class="pt-0">
			{{ $t('panel.settingsAbout.developedBy') }} <a href="mailto:christian@duet3d.com">Christian Hammacher</a> {{ $t('panel.settingsAbout.for') }} <a href="https://www.duet3d.com" target="_blank">Duet3D</a>.
			<br>
			{{ $t('panel.settingsAbout.licensedUnder') }} <a href="https://www.gnu.org/licenses/gpl-3.0.en.html" target="_blank">GNU General Public License v3</a>
		</v-card-text> -->

		<v-card-text class="pb-2 pl-10">
			{{ $t('panel.settingsAbout.customizedBy') }}
			<br>
			<!-- {{ $t('panel.settingsAbout.licensedUnder') }} <a href="https://www.gnu.org/licenses/gpl-3.0.en.html" target="_blank">GNU General Public License v3</a> -->
			{{ $t('panel.settingsAbout.licensedUnder') }} GNU General Public License v3    <!--	Luis - he quitado el link para que no se pueda salir de la aplicaci?n -->
			<br>
			<!-- <span>Custom Domotek</span> -->
			<template v-if="isConnected">
				<template v-if="mainboard.name">
					{{ $t('panel.settingsElectronics.board', [mainboard.name + (mainboard.shortName ? ` (${mainboard.shortName})` : '')]) }} <br>
				</template>
				<template v-if="dsfVersion">
					{{ `DSF Version: ${dsfVersion}` }} <br>
				</template>
				<template v-if="mainboard.firmwareName">
					{{ $t('panel.settingsElectronics.firmware', [mainboard.firmwareName + ' ' + $display(mainboard.firmwareVersion), $display(mainboard.firmwareDate)]) }} <br>
				</template>
				<template v-if="firstInterface.firmwareVersion && firstInterface.type === 'wifi'">
					{{ $t('panel.settingsElectronics.dwsFirmware', [$display(firstInterface.firmwareVersion)]) }} <br>
				</template>
				<template v-if="ipAddress">
					{{ $t('panel.settingsElectronics.ipAdress', [$display(ipAddress.actualIP)]) }}
					<!--IP Address: {{ ipAddress.actualIP }} -->
					<br>
					{{ $t('panel.settingsElectronics.macAdress', [$display(ipAddress.mac)]) }}
					<!--MAC Address: {{ ipAddress.mac }}-->
					<br>
					<!--Serial Number: <span v-html="replaceFilter( serialNumber )"></span>-->
					<span v-html="$t('panel.settingsElectronics.serialNumber', [replaceFilter(serialNumber)])"></span>
					<br>
				</template>
				<template v-if="configVersion">
					{{ $t('panel.settingsElectronics.configVersion', [$display(configVersion)]) }}
					<!--Config Version: {{ configVersion }} -->
					<br>
				</template>
				
				<!-- {{ $t('panel.settingsElectronics.updateNote') }} -->
			</template>
			<template v-else>
				(not connected)
			</template>
		</v-card-text>
	</v-card>
</template>

<script>
'use strict'

import { version } from '../../../package.json'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
	data() {
		return {
			version
		}
	},
	computed: {
		...mapGetters(['isConnected']),
		...mapGetters('machine/model', ['global']),
		...mapState('machine/model', {
			dsfVersion: state => state.state.dsfVersion,
			mainboard: state => (state.boards.length > 0) ? state.boards[0] : {},
			firstInterface: state => (state.network.interfaces.length > 0) ? state.network.interfaces[0] : {},
			ipAddress: state => state.network.interfaces[0],
			serialNumber: state => state.global.SerialNumber,
			configVersion: state => state.global.ConfigVersion,

		})
	},
	methods: {
		...mapActions('machine', ['sendCode']),
		async diagnostics() {
			await this.sendCode('M122');
			this.$router.push('/Console');
		},
		replaceFilter: function(string) {
			//var domoBIO="";
			//domoBIO+="<span style='color:#0a21ad;'>domo</span>";
			//domoBIO+="<span style='color:#ffb812;'>BIO</span>";
			//return string.replace("domoBIO", domoBIO);
			var domoBIO="";
			var domoMAT="";
			var reemplazo=""; 
			domoBIO+="<span style='color:#0a21ad;font-weight:bold;'>domo</span>";
			domoBIO+="<span style='color:#ffb812;font-weight:bold;'>BIO</span>";
			domoMAT+="<span style='color:#0a21ad;font-weight:bold;'>domo</span>";
			domoMAT+="<span style='color:#ffb812;font-weight:bold;'>MAT</span>";
			reemplazo=string.replace("domoBIO", domoBIO);
			reemplazo=reemplazo.replace("domoMAT", domoMAT);

			return reemplazo;

		},
	}
}
</script>
