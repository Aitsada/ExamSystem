<template>
  <v-app class="app-shell">
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :width="260"
      mini-variant-width="72"
      fixed
      app
      class="app-sidebar"
    >
      <div class="sidebar-header">
        <v-btn icon class="sidebar-menu-btn" @click.stop="miniVariant = !miniVariant">
          <v-icon>{{ miniVariant ? 'mdi-menu-open' : 'mdi-menu' }}</v-icon>
        </v-btn>
        <div v-if="!miniVariant" class="sidebar-title">
          <div class="sidebar-title-main">
            {{ title }}
          </div>
          <div class="sidebar-title-sub">
            ระบบจัดการสอบ
          </div>
        </div>
      </div>

      <v-divider />

      <v-list nav dense class="sidebar-list">
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
          active-class="sidebar-item-active"
          class="sidebar-item"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      fixed
      app
      flat
      height="64"
      color="white"
      class="app-topbar"
    >
      <v-toolbar-title class="topbar-title" v-text="pageTitle" />
      <v-spacer />
      <span class="topbar-caption">Admin workspace</span>
    </v-app-bar>

    <v-main class="app-main">
      <v-container fluid class="page-container">
        <Nuxt />
      </v-container>
    </v-main>

    <v-footer app inset height="40" class="app-footer">
      <span>&copy; {{ new Date().getFullYear() }} Tock3yrs</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      drawer: true,
      items: [
        {
          icon: 'mdi-view-dashboard-outline',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-home-outline',
          title: 'หน้าหลัก',
          to: '/Home'
        },
        {
          icon: 'mdi-seat-outline',
          title: 'จัดห้องสอบ',
          to: '/ExamSelect'
        },
        {
          icon: 'mdi-history',
          title: 'ประวัติการจัดสอบ',
          to: '/ExamHistory'
        },
        {
          icon: 'mdi-cog-outline',
          title: 'จัดการหลังบ้าน',
          to: '/Admin'
        }
      ],
      miniVariant: false,
      title: 'Tock3yrs'
    }
  },
  computed: {
    pageTitle () {
      const currentItem = this.items.find(item => item.to === this.$route.path)
      return currentItem ? currentItem.title : this.title
    }
  }
}
</script>

<style scoped>
.app-shell {
  background: #F5F7FB !important;
}

.app-sidebar {
  border-right: 1px solid #E3E8F0 !important;
  background: #FFFFFF !important;
}

.sidebar-header {
  display: flex;
  align-items: center;
  min-height: 72px;
  padding: 12px 14px;
}

.sidebar-menu-btn {
  color: #1A237E !important;
}

.sidebar-title {
  min-width: 0;
  margin-left: 10px;
}

.sidebar-title-main {
  color: #1A237E;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.25;
}

.sidebar-title-sub {
  color: #607D8B;
  font-size: 12px;
  line-height: 1.3;
}

.sidebar-list {
  padding: 10px 8px !important;
}

.sidebar-item {
  min-height: 44px;
  margin-bottom: 4px;
  border-radius: 8px;
  color: #455A64 !important;
}

.sidebar-item-active {
  background: #E8EAF6 !important;
  color: #1A237E !important;
}

.app-topbar {
  border-bottom: 1px solid #E3E8F0 !important;
}

.topbar-title {
  color: #263238;
  font-size: 18px;
  font-weight: 700;
}

.topbar-caption {
  color: #78909C;
  font-size: 12px;
}

.app-main {
  background: #F5F7FB;
}

.page-container {
  padding: 24px;
}

.app-footer {
  border-top: 1px solid #E3E8F0 !important;
  background: #FFFFFF !important;
  color: #78909C;
  font-size: 12px;
}
</style>
