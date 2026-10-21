<template>
    <v-card outlined v-if="$store.state.nivelUsuario >= 2">
        <v-card-title>
            <v-icon class="mr-2">mdi-email-outline</v-icon>
            {{ $t('panel.settingsNotifications.caption') }}
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text>

            <!-- <v-text-field
                v-model="email"
                @change="CambiarEmail"
                :label="$t('domotek.jobs.notifications.emailNotifications')"
                prepend-inner-icon="mdi-email"
                outlined
                dense
                :rules="emailRules"
            /> -->
            <v-text-field
                v-model="email"
                @change="CambiarEmail"
                :label="$t('domotek.jobs.notifications.emailNotifications')"
                :hint="$t('domotek.jobs.notifications.emailHint')"
                persistent-hint
                prepend-inner-icon="mdi-email"
                outlined
                dense
                :rules="emailRules"
            />

            <div class="text-subtitle-1 font-weight-medium mt-5 mb-2">
                 {{ $t('domotek.jobs.notifications.duringprinting') }}
            </div>

           <v-row>

                <!-- Print started -->
                <v-col cols="12" md="6">
                    <v-checkbox
                        v-model="notifyPrintStarted"
                        hide-details
                    >
                        <template #label>
                            <v-icon color="blue" small class="mr-2">
                                mdi-play-circle
                            </v-icon>
                            {{ $t('domotek.jobs.notifications.printStarted') }}
                        </template>
                    </v-checkbox>
                </v-col>

                <!-- Print canceled -->
                <v-col cols="12" md="6">
                    <v-checkbox
                        v-model="notifyPrintCanceled"
                        hide-details
                    >
                        <template #label>
                            <v-icon color="error" small class="mr-2">
                                mdi-cancel
                            </v-icon>
                            {{ $t('domotek.jobs.notifications.printCanceled') }}
                        </template>
                    </v-checkbox>
                </v-col>

                <!-- Print finished -->
                <v-col cols="12" md="6">
                    <v-checkbox
                        v-model="notifyPrintFinished"
                        hide-details
                    >
                        <template #label>
                            <v-icon color="success" small class="mr-2">
                                mdi-check-circle
                            </v-icon>
                            {{ $t('domotek.jobs.notifications.printFinished') }}
                        </template>
                    </v-checkbox>
                </v-col>

                <!-- Tool disconnected -->
                <v-col cols="12" md="6">
                    <v-checkbox
                        v-model="notifyToolDisconnected"
                        hide-details
                    >
                        <template #label>
                            <v-icon color="orange" small class="mr-2">
                                mdi-alert-circle
                            </v-icon>
                            {{ $t('domotek.jobs.notifications.toolDisc') }}
                        </template>
                    </v-checkbox>
                </v-col>

                <!-- Print resumed -->
                <v-col cols="12" md="6">
                    <v-checkbox
                        v-model="notifyPrintResumed"
                        hide-details
                    >
                        <template #label>
                            <v-icon color="error" small class="mr-2">
                                mdi-play-circle
                            </v-icon>
                            {{ $t('domotek.jobs.notifications.printResumed') }}
                        </template>
                    </v-checkbox>
                </v-col>

                <!-- Heater fault -->
                <v-col cols="12" md="6">
                    <v-checkbox
                        v-model="notifyHeaterFault"
                        hide-details
                    >
                        <template #label>
                            <v-icon color="error" small class="mr-2">
                                mdi-fire-alert
                            </v-icon>
                            {{ $t('domotek.jobs.notifications.heaterFault') }}
                        </template>
                    </v-checkbox>
                </v-col>

                <!-- Print paused -->
                <v-col cols="12" md="6">
                    <v-checkbox
                        v-model="notifyPrintPaused"
                        hide-details
                    >
                        <template #label>
                            <v-icon color="warning" small class="mr-2">
                                mdi-pause-circle
                            </v-icon>
                            {{ $t('domotek.jobs.notifications.printPaused') }}
                        </template>
                    </v-checkbox>
                </v-col>

            </v-row>

            <div class="text-caption grey--text mt-3" v-if="guardando">
                <v-icon x-small color="grey">mdi-content-save-outline</v-icon>
               {{ $t('domotek.jobs.notifications.saving') }}
            </div>

        </v-card-text>
    </v-card>
</template>

<script>
'use strict'

import { mapState, mapMutations, mapActions } from 'vuex'

export default {

    data() {
        return {
            email: '',
            guardando: false
        }
    },

    computed: {

        ...mapState(['settings']),
        ...mapState('machine/model', {
            mainboard: state => (state.boards.length > 0) ? state.boards[0] : {},
        }),

        notificationErrorsPersistent: {
            get() {
                return this.settings.notifications.errorsPersistent
            },
            set(value) {
                this.update({ notifications: { errorsPersistent: value } })
            }
        },

        notificationTimeout: {
            get() {
                return this.settings.notifications.timeout
            },
            set(value) {
                if (this.isNumber(value) && value >= 0) {
                    this.update({ notifications: { timeout: value } })
                }
            }
        },

        notifyPrintFinished: {
            get() {
                return this.$store.state.machine.model.global.notifyPrintFinished
            },
            set(value) {
                this.sendCode(`set global.notifyPrintFinished = ${value}`)
                this.guardarAjustesNotificaciones({ notifyPrintFinished: value })
            }
        },

        notifyPrintPaused: {
            get() {
                return this.$store.state.machine.model.global.notifyPrintPaused
            },
            set(value) {
                this.sendCode(`set global.notifyPrintPaused = ${value}`)
                this.guardarAjustesNotificaciones({ notifyPrintPaused: value })
            }
        },

        notifyPrintCanceled: {
            get() {
                return this.$store.state.machine.model.global.notifyPrintCanceled
            },
            set(value) {
                this.sendCode(`set global.notifyPrintCanceled = ${value}`)
                this.guardarAjustesNotificaciones({ notifyPrintCanceled: value })
            }
        },
        notifyPrintStarted: {
            get() {
                return this.$store.state.machine.model.global.notifyPrintStarted
            },
            set(value) {
                this.sendCode(`set global.notifyPrintStarted = ${value}`)
                this.guardarAjustesNotificaciones({ notifyPrintStarted: value })
            }
        },
        notifyPrintResumed: {
            get() {
                return this.$store.state.machine.model.global.notifyPrintResumed
            },
            set(value) {
                this.sendCode(`set global.notifyPrintResumed = ${value}`)
                this.guardarAjustesNotificaciones({ notifyPrintResumed: value })
            }
        },

        notifyHeaterFault: {
            get() {
                return this.$store.state.machine.model.global.notifyHeaterFault
            },
            set(value) {
                this.sendCode(`set global.notifyHeaterFault = ${value}`)
                this.guardarAjustesNotificaciones({ notifyHeaterFault: value })
            }
        },

        notifyToolDisconnected: {
            get() {
                return this.$store.state.machine.model.global.notifyToolDisconnected
            },
            set(value) {
                this.sendCode(`set global.notifyToolDisconnected = ${value}`)
                this.guardarAjustesNotificaciones({ notifyToolDisconnected: value })
            }
        },
        emailRulesOld() {
            return [
                v => !!v || 'Email required',
                v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Invalid email address'
            ]
        },
        emailRules() {
            return [
                v => !!v || 'Email required',
                v => {
                    const emails = v.split(',').map(e => e.trim()).filter(e => e.length > 0);
                    if (emails.length === 0) return 'Email required';
                    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    const invalidos = emails.filter(e => !regex.test(e));
                    return invalidos.length === 0 || `${this.$t('domotek.jobs.notifications.invalidEmails')}: ${invalidos.join(', ')}`;
                }
            ]
        }

    },

    mounted() {
        this.email = this.$store.state.machine.model.global.emailDestino;
    },

    watch: {
        '$store.state.machine.model.global.emailDestino'(value) {
            this.email = value;
        }
    },

    methods: {

        ...mapMutations('settings', ['update']),
        ...mapActions('machine', ['sendCode']),

        CambiarEmail() {
            this.sendCode(`set global.emailDestino = "${this.email}"`);
            this.guardarAjustesNotificaciones({ emailDestino: this.email });
        },

        // Reescribe el archivo /sys/notificationSettings.g con el estado
        // completo actual (email + los 4 switches), para que sobreviva a
        // apagar y encender la impresora. Se llama cada vez que cambia
        // cualquiera de los valores; "overrides" lleva el valor recien
        // cambiado por si el object model todavia no se ha actualizado.
        guardarAjustesNotificaciones(overrides = {}) {
            const valores = {
                emailDestino: this.$store.state.machine.model.global.emailDestino,
                notifyPrintFinished: this.$store.state.machine.model.global.notifyPrintFinished,
                notifyPrintStarted: this.$store.state.machine.model.global.notifyPrintStarted,
                notifyPrintPaused: this.$store.state.machine.model.global.notifyPrintPaused,
                notifyPrintCanceled: this.$store.state.machine.model.global.notifyPrintCanceled,
                notifyPrintResumed: this.$store.state.machine.model.global.notifyPrintResumed,
                notifyHeaterFault: this.$store.state.machine.model.global.notifyHeaterFault,
                notifyToolDisconnected: this.$store.state.machine.model.global.notifyToolDisconnected,
                ...overrides
            };

            let secuencia = '';
            secuencia += 'M28 "/sys/notificationSettings.g"\n';
            secuencia += '; Ajustes de notificaciones por email (guardado automatico, no editar a mano)\n';
            secuencia += `set global.emailDestino = "${valores.emailDestino}"\n`;
            secuencia += `set global.notifyPrintFinished = ${valores.notifyPrintFinished}\n`;
            secuencia += `set global.notifyPrintStarted = ${valores.notifyPrintStarted}\n`;
            secuencia += `set global.notifyPrintPaused = ${valores.notifyPrintPaused}\n`;
            secuencia += `set global.notifyPrintCanceled = ${valores.notifyPrintCanceled}\n`;
            secuencia += `set global.notifyPrintResumed = ${valores.notifyPrintResumed}\n`;
            secuencia += `set global.notifyHeaterFault = ${valores.notifyHeaterFault}\n`;
            secuencia += `set global.notifyToolDisconnected = ${valores.notifyToolDisconnected}\n`;
            secuencia += 'M29\n';

            this.guardando = true;
            this.sendCode({ code: secuencia, log: false }).finally(() => {
                setTimeout(() => { this.guardando = false; }, 600);
            });
        }

    }

}
</script>

<style scoped>

.v-card-text {
    padding-top: 20px;
}

.text-subtitle-1 {
    color: rgba(0, 0, 0, 0.7);
}

.v-checkbox {
    margin-top: 0;
}

</style>