<template>
    <g>
    <text v-if="offsetX == 75" x="75" y="455" font-size="6em" fill="red" font-weight="bold">{{valor}}</text>
    <text v-if="offsetX != 75" x="145" y="455" font-size="6em" fill="red" font-weight="bold">{{valor}}</text>
    </g>

</template>
<script>
    export default {
      props: {
        valor: {
          type: [Number, String],
          default: 0.00
        },
        offsetX: {
            type: [Number, String],
            default: 75
        },

      }
    }
    </script>  