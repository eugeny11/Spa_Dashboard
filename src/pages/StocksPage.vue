<script setup>
import { ref, onMounted, watch } from 'vue'
import { fetchStocks } from '../services/api'
import ChartIncomes from '../components/ChartIncomes.vue'

const stocks = ref([])
const loading = ref(false)
const chartData = ref(null)
const currentPage = ref(1)
const limit = 50
const hasMore = ref(false)

const today = new Date().toISOString().slice(0,10)
const dateFrom = ref(today)

const minQty = ref(0)

const warehouses = ref([])
const selectedWarehouse = ref('')


const loadStocks = async () => {
  loading.value = true
  try {
   
    const res = await fetchStocks({
      dateFrom: dateFrom.value,
      page: currentPage.value,
      limit,
    })

    warehouses.value = Array.from(
    new Set(res.data.data.map(item => item.warehouse_name).filter(Boolean))
    ).sort()

    
   const filtered = res.data.data
  .filter(item => Number(item.quantity_full) >= minQty.value)
  .filter(item =>
    selectedWarehouse.value
      ? item.warehouse_name === selectedWarehouse.value
      : true
  )

    console.log(res.data.data)

    stocks.value = filtered
    hasMore.value = filtered.length === limit

    const grouped = {}
    filtered.forEach(item => {
      const wh = item.warehouse_name || '—'
      const qty = Number(item.quantity_full) || 0
      grouped[wh] = (grouped[wh] || 0) + qty
    })

    const labels = Object.keys(grouped)
    const values = Object.values(grouped)

    chartData.value = {
      labels,
      datasets: [
        {
          label: 'Остатки по складам',
          data: values,
          borderColor: '#3a86ff',
          backgroundColor: 'rgba(58,134,255,0.2)',
          tension: 0.3,
          fill: true,
        },
      ],
    }
  } catch (e) {
    console.error('Ошибка загрузки склада:', e)
  } finally {
    loading.value = false
  }
}

onMounted(loadStocks)
watch(currentPage, loadStocks)

const applyFilters = () => {
  currentPage.value = 1
  loadStocks()
}
</script>

<template>
  <div class="page">
    <h2>🏪 Склады</h2>

    <div class="filters">
      <label>
        <span>Дата:</span>
        <input type="date" v-model="dateFrom" />
      </label>
      <label>
        <span>Мин. остаток:</span>
        <input type="number" v-model.number="minQty" min="0" />
      </label>
      <label>
            <span>Склад:</span>
            <select v-model="selectedWarehouse">
            <option value="">Все</option>
            <option v-for="w in warehouses" :key="w" :value="w">{{ w }}</option>
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
              <th>NM ID</th>
              <th>Дата</th>
              <th>Склад</th>
              <th>Остаток</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in stocks" :key="item.nm_id">
              <td>{{ item.nm_id }}</td>
              <td>{{ item.date }}</td>
              <td>{{ item.warehouse_name }}</td>
              <td>{{ item.quantity_full }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="chartData" class="chart-wrapper">
        <ChartIncomes :chartData="chartData" />
      </div>

      <div class="pagination">
        <button @click="() => currentPage > 1 && currentPage--"
                :disabled="currentPage===1">← Назад</button>
        <span>Страница {{ currentPage }}</span>
        <button @click="() => hasMore && currentPage++"
                :disabled="!hasMore">Вперёд →</button>
      </div>
    </div>
  </div>
</template>
