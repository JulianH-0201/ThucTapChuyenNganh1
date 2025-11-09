<script setup>
import { computed, ref } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});

const chartData = computed(() => ({
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      label: "Monthly Plays",
      backgroundColor: "#3b82f6",
      data: props.data.length > 0 ? props.data : [1200, 1800, 2100, 2500, 2800, 3200],
    },
  ],
}));

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 500,
      },
    },
  },
});
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-lg font-semibold mb-4">Monthly Plays</h3>
    <div class="h-64">
      <Bar :data="chartData" :options="chartOptions" v-if="chartData" />
    </div>
    <p class="text-sm text-gray-500 mt-4">Updated yesterday at 11:59 PM</p>
  </div>
</template>
