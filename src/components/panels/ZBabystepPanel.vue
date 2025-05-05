<template>
	<v-card class="blue lighten-5">
		<v-card-title>
			<v-icon small class="mr-1">mdi-format-vertical-align-center</v-icon> {{ $t('panel.babystepping.caption') }}
		</v-card-title>

		<v-card-text class="pt-0">
			<v-row v-if="comprobar <= 5" >
				<v-col>
					{{ $t('domotek.babystepping.current', [$displayZ(babystepping)]) }}
				</v-col>
			</v-row>

			<v-row v-if="comprobar >= 5">
				<v-col>
					{{ $t('domotek.babystepping.current1', [$displayZ(babystepping)]) }}
				</v-col>
				<v-col>
					{{ $t('domotek.babystepping.current2', [$displayZ(babystepping2)]) }}
				</v-col>
			</v-row>

			<v-row no-gutters class="mt-1">
				<v-col>
					<code-btn :code="`M290 R1 Z${-babystepAmount}`" no-wait block height="100px">
						<v-icon>mdi-arrow-collapse-vertical</v-icon> {{ $displayZ(-babystepAmount) }}
					</code-btn>
				</v-col>

				<v-col>
					<code-btn :code="`M290 R1 Z${babystepAmount}`" no-wait block height="100px">
						<v-icon>mdi-arrow-split-horizontal</v-icon> +{{ $displayZ(babystepAmount) }}
					</code-btn>
				</v-col>
			</v-row>
		</v-card-text>
	</v-card>
</template>

<script>
'use strict'

import { mapState } from 'vuex'

export default {
	computed: {
		...mapState('machine/model', {
			babystepping: state => (state.move.axes.length >= 3) ? state.move.axes[2].babystep : 0,
			babystepping2: state => (state.move.axes.length >= 5) ? state.move.axes[6].babystep : 0,
			comprobar: state => state.move.axes.length,
			boards: state => state.boards,
		}),//IVAN
		// ...mapState('machine/model', {
		// 	babystepping2: state => (state.move.axes.length >= 5) ? state.move.axes[6].babystep : 0
		// }),
		...mapState('machine/settings', ['babystepAmount']),
		
	}
}
</script>
