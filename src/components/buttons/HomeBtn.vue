<template>
	<div class="pt-10">
		
		<v-icon small class="mr-1 ml-7">mdi-home</v-icon> Home Directory
		<!-- {{ $t('panel.extrude.caption') }} -->
	
		<v-card-actions class="pb-15 pt-15">
			<v-row class="text-center" >
				<v-col cols="6">
					<v-btn class="white" width="80%" height="250" @click="change">
						<v-row>
							<v-col  cols="12">
								<v-icon  size="60">mdi-wifi-arrow-up-down</v-icon>
							</v-col>
							<v-col>
								<span style="font-size:25px;">DWC</span>
							</v-col>
						</v-row>
					</v-btn>
				</v-col>
				<v-col cols="6">
					<v-btn class="white" href="https://domotek.es/" width="80%" height="250">
						<v-row>
							<v-col cols="12">
								<v-icon size="60">mdi-traffic-cone</v-icon>
							</v-col>
							<v-col>
								<span style="font-size:25px;">SOFTWARE</span>
							</v-col>
						</v-row>
					</v-btn>
				</v-col>
			</v-row>
		</v-card-actions>
	</div>
		
</template>

<script>
'use strict'

//import store from '../../store'
import {  mapMutations } from 'vuex'
//import router from '../../routes';

export default {
    computed: {
        ...mapMutations(['cambiarMenu']),
		},
    methods: {
        change(){
			//router.push('Job/Status')
            this.cambiarMenu;
        }
    }
    
}
</script>
