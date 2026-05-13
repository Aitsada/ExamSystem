<template>
  <v-container style="max-width: 900px; padding: 0;">
    <v-breadcrumbs :items="breadcrumbs" density="compact" class="pa-0 mb-4">
      <template #divider>
        <v-icon size="14" color="grey">
          mdi-chevron-right
        </v-icon>
      </template>
    </v-breadcrumbs>

    <v-row align="center" class="mb-5" no-gutters>
      <v-col cols="auto" class="mr-3">
        <v-sheet color="primary" rounded="lg" width="6" height="36" />
      </v-col>
      <v-col>
        <p class="text-caption text-medium-emphasis mb-0">
          ระบบจัดการสถานที่สอบ
        </p>
        <p class="text-h6 font-weight-bold mb-0 page-title">
          {{ pageTitle }}
        </p>
      </v-col>
      <v-col cols="auto">
        <v-btn variant="text" class="btn-cancel" @click="backBtn">
          ยกเลิก
        </v-btn>
      </v-col>
    </v-row>

    <v-card elevation="0" rounded="lg" border color="white" class="mb-4">
      <v-card-text class="px-5 py-4">
        <v-row align="center" class="compact-row" no-gutters>
          <v-col cols="12" md="3">
            <span class="field-label">สถานที่สอบ :</span>
          </v-col>
          <v-col cols="12" md="6">
            <span class="readonly-text">{{ facility.Name || '-' }}</span>
          </v-col>
        </v-row>

        <v-row align="center" class="compact-row" no-gutters>
          <v-col cols="12" md="3">
            <span class="field-label">ชื่ออาคารสอบ :</span>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model.trim="building.Name" outlined dense hide-details="auto" class="form-field" />
          </v-col>
        </v-row>

        <v-row align="center" class="compact-row" no-gutters>
          <v-col cols="12" md="3">
            <span class="field-label">ชื่อย่อ :</span>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model.trim="building.Alias" outlined dense hide-details="auto" class="form-field" />
          </v-col>
        </v-row>

        <v-row align="center" class="compact-row" no-gutters>
          <v-col cols="12" md="3">
            <span class="field-label">รายละเอียด :</span>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model.trim="building.Description" outlined dense hide-details class="form-field" />
          </v-col>
        </v-row>

        <v-btn
          color="primary"
          class="btn-save mt-4"
          :loading="loading"
          prepend-icon="mdi-content-save-outline"
          @click="saveBuilding"
        >
          {{ isEditMode ? 'บันทึกการแก้ไขข้อมูลอาคาร' : 'บันทึกข้อมูลอาคาร' }}
        </v-btn>
      </v-card-text>
    </v-card>

    <v-row align="center" class="mb-3" no-gutters>
      <v-col>
        <p class="section-title mb-0">
          ชั้นสอบ
        </p>
      </v-col>
      <v-col cols="auto">
        <v-btn
          color="primary"
          class="btn-add mr-2"
          prepend-icon="mdi-plus"
          :disabled="!building.ID"
          :to="{ path: '/Admins/FloorForm', query: { FacilityID: facility.ID, BuildingID: building.ID } }"
        >
          เพิ่มชั้นสอบ
        </v-btn>
      </v-col>
    </v-row>

    <v-card elevation="0" rounded="lg" border color="white" class="mb-5">
      <v-data-table
        :headers="floorHeaders"
        :items="floors"
        :items-per-page="-1"
        :loading="loading"
        no-data-text="ยังไม่มีข้อมูลชั้นสอบ"
        loading-text="กำลังโหลดข้อมูลชั้นสอบ..."
        class="admin-table"
        hide-default-footer
      >
        <template #[`item.Number`]="{ item }">
          <span class="text-body-2 font-weight-medium">{{ item.Number }}</span>
        </template>

        <template #[`item.Description`]="{ item }">
          <span class="text-body-2 text-medium-emphasis">{{ item.Description || '-' }}</span>
        </template>

        <template #[`item.edit`]="{ item }">
          <v-btn
            small
            outlined
            class="btn-action"
            prepend-icon="mdi-pencil-outline"
            :to="{ path: '/Admins/FloorForm', query: { FacilityID: facility.ID, BuildingID: building.ID, FloorID: item.ID }}"
          >
            แก้ไข
          </v-btn>
        </template>

        <template #[`item.delete`]="{ item }">
          <v-btn
            small
            outlined
            color="error"
            class="btn-action"
            prepend-icon="mdi-delete-outline"
            @click="deleteFloor(item)"
          >
            ลบ
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-card elevation="0" rounded="lg" border color="white">
      <v-card-text class="px-5 py-3">
        <v-row align="center" no-gutters>
          <v-col cols="12" md="2">
            <span class="field-label">ชั้นสอบ :</span>
          </v-col>
          <v-col cols="12" md="5">
            <v-file-input
              ref="floorFileInput"
              v-model="floorFile"
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
            <p class="text-caption text-medium-emphasis mt-1 mb-0">
              Example Excel File: ต้องมีคอลัมน์ Number, Name และ Description
            </p>
          </v-col>
          <v-col cols="12" md="5" class="text-md-right mt-3 mt-md-0">
            <v-btn
              color="primary"
              class="btn-save"
              :loading="loading"
              :disabled="!building.ID || !floorFile"
              prepend-icon="mdi-database-import-outline"
              @click="importFloors"
            >
              บันทึกข้อมูลชั้นสอบ »
            </v-btn>
            <v-btn
              small
              color="warning"
              class="mr-2"
              :href="$apiUrl('/api/template/floor.xls')"
            >
              ดาวโหลดตัวอย่างไฟล์
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
export default {
  name: 'BuildingForm',
  data () {
    return {
      loading: false,
      facility: {
        ID: null,
        Name: '',
        DisplayName: '',
        Description: '',
        CreatedBy: 'Admin'
      },
      building: {
        ID: null,
        Name: '',
        Alias: '',
        Description: ''
      },
      floorFile: null,
      floors: [],
      floorHeaders: [
        { text: 'ชั้นสอบ', value: 'Number', align: 'start', width: '25%' },
        { text: 'รายละเอียด', value: 'Description', align: 'start', width: '45%' },
        { text: 'แก้ไขข้อมูล', value: 'edit', sortable: false, align: 'center', width: '15%' },
        { text: 'ลบข้อมูล', value: 'delete', sortable: false, align: 'center', width: '15%' }
      ],
      breadcrumbs: [
        { text: 'หน้าหลัก', href: '/Admin', disabled: false },
        { text: 'สถานที่สอบ', href: '/Admins/FacilityList', disabled: false },
        { text: 'เพิ่มอาคารสอบ', disabled: true }
      ],
      isEditMode: false
    }
  },
  computed: {
    pageTitle () {
      return this.isEditMode ? 'แก้ไขอาคารสอบ' : 'เพิ่มอาคารสอบ'
    },
    selectedFloorFile () {
      return Array.isArray(this.floorFile) ? this.floorFile[0] : this.floorFile
    }
  },
  mounted () {
    const facilityId = this.$route.params.FacilityID || this.$route.query.FacilityID
    this.facility.ID = facilityId || null
    const buildingId = this.$route.params.BuildingID || this.$route.query.BuildingID
    this.building.ID = buildingId || null
    this.fetchFactilityData(facilityId)
    if (buildingId) {
      this.isEditMode = true
      this.breadcrumbs[2].text = 'แก้ไขอาคารสอบ'
      this.fetchBuildingData(buildingId)
      this.fetchFloorsData(buildingId)
    }
  },
  methods: {
    async fetchFactilityData (id) {
      try {
        const res = await this.$axios.$get(this.$apiUrl(`/api/facility/${id}`))
        const facility = (res.data || [])
        if (!facility) {
          this.$swal.fire({
            icon: 'warning',
            title: 'ไม่พบข้อมูล',
            text: 'ไม่พบข้อมูลสถานที่สอบที่ต้องการแก้ไข',
            confirmButtonText: 'ตกลง'
          })
          this.$router.push('/Admins/FacilityList')
          return
        }

        this.facility = {
          ID: facility.ID,
          Name: facility.Name,
          DisplayName: facility.DisplayName,
          Description: facility.Description,
          CreatedBy: 'Admin'
        }
      } catch (err) {
        this.showError('โหลดข้อมูลไม่สำเร็จ', 'ไม่สามารถโหลดข้อมูลสถานที่สอบได้ กรุณาลองใหม่อีกครั้ง')
      }
    },
    async fetchBuildingData (buildingId) {
      if (!buildingId) {
        this.building = {
          ID: null,
          Name: '',
          Alias: '',
          Description: ''
        }
        return
      }
      this.loading = true
      try {
        const res = await this.$axios.$get(this.$apiUrl(`/api/${this.facility.ID}/building/${buildingId}`))
        const Building = (res.data || [])
        this.building = {
          ID: Building.ID,
          Name: Building.Name,
          Alias: Building.Alias,
          Description: Building.Description
        }
      } finally {
        this.loading = false
      }
    },
    backBtn () {
      this.$router.back()
    },
    async fetchFloorsData (BuildingID) {
      if (!BuildingID) {
        this.floors = []
        return
      }

      try {
        const res = await this.$axios.$get(this.$apiUrl(`/api/${BuildingID}/floors`))
        this.floors = (res.data || [])
      } catch (err) {
        this.showError('โหลดข้อมูลไม่สำเร็จ', 'ไม่สามารถโหลดข้อมูลสถานที่สอบได้ กรุณาลองใหม่อีกครั้ง')
      } finally {
        this.loading = false
      }
    },
    async deleteFloor (item) {
      const result = await this.$swal.fire({
        icon: 'warning',
        title: 'ยืนยันการลบชั้นสอบ',
        text: `คุณต้องการลบชั้นสอบ "${item.Number}" ใช่หรือไม่?`,
        showCancelButton: true,
        confirmButtonText: 'ยืนยันลบ',
        cancelButtonText: 'ยกเลิก',
        confirmButtonColor: '#D32F2F',
        cancelButtonColor: '#757575'
      })

      if (!result.isConfirmed) { return }

      try {
        await this.$axios.$delete(this.$apiUrl(`/api/${this.building.ID}/floor/${item.ID}`))

        await this.$swal.fire({
          icon: 'success',
          title: 'ลบข้อมูลสำเร็จ',
          text: `ลบชั้นสอบ "${item.Number}" เรียบร้อยแล้ว`,
          confirmButtonText: 'ตกลง'
        })
        await this.fetchFloorsData(this.building.ID)
      } catch (err) {
        this.showError('ลบข้อมูลชั้นสอบไม่สำเร็จ', 'กรุณาลองใหม่อีกครั้ง')
      }
    },
    async saveBuilding () {
      try {
        let res
        const payload = {
          Name: this.building.Name,
          Alias: this.building.Alias || '',
          Description: this.building.Description || '',
          CreatedBy: 'Admin'
        }

        if (this.isEditMode) {
          res = await this.$axios.$patch(this.$apiUrl(`/api/${this.facility.ID}/building/update/${this.building.ID}`), payload)
        } else {
          res = await this.$axios.$post(this.$apiUrl(`/api/${this.facility.ID}/buildings`), payload)
          this.building.ID = res.result
          this.isEditMode = true
          this.breadcrumbs[2].text = 'แก้ไขอาคารสอบ'
          this.$router.replace({
            path: '/Admins/BuildingForm',
            query: { FacilityID: this.facility.ID, BuildingID: this.building.ID }
          })
        }

        this.$swal.fire({
          icon: 'success',
          text: this.isEditMode ? 'บันทึกข้อมูลสำเร็จ' : 'สร้างข้อมูลสำเร็จ'
        })
        await this.fetchBuildingData(this.building.ID)
        await this.fetchFloorsData(this.building.ID)
      } catch (err) {
        this.$swal.fire({
          icon: 'error',
          text: 'บันทึกข้อมูลไม่สำเร็จ'
        })
      }
    },
    async importFloors () {
      if (!this.building.ID || !this.selectedFloorFile) {
        this.showError('นำเข้าชั้นสอบไม่สำเร็จ', 'กรุณาบันทึกอาคารสอบและเลือกไฟล์ Excel')
        return
      }

      const formData = new FormData()
      formData.append('file', this.selectedFloorFile)

      this.loading = true
      try {
        const res = await this.$axios.$post(this.$apiUrl(`/api/${this.building.ID}/floors/import`), formData)
        this.floorFile = null
        await this.fetchFloorsData(this.building.ID)
        this.$swal.fire({
          icon: 'success',
          title: 'นำเข้าข้อมูลสำเร็จ',
          text: `นำเข้าชั้นสอบ ${res.imported || 0} รายการ`,
          confirmButtonText: 'ตกลง'
        })
      } catch (err) {
        this.showError('นำเข้าชั้นสอบไม่สำเร็จ', err?.response?.data?.error || 'กรุณาลองใหม่อีกครั้ง')
      } finally {
        this.loading = false
      }
    },
    showError (title, text) {
      this.$swal.fire({
        icon: 'error',
        title,
        text,
        confirmButtonText: 'ตกลง'
      })
    }
  }
}
</script>

<style scoped>
.page-title {
  color: #1A237E;
  letter-spacing: 0 !important;
}

.compact-row {
  min-height: 38px;
  border-bottom: 1px solid #ECEFF1;
}

.compact-row:first-child {
  border-top: 1px solid #ECEFF1;
}

.field-label {
  color: #333333;
  font-size: 13px;
  font-weight: 500;
}

.readonly-text {
  color: #2C2C2A;
  font-size: 13px;
}

.section-title {
  color: #1A237E;
  font-size: 15px;
  font-weight: 700;
}

.form-field :deep(.v-input__slot) {
  min-height: 32px !important;
}

.form-field :deep(input) {
  font-size: 13px !important;
}

.form-field :deep(fieldset) {
  border-color: #B0BEC5 !important;
}

.admin-table {
  box-shadow: none !important;
}

.admin-table :deep(thead tr th) {
  background-color: #EEF2FF !important;
  font-size: 12px !important;
  font-weight: 600 !important;
  color: #1A237E !important;
  border-bottom: 1px solid #C5CAE9 !important;
}

.admin-table :deep(tbody tr td) {
  font-size: 13px !important;
  color: #2C2C2A !important;
  height: 40px !important;
  border-bottom: 0.5px solid #ECEFF1 !important;
}

.admin-table :deep(tbody tr:last-child td) {
  border-bottom: none !important;
}

.admin-table :deep(tbody tr:hover td) {
  background-color: #F8F9FF !important;
}

.btn-add,
.btn-save,
.btn-action,
.btn-cancel {
  text-transform: none !important;
  letter-spacing: 0 !important;
}

.btn-add,
.btn-save {
  font-size: 13px !important;
  border-radius: 6px !important;
}

.btn-action {
  font-size: 12px !important;
}

.btn-cancel {
  color: #555 !important;
  font-size: 13px !important;
}
</style>
