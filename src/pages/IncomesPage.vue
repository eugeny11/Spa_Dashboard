<script setup>
import { ref, onMounted, watch } from 'vue'
import { fetchIncomes } from '../services/api'
import ChartIncomes from '../components/ChartIncomes.vue'

const incomes = ref([])
const loading = ref(false)

const today = new Date()
const weekAgo = new Date()
weekAgo.setDate(today.getDate() - 7)

const format = (d) => d.toISOString().slice(0, 10)

const dateFrom = ref(format(weekAgo))
const dateTo = ref(format(today))

const currentPage = ref(1)
const limit = 50
const hasMore = ref(false)

const minQuantity = ref(0)

const chartData = ref(null)



const loadIncomes = async () => {
  loading.value = true
  try {
    const res = await fetchIncomes({
      dateFrom: dateFrom.value,
      dateTo: dateTo.value,
      page: currentPage.value,
      limit,
    })

    const filtered = res.data.data.filter(item => {
    return Number(item.quantity) >= minQuantity.value
  })

    incomes.value = filtered
    hasMore.value = filtered.length === limit

    const grouped = {}

    filtered.forEach(item => {
    const date = item.date
    const quantity = Number(item.quantity) || 0
    if (!grouped[date]) grouped[date] = 0
    grouped[date] += quantity
  })

    const dates = Object.keys(grouped)
    const totals = Object.values(grouped)

    chartData.value = {
      labels: dates,
      datasets: [
        {
          label: 'Количество поступлений',
          data: totals,
          borderColor: '#3a86ff',
          backgroundColor: 'rgba(58, 134, 255, 0.2)',
          tension: 0.3,
          fill: true,
        },
      ],
    }

  } catch (e) {
    console.error('Ошибка при загрузке доходов:', e)
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  currentPage.value = 1
  loadIncomes()
}

onMounted(loadIncomes)

watch(currentPage, loadIncomes)

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}
const nextPage = () => {
  if (hasMore.value) currentPage.value++
}

</script>

<template>
  <div class="page">
    <h2>📈 Доходы</h2>

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
        <span>Мин. количество:</span>
        <input type="number" v-model.number="minQuantity" min="0" />
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
              <th>Количество</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in incomes" :key="item.id">
              <td>{{ item.income_id }}</td>
              <td>{{ item.date }}</td>
              <td>{{ item.quantity }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="chartData" class="chart-wrapper">
        <ChartIncomes :chartData="chartData" />
      </div>

      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">← Назад</button>
        <span>Страница {{ currentPage }}</span>
        <button @click="nextPage" :disabled="!hasMore">Вперёд →</button>
      </div>
    </div>
  </div>
</template>

