<template>
  <v-card class="d-flex flex-column flex-grow-1">
    <v-card-title class="pt-2 pb-0">
      <v-icon class="mr-1">mdi-chart-timeline-variant</v-icon>
      {{ $t('chart.temperature.caption') }}
    </v-card-title>

    <v-card-text v-show="hasTemperaturesToDisplay" class="content flex-grow-1 px-2 py-0">
      <canvas ref="chart"></canvas>
    </v-card-text>

    <v-spacer v-show="!hasTemperaturesToDisplay"></v-spacer>
    <v-card-text class="pa-0" v-show="!hasTemperaturesToDisplay">
      <v-alert :value="true" type="info" class="mb-0">
        {{ $t('chart.temperature.noData') }}
      </v-alert>
    </v-card-text>

    <v-card-actions class="pa-2">
      <v-select
        :items="timeRanges"
        v-model="selectedRange"
        :label="$t('chart.layer.interval')"
        dense
        hide-details
        outlined
        style="max-width: 200px"
        @change="update"
      />
      <v-spacer />
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" small dark v-bind="attrs" v-on="on">
            <v-icon left>mdi-content-save</v-icon> {{ $t('chart.temperature.save') }}
            <v-icon right>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="downloadChart">
            <v-list-item-title>PNG</v-list-item-title>
          </v-list-item>
          <v-list-item @click="downloadCSV">
            <v-list-item-title>CSV</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-actions>
  </v-card>
</template>

<script>
'use strict'

import Chart from 'chart.js'
import zoomPlugin from 'chartjs-plugin-zoom'
import dateFnsLocale from 'date-fns/locale/en-US'
import { mapState, mapGetters } from 'vuex'
import i18n from '@/i18n'
import Events from '@/utils/events.js'
import { getRealHeaterColor } from '@/utils/colors.js'

Chart.plugins.register(zoomPlugin)

const defaultMaxTemperature = 300

function makeDataset(index, extra, label) {
  const color = getRealHeaterColor(index, extra)
  return {
    index,
    extra,
    label,
    fill: false,
    backgroundColor: color,
    borderColor: color,
    borderDash: extra ? [10, 5] : undefined,
    borderWidth: 2,
    data: [],
    rawLabel: label,
    locale: i18n.locale,
    pointRadius: 0,
    pointHitRadius: 0,
    showLine: true
  }
}

const tempSamples = {}

function pushSeriesData(machine, index, extra, sensor) {
  const machineData = tempSamples[machine]
  let dataset = machineData.temps.find(item => item.index === index && item.extra === extra)

  if (!dataset) {
    const name = sensor.name || i18n.t(extra ? 'chart.temperature.sensor' : 'chart.temperature.heater', [index])
    dataset = makeDataset(index, extra, name)
    machineData.temps.push(dataset)
  }

  dataset.data.push(sensor.lastReading >= 0 ? sensor.lastReading : NaN)

}

function getFilteredData(machine, selectedRange) {
  const machineData = tempSamples[machine]
  const now = new Date()
  const startTime = now - selectedRange

  const indices = machineData.times
    .map((t, i) => ({ t, i }))
    .filter(entry => entry.t >= startTime)
    .map(entry => entry.i)

  const times = indices.map(i => machineData.times[i])
  const temps = machineData.temps.map(ds => ({
    ...ds,
    data: indices.map(i => ds.data[i])
  }))

  return { times, temps }
}

let storeSubscribed = false
let instances = []

export default {
  data() {
    return {
      chart: null,
      selectedRange: 600000, 
      visibleHeaters: {},
      timeRanges: [
        { text: '10 min', value: 10 * 60 * 1000 },
        { text: '20 min', value: 20 * 60 * 1000 },
        { text: '30 min', value: 30 * 60 * 1000 },
        { text: '1 h', value: 60 * 60 * 1000 },
        { text: '2 h', value: 2 * 60 * 60 * 1000 },
        { text: '3 h', value: 3 * 60 * 60 * 1000 }
      ]
    }
  },
  computed: {
    ...mapState(['selectedMachine']),
    ...mapGetters(['isConnected']),
    ...mapGetters('machine', ['hasTemperaturesToDisplay']),
    ...mapGetters('machine/model', ['maxHeaterTemperature']),
    ...mapState('machine/model', ['heat']),
    ...mapState('settings', ['darkTheme'])
  },
  methods: {
    toggleHeater(index) {
      this.visibleHeaters[index] = !this.visibleHeaters[index]
      const ds = this.chart.data.datasets.find(d => d.index === index)
      if (ds) ds.showLine = this.visibleHeaters[index]
      this.chart.update()
    },  
    update() {
      if (!this.chart) return

      const { times, temps } = getFilteredData(this.selectedMachine, this.selectedRange)

      temps.forEach(ds => {
        if (this.visibleHeaters[ds.index] !== undefined) {
          ds.showLine = this.visibleHeaters[ds.index]
          ds.hidden = !ds.showLine   // <-- restauramos el tachado
        }
      })

      this.chart.data.labels = times
      this.chart.data.datasets = temps
      this.chart.options.scales.yAxes[0].ticks.max = this.maxHeaterTemperature || defaultMaxTemperature
      this.chart.options.scales.xAxes[0].ticks.min = new Date(Date.now() - this.selectedRange)
      this.chart.options.scales.xAxes[0].ticks.max = new Date()
      this.chart.update()
    },
    applyDarkTheme(active) {
      const ticksColor = active ? '#FFF' : '#666'
      this.chart.options.legend.labels.fontColor = ticksColor
      this.chart.options.scales.xAxes[0].ticks.fontColor = ticksColor
      this.chart.options.scales.yAxes[0].ticks.fontColor = ticksColor
      const gridLineColor = active ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'
      this.chart.options.scales.xAxes[0].gridLines.color = gridLineColor
      this.chart.options.scales.yAxes[0].gridLines.color = gridLineColor
      this.chart.options.scales.yAxes[0].gridLines.zeroLineColor = gridLineColor
      this.chart.update()
    },
    downloadChart() {
      const canvas = document.createElement('canvas')
      canvas.width = this.chart.width
      canvas.height = this.chart.height
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(this.chart.canvas, 0, 0)
      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/png')
      link.download = 'grafico-temperatura.png'
      link.click()
    },
    downloadCSV() {
      const dataset = tempSamples[this.selectedMachine]
      if (!dataset || !dataset.times.length || !dataset.temps.length) return

      const headers = ['fecha', 'hora', ...dataset.temps.map(ds => `"${ds.label}"`)]
      const rows = []

      for (let i = 0; i < dataset.times.length; i++) {
        const ts = new Date(dataset.times[i])
        const fecha = ts.toLocaleDateString('es-ES')
		const hora = ts.toLocaleTimeString('es-ES', {
  			hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
		})
		const values = dataset.temps.map(ds => isNaN(ds.data[i]) ? '' : ds.data[i].toFixed(2))
		rows.push([fecha, hora, ...values].join(','))
      }

      const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.setAttribute('download', 'temperaturas.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  },
  mounted() {
    if (!tempSamples[this.selectedMachine]) {
      tempSamples[this.selectedMachine] = { times: [], temps: [] }
    }

    this.chart = Chart.Line(this.$refs.chart, {
      options: {
        animation: { duration: 0 },
        elements: { line: { tension: 0 } },
        maintainAspectRatio: false,
        responsive: true,
        // legend: {
        //   labels: {
        //     filter: () => true,
        //     fontFamily: 'Roboto,sans-serif'
        //   },
        //   onClick: (_e, legendItem) => {
        //     const ds = this.chart.data.datasets[legendItem.datasetIndex]
        //     this.visibleHeaters[ds.index] = !this.visibleHeaters[ds.index]
        //     ds.showLine = this.visibleHeaters[ds.index]
        //     ds.hidden = !ds.showLine
        //     this.chart.update()
        //   }
        // },
        legend: {
          labels: {
            filter: (legendItem, data) => {
              const ds = data.datasets[legendItem.datasetIndex]

              // Solo aplica a heaters/tools (no a sensores "extra")
              if (!ds.extra) {
                const heater = this.heat && this.heat.heaters[ds.index]
                if (heater && heater.current <= -273) {
                  return false
                }
              }
              return true
            },
            fontFamily: 'Roboto,sans-serif'
          },
          onClick: (_e, legendItem) => {
            const ds = this.chart.data.datasets[legendItem.datasetIndex]
            this.visibleHeaters[ds.index] = !this.visibleHeaters[ds.index]
            ds.showLine = this.visibleHeaters[ds.index]
            ds.hidden = !ds.showLine
            this.chart.update()
          }
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              unit: 'minute',
              displayFormats: { minute: 'HH:mm' }
            },
            ticks: {
              min: new Date() - this.selectedRange,
              max: new Date()
            },
            adapters: { date: { locale: dateFnsLocale } },
            gridLines: { color: 'rgba(0,0,0,0.2)' }
          }],
          yAxes: [{
            ticks: {
              min: 0,
              max: defaultMaxTemperature,
              stepSize: 50
            },
            gridLines: {
              color: 'rgba(0,0,0,0.2)',
              zeroLineColor: 'rgba(0,0,0,0.2)'
            }
          }]
        },
        plugins: {
          zoom: {
            pan: { enabled: true, mode: 'x', speed: 10, threshold: 10 },
            zoom: { enabled: true, mode: 'x', sensitivity: 3, speed: 0.1 }
          }
        }
      },
      data: {
        labels: [],
        datasets: []
      }
    })

    this.applyDarkTheme(this.darkTheme)
    instances.push(this)

    if (!storeSubscribed) {
      this.$root.$on(Events.machineModelUpdated, hostname => {
        const dataset = tempSamples[hostname]
        const now = new Date()

        if (!dataset.times.length || now - dataset.times[dataset.times.length - 1] > 1000) {
          this.$store.state.machines[hostname].model.sensors.analog.forEach((sensor, index) => {
            if (!sensor) return
            const heaterIndex = this.$store.state.machines[hostname].model.heat.heaters.findIndex(h => h?.sensor === index)
            pushSeriesData(hostname, heaterIndex !== -1 ? heaterIndex : index, heaterIndex === -1, sensor)
          })

          dataset.times.push(now)
          dataset.temps.forEach(ds => {
            if (this.visibleHeaters[ds.index] !== undefined) {
              ds.showLine = this.visibleHeaters[ds.index]
              ds.hidden = !ds.showLine   // mantiene el tachado
            } else {
              ds.showLine = !ds.extra || this.$store.state.machines[hostname].settings.displayedExtraTemperatures.includes(ds.index)
              ds.hidden = !ds.showLine
              this.visibleHeaters[ds.index] = ds.showLine
            }
          })

          instances.forEach(instance => instance.update())
        }
      })
      storeSubscribed = true
    }
  },
  watch: {
    darkTheme(to) {
      this.applyDarkTheme(to)
    },
    selectedMachine(machine) {
      if (!tempSamples[machine]) {
        tempSamples[machine] = { times: [], temps: [] }
      }
      this.update()
    }
  }
}
</script>
