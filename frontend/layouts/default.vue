<template>
  <v-app class="app-shell">
    <v-app-bar
      fixed
      app
      flat
      height="49"
      color="#222222"
      class="app-topbar"
    >
      <v-container class="topbar-container">
        <v-toolbar-items class="topbar-menu">
          <v-btn
            v-for="item in items"
            :key="item.to"
            text
            exact
            router
            :to="item.to"
            class="topbar-link"
            active-class="topbar-link-active"
          >
            {{ item.title }}
          </v-btn>
          <v-btn text class="topbar-link">
            Logout
          </v-btn>
        </v-toolbar-items>
      </v-container>
    </v-app-bar>

    <v-main class="app-main">
      <v-container fluid class="page-container">
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      items: [
        {
          title: 'หน้าหลัก',
          to: '/Home'
        },
        {
          title: 'จัดห้องสอบ',
          to: '/ExamSelect'
        },
        {
          title: 'ประวัติการจัดสอบ',
          to: '/ExamHistory'
        },
        {
          title: 'จัดการหลังบ้าน',
          to: '/Admin'
        }
      ]
    }
  }
}
</script>

<style scoped>
.app-shell {
  background: #FFFFFF !important;
}

.app-topbar {
  border-bottom: 1px solid #111111 !important;
}

.topbar-container {
  display: flex;
  justify-content: center;
  max-width: 1140px;
  padding: 0 !important;
}

.topbar-menu {
  min-width: 0;
  min-height: 50px;
  overflow-x: auto;
}
.topbar-link {
  min-width: 92px !important;
  padding: 0 16px !important;
  color: #BDBDBD !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  letter-spacing: 0 !important;
  text-transform: none !important;
}

.topbar-link-active,
.topbar-link:hover {
  color: #FFFFFF !important;
}

.app-main {
  background: #FFFFFF;
}

.page-container {
  padding: 0 !important;
}

@media (max-width: 600px) {
  .topbar-container {
    justify-content: flex-start;
  }

  .topbar-link {
    min-width: auto !important;
    padding: 0 12px !important;
  }
}
</style>
