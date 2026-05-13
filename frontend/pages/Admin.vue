<template>
  <v-container class="admin-page">
    <v-row align="center" class="admin-page-header mb-5" no-gutters>
      <v-col cols="auto" class="mr-3">
        <div class="admin-title-marker" />
      </v-col>
      <v-col>
        <p class="admin-eyebrow mb-0">
          Admin workspace
        </p>
        <p class="admin-page-title mb-0">
          จัดการหลังบ้าน
        </p>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col
        v-for="item in adminLinks"
        :key="item.to"
        cols="12"
        md="6"
      >
        <v-card
          class="admin-card admin-dashboard-card"
          elevation="0"
          :to="item.to"
        >
          <v-card-text class="pa-5">
            <div class="dashboard-card-content">
              <v-avatar color="#EAF4FF" size="44">
                <v-icon color="#1976D2">
                  {{ item.icon }}
                </v-icon>
              </v-avatar>
              <div class="dashboard-card-copy">
                <p class="dashboard-card-title mb-1">
                  {{ item.title }}
                </p>
                <p class="dashboard-card-description mb-0">
                  {{ item.description }}
                </p>
              </div>
              <v-icon color="#94A3B8">
                mdi-chevron-right
              </v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'AdminPage',
  data () {
    return {
      adminLinks: [
        {
          icon: 'mdi-map-marker-multiple-outline',
          title: 'สถานที่สอบ',
          description: 'จัดการสถานที่ อาคาร ชั้น และห้องสอบ',
          to: '/Admins/FacilityList'
        },
        {
          icon: 'mdi-file-excel-outline',
          title: 'นำเข้าข้อมูล',
          description: 'เพิ่มข้อมูลสถานที่สอบจากไฟล์ Excel',
          to: '/Admins/FacilityList'
        }
      ]
    }
  }
}
</script>

<style scoped>
.admin-dashboard-card {
  transition: border-color 0.15s ease, transform 0.15s ease;
}

.admin-dashboard-card:hover {
  border-color: #9CC5F2 !important;
  transform: translateY(-1px);
}

.dashboard-card-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.dashboard-card-copy {
  flex: 1 1 auto;
  min-width: 0;
}

.dashboard-card-title {
  color: #0F3D78;
  font-size: 15px;
  font-weight: 700;
}

.dashboard-card-description {
  color: #64748B;
  font-size: 13px;
  line-height: 1.45;
}
</style>
