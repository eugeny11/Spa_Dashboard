import axios from "axios";

const API_BASE = 'https://109.73.206.144:6969/api'
const API_KEY = 'E6kUTYrYwZq2tN4QEtyzsbEBk3ie'

const client = axios.create({
    baseURL: API_BASE,
    params: {key: API_KEY}
})

export const fetchIncomes = (params) => client.get('/incomes', { params })
export const fetchOrders = (params) => client.get('/orders', { params })
export const fetchSales = (params) => client.get('/sales', { params })
export const fetchStocks = (params) => client.get('/stocks', { params })