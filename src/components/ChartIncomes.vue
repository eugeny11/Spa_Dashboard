<script setup>
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js'

// Регистрируем нужные компоненты
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

const props = defineProps({
  chartData: Object,
})
</script>

<template>
  <Line :data="chartData" :options="{
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'График доходов по дням' }
    }
  }" />
</template>
