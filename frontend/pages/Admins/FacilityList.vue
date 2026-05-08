<template>
  <v-container style="max-width: 900px; padding: 0;">
    <!-- Breadcrumb -->
    <v-breadcrumbs
      :items="breadcrumbs"
      density="compact"
      class="pa-0 mb-4"
    >
      <template #divider>
        <v-icon size="14" color="grey">
          mdi-chevron-right
        </v-icon>
      </template>
    </v-breadcrumbs>

    <!-- Page Header -->
    <v-row align="center" class="mb-5" no-gutters>
      <v-col cols="auto" class="mr-3">
        <v-sheet color="primary" rounded="lg" width="6" height="36" />
      </v-col>
      <v-col>
        <p class="text-caption text-medium-emphasis mb-0">
          ระบบจัดการสถานที่สอบ
        </p>
        <p class="text-h6 font-weight-bold mb-0" style="color: #1A237E; letter-spacing: 0.02em;">
          รายการสถานที่สอบ
        </p>
      </v-col>
      <v-col cols="auto">
        <v-btn
          color="primary"
          variant="flat"
          prepend-icon="mdi-plus"
          class="btn-add"
          :to="'/Admins/FacilityForm'"
        >
          เพิ่มสถานที่สอบ
        </v-btn>
      </v-col>
    </v-row>

    <!-- Main Card -->
    <v-card elevation="0" rounded="lg" border color="white">
      <!-- Data Table -->
      <v-data-table
        :headers="headers"
        :items="filteredFacility"
        :items-per-page="-1"
        :loading="loading"
        no-data-text="ไม่พบข้อมูลสถานที่สอบ"
        loading-text="กำลังโหลดข้อมูล..."
        class="facility-table"
        hide-default-footer
      >
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #[`item.Name`]="{ item }">
          <v-row align="center" no-gutters>
            <v-col>
              <span class="text-body-2 font-weight-medium">{{ item.Name }}</span>
            </v-col>
          </v-row>
        </template>

        <!-- Edit -->
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #[`item.edit`]="{ item }">
          <v-btn
            size="small"
            variant="outlined"
            color="white"
            class="btn-action"
            prepend-icon="mdi-pencil-outline"
            :to="{
              path: '/Admins/FacilityForm',
              query: { ID: item.ID}
            }"
          >
            แก้ไข
          </v-btn>
        </template>

        <!-- Delete -->
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #[`item.delete`]="{ item }">
          <v-btn
            size="small"
            variant="outlined"
            color="error"
            class="btn-action"
            prepend-icon="mdi-delete-outline"
            @click="confirmDelete(item)"
          >
            ลบ
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'FacilityList',
  data () {
    return {
      loading: false,
      search: '',
      facility: [],
      headers: [
        { text: 'ชื่อสถานที่สอบ', value: 'Name', align: 'start', width: '60%' },
        { text: 'แก้ไขข้อมูล', value: 'edit', sortable: false, align: 'center', width: '20%' },
        { text: 'ลบข้อมูล', value: 'delete', sortable: false, align: 'center', width: '20%' }
      ],
      breadcrumbs: [
        { text: 'หน้าหลัก', href: '/', disabled: false },
        { text: 'สถานที่สอบ', disabled: true }
      ]
    }
  },
  computed: {
    filteredFacility () {
      if (!this.search) { return this.facility }
      const q = this.search.toLowerCase()
      return this.facility.filter(f => f.Name.toLowerCase().includes(q))
    }
  },
  mounted () {
    this.fetchFacilities()
  },
  methods: {
    async fetchFacilities () {
      this.loading = true
      try {
        const res = await this.$axios.$get(this.$apiUrl('/api/facility'))
        this.facility = res.data || []
      } catch (error) {
        console.error('Error loading facilities:', error)
        this.$swal.fire({
          icon: 'error',
          title: 'โหลดข้อมูลไม่สำเร็จ',
          text: 'ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
          confirmButtonText: 'ตกลง'
        })
      } finally {
        this.loading = false
      }
    },
    testBtn (item) {
      console.log('Test button clicked', item.ID)
    },
    async confirmDelete (item) {
      const result = await this.$swal.fire({
        icon: 'warning',
        title: 'ยืนยันการลบข้อมูล',
        text: `คุณต้องการลบสถานที่สอบ "${item.Name}" ออกจากระบบใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`,
        showCancelButton: true,
        confirmButtonText: 'ยืนยันลบ',
        cancelButtonText: 'ยกเลิก',
        confirmButtonColor: '#D32F2F',
        cancelButtonColor: '#757575'
      })

      if (!result.isConfirmed) { return }

      try {
        await this.$axios.$delete(this.$apiUrl(`/api/facility/${item.ID}`))
        const res = this.facility.filter(f => f.ID !== item.ID)
        this.facility = res
        console.log('DELETE : ', res)
        this.$swal.fire({
          icon: 'success',
          title: 'ลบข้อมูลสำเร็จ',
          text: `ลบ "${item.Name}" เรียบร้อยแล้ว`,
          confirmButtonText: 'ตกลง'
        })
      } catch (error) {
        console.error('Error deleting facility:', error)
        this.$swal.fire({
          icon: 'error',
          title: 'ลบข้อมูลไม่สำเร็จ',
          text: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
          confirmButtonText: 'ตกลง'
        })
      }
    },
    showEditUnavailable () {
      this.$swal.fire({
        icon: 'info',
        title: 'ยังไม่พร้อมใช้งาน',
        text: 'ยังไม่มีหน้าแก้ไขข้อมูลสถานที่สอบ',
        confirmButtonText: 'ตกลง'
      })
    }
  }
}
</script>

<style scoped>
.btn-add {
  font-size: 13px !important;
  text-transform: none !important;
  letter-spacing: 0 !important;
  border-radius: 6px !important;
}

.search-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-label {
  flex: 0 0 auto;
  color: #333333;
  font-size: 14px;
  font-weight: 500;
  line-height: 40px;
  white-space: nowrap;
}

.search-field {
  flex: 1 1 auto;
  max-width: 300px;
  border: 1px solid #B0BEC5;
  border-radius: 6px;
}

.search-field :deep(.v-field__outline) {
  border-color: #B0BEC5 !important;
}

.search-field :deep(.v-field__input) {
  font-size: 13px !important;
}

.facility-table {
  box-shadow: none !important;
}

.facility-table :deep(thead tr th) {
  background-color: #EEF2FF !important;
  font-size: 12px !important;
  font-weight: 600 !important;
  color: #1A237E !important;
  border-bottom: 1px solid #C5CAE9 !important;
}

.facility-table :deep(tbody tr td) {
  font-size: 13px !important;
  color: #2C2C2A !important;
  height: 52px !important;
  border-bottom: 0.5px solid #ECEFF1 !important;
}

.facility-table :deep(tbody tr:last-child td) {
  border-bottom: none !important;
}

.facility-table :deep(tbody tr:hover td) {
  background-color: #F8F9FF !important;
}

.btn-action {
  font-size: 12px !important;
  text-transform: none !important;
  letter-spacing: 0 !important;
}

.btn-cancel {
  font-size: 13px !important;
  text-transform: none !important;
  letter-spacing: 0 !important;
  color: #555 !important;
  border-color: #B0BEC5 !important;
}

.btn-confirm {
  font-size: 13px !important;
  text-transform: none !important;
  letter-spacing: 0 !important;
}
</style>
