<script setup>
import { ref } from "vue";
import { Pie } from "vue-chartjs";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const chartData = ref({
  labels: ["Category A", "Category B", "Category C", "Category D"],
  datasets: [
    {
      data: [40, 25, 20, 15],
      backgroundColor: ["#ef4444", "#eab308", "#3b82f6", "#22c55e"],
    },
  ],
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
    },
  },
});
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-lg font-semibold mb-4">Distribution</h3>
    <div class="h-64">
      <Pie :data="chartData" :options="chartOptions" />
    </div>
    <p class="text-sm text-gray-500 mt-4">Updated yesterday at 11:59 PM</p>
  </div>
</template>

