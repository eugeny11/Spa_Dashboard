<script setup>
import { ref, onMounted, watch } from 'vue'
import { fetchSales } from '../services/api'
import ChartIncomes from '../components/ChartIncomes.vue'  // тот же график

const sales = ref([])
const loading = ref(false)
const chartData = ref(null)
const currentPage = ref(1)
const limit = 50
const hasMore = ref(false)

const today = new Date().toISOString().slice(0,10)
const weekAgo = new Date(new Date().setDate(new Date().getDate()-7)).toISOString().slice(0,10)

const dateFrom = ref(weekAgo)
const dateTo = ref(today)
const minSum = ref(0)

const regions = ref([])
const selectedRegion = ref('')


const loadSales = async () => {
  loading.value = true
  try {
    const res = await fetchSales({
      dateFrom: dateFrom.value,
      dateTo: dateTo.value,
      page: currentPage.value,
      limit,
    })

    regions.value = Array.from(
    new Set(res.data.data.map(item => item.region_name).filter(Boolean))
    ).sort()


    const filtered = res.data.data
    .filter(item => Number(item.total_price) >= minSum.value)
    .filter(item => selectedRegion.value
        ? item.region_name === selectedRegion.value
        : true
  )

    sales.value = filtered
    hasMore.value = filtered.length === limit

    console.log(sales)

    const grouped = {}
    filtered.forEach(item => {
      const d = item.date
      const sum = Number(item.total_price) || 0
      grouped[d] = (grouped[d] || 0) + sum
    })

    const dates = Object.keys(grouped)
    const totals = Object.values(grouped)

    chartData.value = {
      labels: dates,
      datasets: [
        {
          label: 'Выручка (сумма продаж)',
          data: totals,
          borderColor: '#3a86ff',
          backgroundColor: 'rgba(58,134,255,0.2)',
          tension: 0.3,
          fill: true,
        },
      ],
    }
  } catch (e) {
    console.error('Ошибка загрузки продаж:', e)
  } finally {
    loading.value = false
  }
}

onMounted(loadSales)
watch(currentPage, loadSales)

const applyFilters = () => {
  currentPage.value = 1
  loadSales()
}
</script>

<template>
  <div class="page">
    <h2>💰 Продажи</h2>

    <div class="filters">
      <label><span>От:</span><input type="date" v-model="dateFrom" /></label>
      <label><span>До:</span><input type="date" v-model="dateTo" /></label>
      <label><span>Мин. сумма:</span><input type="number" v-model.number="minSum" min="0" /></label>
       <label>
            <span>Регион:</span>
            <select v-model="selectedRegion">
            <option value="">Все</option>
            <option v-for="r in regions" :key="r" :value="r">{{ r }}</option>
            </select>
       </label>
      <button @click="applyFilters">Применить</button>
    </div>

    <div v-if="loading" class="loading">Загрузка...</div>

    <div v-else>
      

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Дата</th>
              <th>Сумма</th>
              <th>Регион</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in sales" :key="item.sale_id || item.id">
              <td>{{ item.sale_id || item.id }}</td>
              <td>{{ item.date }}</td>
              <td>{{ Number(item.total_price).toFixed(2) }}</td>
              <td>{{ item.region_name }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="chartData" class="chart-wrapper">
        <ChartIncomes :chartData="chartData" />
      </div>

      <div class="pagination">
        <button @click="() => currentPage > 1 && currentPage--" :disabled="currentPage===1">← Назад</button>
        <span>Страница {{ currentPage }}</span>
        <button @click="() => hasMore && currentPage++" :disabled="!hasMore">Вперёд →</button>
      </div>
    </div>
  </div>
</template>
