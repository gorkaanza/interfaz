<template>
	<v-dialog  v-model="internalShown" @keydown.escape="dismissed" persistent width="480" content-class="clsConfirmDialog">
		<v-card class="blue lighten-5">
			<v-card-title>
				<span class="headline">
					{{ title }}
				</span>
			</v-card-title>

			<v-card-text>
				{{ prompt }}
			</v-card-text>

				
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-row>
					<v-col align="right">
						<v-btn width="90" height="90" outlined color="blue darken-1" text @click="dismissed" rounded>		
							<code-btn width="90" height="90" color="red lighten-3" rounded>
								{{ $t('generic.no') }}
							</code-btn>
						</v-btn>
					</v-col>
					<v-col>
						<v-btn width="90" height="90" outlined color="blue darken-1" text @click="confirmed" rounded>
							<code-btn width="90" height="90" color="green lighten-3" rounded>
								{{ $t('generic.yes') }}
							</code-btn>
						</v-btn>

					</v-col>
				</v-row>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
'use strict'

export default {
	props: {
		title: {
			type: String,
			required: true
		},
		prompt: {
			type: String,
			required: true
		},
		shown: {
			type: Boolean,
			required: true
		}
	},
	computed: {
		internalShown: {
			get() { return this.shown; },
			set(value) {
				if (value) {
					this.confirmed();
				} else {
					this.dismissed();
				}
			}
		}
	},
	methods: {
		confirmed() {
			this.$emit('confirmed');
			this.$emit('update:shown', false);
		},
		dismissed() {
			this.$emit('dismissed');
			this.$emit('update:shown', false);
		}
	}
}
</script>
