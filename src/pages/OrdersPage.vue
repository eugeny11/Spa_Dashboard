<script setup>
import { ref, onMounted, watch } from 'vue'
import { fetchOrders } from '../services/api'
import ChartIncomes from '../components/ChartIncomes.vue'  // переиспользуем компонент графика

const orders = ref([])
const loading = ref(false)
const chartData = ref(null)
const currentPage = ref(1)
const limit = 50
const hasMore = ref(false)

const minDiscount = ref(0)
const regions = ref([])
const selectedRegion = ref('')

const dateFrom = ref(new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().slice(0,10))
const dateTo = ref(new Date().toISOString().slice(0,10))

const loadOrders = async () => {
  loading.value = true
  try {
    const res = await fetchOrders({
      dateFrom: dateFrom.value,
      dateTo: dateTo.value,
      page: currentPage.value,
      limit,
    })

    regions.value = Array.from(
    new Set(res.data.data.map(item => item.oblast).filter(x => x))
    ).sort()

    const filtered = res.data.data
  .filter(item => Number(item.discount_percent) >= minDiscount.value)
  .filter(item => {
    return selectedRegion.value
      ? item.oblast === selectedRegion.value
      : true
  })

    orders.value = filtered
    hasMore.value = filtered.length === limit

    const grouped = {}
    res.data.data.forEach(item => {
      const d = item.date
      grouped[d] = (grouped[d] || 0) + 1
    })
    const dates = Object.keys(grouped)
    const counts = Object.values(grouped)
    chartData.value = {
      labels: dates,
      datasets: [
        {
          label: 'Число заказов',
          data: counts,
          borderColor: '#3a86ff',
          backgroundColor: 'rgba(58, 134, 255, 0.2)',
          tension: 0.3,
          fill: true,
        },
      ],
    }
  } catch (e) {
    console.error('Ошибка загрузки заказов:', e)
  } finally {
    loading.value = false
  }
}

onMounted(loadOrders)
watch(currentPage, loadOrders)

const applyFilters = () => {
  currentPage.value = 1
  loadOrders()
}
</script>

<template>
  <div class="page">
    <h2>📝 Заказы</h2>

    <div class="filters">
      <label>
        <span>От:</span>
        <input type="date" v-model="dateFrom" />
      </label>
      <label>
        <span>До:</span>
        <input type="date" v-model="dateTo" />
      </label>
       <label>
            <span>Мин. скидка %:</span>
            <input type="number" v-model.number="minDiscount" min="0" />
        </label>
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
        <table class="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Дата</th>
              <th>Код заказа</th>
              <th>Скидка %</th>
              <th>Область</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in orders" :key="item.order_id || item.id">
              <td>{{ item.income_id || item.nm_id }}</td>
              <td>{{ item.date }}</td>
              <td>{{ item.barcode }}</td>
              <td>{{ item.discount_percent }}</td>
              <td>{{ item.oblast }}</td>
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
