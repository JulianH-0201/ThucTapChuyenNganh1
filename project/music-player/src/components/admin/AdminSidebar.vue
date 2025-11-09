<script setup>
import { RouterLink, useRoute } from "vue-router";
import {
  HomeIcon,
  ChartBarIcon,
  TableCellsIcon,
  MusicalNoteIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  TrashIcon,
  ChevronLeftIcon,
} from "@heroicons/vue/24/outline";
import { ShieldCheckIcon } from "@heroicons/vue/24/solid";

defineProps({
  collapsed: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["toggle"]);

const route = useRoute();

const menuItems = [
  { name: "Dashboard", icon: HomeIcon, path: "/admin" },
  { name: "Songs", icon: MusicalNoteIcon, path: "/admin/songs" },
  { name: "Artists", icon: UserGroupIcon, path: "/admin/artists" },
  { name: "Analytics", icon: ChartBarIcon, path: "/admin/analytics" },
  { name: "Settings", icon: Cog6ToothIcon, path: "/admin/settings" },
];
</script>

<template>
  <aside
    :class="[
      'fixed left-0 top-0 h-full bg-gray-800 text-white transition-all duration-300 z-50',
      collapsed ? 'w-16' : 'w-64',
    ]"
  >
    <!-- Sidebar Header -->
    <div class="flex items-center justify-between p-4 border-b border-gray-700">
      <div v-if="!collapsed" class="flex items-center space-x-2">
        <ShieldCheckIcon class="w-6 h-6" />
        <span class="text-lg font-semibold">Music Admin</span>
      </div>
      <button
        @click="$emit('toggle')"
        class="p-2 rounded hover:bg-gray-700 transition-colors"
      >
        <ChevronLeftIcon
          :class="['w-5 h-5 transition-transform', collapsed ? 'rotate-180' : '']"
        />
      </button>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 overflow-y-auto py-4">
      <ul class="space-y-1 px-2">
        <li v-for="item in menuItems" :key="item.path">
          <RouterLink
            :to="item.path"
            :class="[
              'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
              route.path === item.path || (item.path === '/admin' && route.path.startsWith('/admin'))
                ? 'bg-gray-700 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
            ]"
          >
            <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
            <span v-if="!collapsed" class="flex-1">{{ item.name }}</span>
          </RouterLink>
        </li>
      </ul>
    </nav>

    <!-- Sidebar Footer -->
    <div class="border-t border-gray-700 p-4">
      <div class="flex items-center space-x-2">
        <button
          class="p-2 rounded hover:bg-gray-700 transition-colors"
          title="Settings"
        >
          <Cog6ToothIcon class="w-5 h-5" />
        </button>
        <button
          class="p-2 rounded hover:bg-gray-700 transition-colors"
          title="Trash"
        >
          <TrashIcon class="w-5 h-5" />
        </button>
        <button
          v-if="!collapsed"
          @click="$emit('toggle')"
          class="p-2 rounded hover:bg-gray-700 transition-colors ml-auto"
        >
          <ChevronLeftIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
  </aside>
</template>
