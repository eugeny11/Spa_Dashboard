<script setup>

</script>

<template>
  <div id="app">
    <nav>
      <router-link to="/incomes">Доходы</router-link>
      <router-link to="/orders">Заказы</router-link>
      <router-link to="/sales">Продажи</router-link>
      <router-link to="/stocks">Склады</router-link>
    </nav>
    <router-view />
  </div>
</template>

<style scoped>

</style>
