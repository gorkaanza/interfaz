<template>
	<!-- <code-btn block :height="$vuetify.breakpoint.mdAndUp ? 40 : 60" v-bind="$props" :code="'M112\nM999'" :log="false" color="$props.color || error" :disabled="$props.disabled || isDisabled" :title="$t('button.emergencyStop.title')">
		<v-icon class="mr-1">mdi-flash</v-icon>
		<span class="hidden-xs-only">
			{{ $t('button.emergencyStop.caption') }}
		</span>
	</code-btn> -->
	<v-btn block :height="$vuetify.breakpoint.mdAndUp ? 40 : 60" class="clsvbtn2" color="$props.color || error" :disabled="$props.disabled || isDisabled" @click="emergencyStopAll" >
		<v-icon class="mr-1">mdi-flash</v-icon>
		<span class="hidden-xs-only">{{ $t('button.emergencyStop.caption') }}</span>
	</v-btn>
</template>

<script>
'use strict'

import { VBtn } from 'vuetify/lib'
import {mapActions } from 'vuex'

export default {
	extends: VBtn,
	data() {
		return {
			isDisabled: false
		}
	},
	mounted() {
		this.$root.$on('dialog-closing', this.onDialogClosing);
	},
	beforeDestroy() {
		this.$root.$off('dialog-closing', this.onDialogClosing);
	},
	methods: {
		...mapActions('machine', ['sendCode']),
		onDialogClosing() {
			this.isDisabled = true;

			const that = this;
			setTimeout(function() {
				that.isDisabled = false;
			}, 500);
		},
		emergencyStopAll() {
			// 1️⃣ Detener rodillo
			this.sendCode('set global.rpmRodillo = 0');
			this.sendCode('set global.rpmRodilloSet = 0');
			this.sendCode('M118 P2 L1 S"##S#500##"'); // Mensaje opcional

			// 2️⃣ Emergency Stop
			setTimeout(() => {
				this.sendCode('M112');

				// 3️⃣ Reinicio firmware después de M112
				setTimeout(() => {
				this.sendCode('M999');
				}, 100);
			}, 100);
		}
	}
}
</script>
