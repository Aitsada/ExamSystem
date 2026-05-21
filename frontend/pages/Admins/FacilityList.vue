<template>
  <v-container class="admin-page">
    <!-- Breadcrumb -->
    <v-breadcrumbs
      :items="breadcrumbs"
      density="compact"
      class="admin-breadcrumbs pa-0 mb-4"
    >
      <template #divider>
        <v-icon size="14" color="grey">
          mdi-chevron-right
        </v-icon>
      </template>
    </v-breadcrumbs>

    <!-- Page Header -->
    <v-row align="center" class="admin-page-header mb-5" no-gutters>
      <v-col cols="auto" class="mr-3">
        <div class="admin-title-marker" />
      </v-col>
      <v-col>
        <p class="admin-eyebrow mb-0">
          ระบบจัดการสถานที่สอบ
        </p>
        <p class="admin-page-title mb-0">
          รายการสถานที่สอบ
        </p>
      </v-col>
      <v-col cols="auto">
        <div class="header-actions">
          <v-btn
            color="secondary"
            variant="flat"
            prepend-icon="mdi-file-excel-outline"
            class="btn-add"
            @click="focusImportCard"
          >
            เพิ่มสถานที่จาก Excel
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            prepend-icon="mdi-plus"
            class="btn-add"
            :to="'/Admins/FacilityForm'"
          >
            เพิ่มสถานที่สอบ
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Main Card -->
    <v-card elevation="0" rounded="lg" border color="white" class="admin-card">
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
            small
            outlined
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
            small
            outlined
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

    <v-card
      ref="importCard"
      elevation="0"
      rounded="lg"
      border
      color="white"
      class="admin-card admin-import-card mt-4"
    >
      <v-card-text class="px-5 py-3">
        <v-row align="center" no-gutters>
          <v-col cols="12" md="2">
            <span class="field-label">ไฟล์สถานที่สอบ :</span>
          </v-col>
          <v-col cols="12" md="5" class="mt-3 mt-md-0">
            <v-file-input
              ref="facilityFileInput"
              v-model="facilityFile"
              dense
              outlined
              hide-details
              show-size
              accept=".xls,.xlsx"
              placeholder="เลือกไฟล์ Excel..."
              prepend-icon=""
              prepend-inner-icon="mdi-upload-outline"
              class="form-field"
            />
          </v-col>
        </v-row>

        <v-row align="center" class="mt-3" no-gutters>
          <v-col cols="12" md="7">
            <p class="admin-helper-text mb-0">
              Example Excel File: ต้องมีคอลัมน์ Name และ DisplayName
            </p>
          </v-col>
          <v-col cols="12" md="5" class="text-md-right mt-3 mt-md-0">
            <v-btn
              small
              class="admin-template-btn mr-2"
              :href="$apiUrl('/api/template/facility')"
            >
              ดาวโหลดตัวอย่างไฟล์
            </v-btn>
            <v-btn
              color="primary"
              class="btn-save"
              :loading="importLoading"
              :disabled="!facilityFile"
              prepend-icon="mdi-database-import-outline"
              @click="importFacilities"
            >
              บันทึกข้อมูลสถานที่สอบ »
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'FacilityList',
  data () {
    return {
      loading: false,
      importLoading: false,
      search: '',
      facilityFile: null,
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
    },
    selectedFacilityFile () {
      return Array.isArray(this.facilityFile) ? this.facilityFile[0] : this.facilityFile
    }
  },
  mounted () {
    this.fetchFacilities()
  },
  methods: {
    async fetchFacilities () {
      this.loading = true
      try {
        const res = await this.$axios.$get(this.$apiUrl('/api/facilities'))
        this.facility = res.data || []
      } catch (error) {
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
    focusImportCard () {
      const importCard = this.$refs.importCard?.$el
      if (importCard) {
        importCard.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    },
    async importFacilities () {
      if (!this.selectedFacilityFile) {
        this.$swal.fire({
          icon: 'error',
          title: 'นำเข้าสถานที่สอบไม่สำเร็จ',
          text: 'กรุณาเลือกไฟล์ Excel',
          confirmButtonText: 'ตกลง'
        })
        return
      }

      const formData = new FormData()
      formData.append('file', this.selectedFacilityFile)

      this.importLoading = true
      try {
        const res = await this.$axios.$post(this.$apiUrl('/api/facility/import'), formData)
        this.facilityFile = null
        await this.fetchFacilities()
        this.$swal.fire({
          icon: 'success',
          title: 'นำเข้าข้อมูลสำเร็จ',
          text: `นำเข้าสถานที่สอบ ${res.imported || 0} รายการ`,
          confirmButtonText: 'ตกลง'
        })
      } catch (error) {
        this.$swal.fire({
          icon: 'error',
          title: 'นำเข้าสถานที่สอบไม่สำเร็จ',
          text: error?.response?.data?.message || 'กรุณาลองใหม่อีกครั้ง',
          confirmButtonText: 'ตกลง'
        })
      } finally {
        this.importLoading = false
      }
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
        this.$swal.fire({
          icon: 'success',
          title: 'ลบข้อมูลสำเร็จ',
          text: `ลบ "${item.Name}" เรียบร้อยแล้ว`,
          confirmButtonText: 'ตกลง'
        })
      } catch (error) {
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
