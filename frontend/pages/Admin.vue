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
              <v-avatar color="#FFFFFF" size="40">
                <v-icon color="#555555">
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
              <v-icon color="#777777">
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
          title: 'เพิ่มข้อมูลสถานที่สอบ',
          description: 'จัดการสถานที่ อาคาร ชั้น ห้อง และนำเข้าข้อมูลจาก Excel',
          to: '/Admins/FacilityList'
        },
        {
          icon: 'mdi-domain',
          title: 'เพิ่มข้อมูลผู้สมัคร',
          description: 'จัดการหน่วยงาน รอบสอบ ตำแหน่ง และข้อมูลผู้สมัคร',
          to: '/Organizations/OrganizationList'
        }
      ]
    }
  }
}
</script>

<style scoped>
.admin-dashboard-card {
  border-bottom: 1px solid #DDDDDD !important;
}

.admin-dashboard-card:hover {
  background: #F5F5F5 !important;
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
  color: #333333;
  font-size: 14px;
  font-weight: 600;
}

.dashboard-card-description {
  color: #666666;
  font-size: 13px;
  line-height: 1.45;
}
</style>
