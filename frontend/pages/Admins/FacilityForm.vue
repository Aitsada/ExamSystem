<template>
  <v-container style="max-width: 900px; padding: 0;">
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

    <v-row align="center" class="mb-5" no-gutters>
      <v-col cols="auto" class="mr-3">
        <v-sheet color="primary" rounded="lg" width="6" height="36" />
      </v-col>
      <v-col>
        <p class="text-caption text-medium-emphasis mb-0">
          ระบบจัดการสถานที่สอบ
        </p>
        <p class="text-h6 font-weight-bold mb-0" style="color: #1A237E; letter-spacing: 0.02em;">
          {{ pageTitle }}
        </p>
      </v-col>
      <v-col cols="auto">
        <v-btn
          variant="text"
          class="btn-cancel"
          @click="backBtn"
        >
          ยกเลิก
        </v-btn>
      </v-col>
    </v-row>
    <v-btn @click="testBtn">
      TEsT
    </v-btn>
    <v-card elevation="0" rounded="lg" border color="white" class="mb-4">
      <v-card-text class="px-5 py-4">
        <v-form ref="form">
          <v-row align="center" class="compact-row" no-gutters>
            <v-col cols="12" md="3">
              <span class="field-label">ชื่อสถานที่สอบ :</span>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.trim="facility.Name"
                dense
                outlined
                hide-details="auto"
                :rules="[v => !!v || 'กรุณากรอกชื่อสถานที่สอบ']"
                class="form-field"
              />
            </v-col>
          </v-row>

          <v-row align="center" class="compact-row" no-gutters>
            <v-col cols="12" md="3">
              <span class="field-label">ชื่อแสดง :</span>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.trim="facility.DisplayName"
                dense
                outlined
                hide-details="auto"
                :rules="[v => !!v || 'กรุณากรอกชื่อแสดง']"
                class="form-field"
              />
            </v-col>
          </v-row>

          <v-row align="center" class="compact-row" no-gutters>
            <v-col cols="12" md="3">
              <span class="field-label">รายละเอียด :</span>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.trim="facility.Description"
                dense
                outlined
                hide-details
                class="form-field"
              />
            </v-col>
          </v-row>
        </v-form>

        <v-btn
          color="primary"
          class="btn-save mt-4"
          :loading="loading"
          prepend-icon="mdi-content-save-outline"
          @click="saveFacility"
        >
          {{ isEditMode ? 'บันทึกข้อมูลสถานที่สอบ' : 'บันทึกข้อมูลสถานที่สอบ' }} »
        </v-btn>
      </v-card-text>
    </v-card>

    <v-row align="center" class="mb-3" no-gutters>
      <v-col>
        <p class="section-title mb-0">
          อาคารสอบ
        </p>
      </v-col>
      <v-col cols="auto">
        <v-btn
          color="primary"
          class="btn-add"
          prepend-icon="mdi-file-excel-outline"
          :disabled="!facility.ID"
          @click="focusBuildingFile"
        >
          เพิ่มอาคารจาก Excel
        </v-btn>
      </v-col>
    </v-row>

    <v-card elevation="0" rounded="lg" border color="white" class="mb-5">
      <v-data-table
        :headers="buildingHeaders"
        :items="buildings"
        :items-per-page="-1"
        :loading="buildingLoading"
        no-data-text="ยังไม่มีข้อมูลอาคาร"
        loading-text="กำลังโหลดข้อมูลอาคาร..."
        class="building-table"
        hide-default-footer
      >
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #[`item.Name`]="{ item }">
          <span class="text-body-2 font-weight-medium">{{ item.Name }}</span>
        </template>

        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #[`item.Description`]="{ item }">
          <span class="text-body-2 text-medium-emphasis">{{ item.Description || '-' }}</span>
        </template>

        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #[`item.edit`]="{ item }">
          <v-btn
            small
            outlined
            class="btn-action"
            prepend-icon="mdi-pencil-outline"
            @click="openBuildingDialog(item)"
          >
            แก้ไข
          </v-btn>
        </template>

        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #[`item.delete`]="{ item }">
          <v-btn
            small
            outlined
            color="error"
            class="btn-action"
            prepend-icon="mdi-delete-outline"
            @click="confirmDeleteBuilding(item)"
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
            <span class="field-label">อาคาร :</span>
          </v-col>
          <v-col cols="12" md="5">
            <v-file-input
              ref="buildingFileInput"
              v-model="buildingFile"
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
              Example Excel File: ต้องมีคอลัมน์ Name และ Alias
            </p>
          </v-col>
          <v-col cols="12" md="5" class="text-md-right mt-3 mt-md-0">
            <v-btn
              color="primary"
              class="btn-save"
              :loading="loading"
              :disabled="!facility.ID || !buildingFile"
              prepend-icon="mdi-database-import-outline"
              @click="saveFacility"
            >
              บันทึกข้อมูลอาคาร »
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-dialog v-model="buildingDialog" max-width="520">
      <v-card>
        <v-card-title class="text-subtitle-1 font-weight-bold">
          แก้ไขข้อมูลอาคาร
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model.trim="editingBuilding.Name"
            label="ชื่ออาคาร"
            dense
            outlined
            hide-details="auto"
            class="mb-3"
          />
          <v-text-field
            v-model.trim="editingBuilding.Alias"
            label="ชื่อย่อ"
            dense
            outlined
            hide-details
            class="mb-3"
          />
          <v-text-field
            v-model.trim="editingBuilding.Description"
            label="รายละเอียด"
            dense
            outlined
            hide-details
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text class="btn-cancel" @click="buildingDialog = false">
            ยกเลิก
          </v-btn>
          <v-btn color="primary" class="btn-save" :loading="buildingSaving" @click="saveBuildingEdit">
            บันทึก
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'FacilityCreate',
  data () {
    return {
      loading: false,
      buildingLoading: false,
      buildingSaving: false,
      buildingDialog: false,
      buildingFile: null,
      buildings: [],
      editingBuilding: {
        ID: null,
        Name: '',
        Alias: '',
        Description: ''
      },
      facility: {
        ID: null,
        Name: '',
        DisplayName: '',
        Description: '',
        CreatedBy: 'Admin'
      },
      buildingHeaders: [
        { text: 'อาคารสอบ', value: 'Name', align: 'start', width: '35%' },
        { text: 'รายละเอียด', value: 'Description', align: 'start', width: '35%' },
        { text: 'แก้ไขข้อมูล', value: 'edit', sortable: false, align: 'center', width: '15%' },
        { text: 'ลบข้อมูล', value: 'delete', sortable: false, align: 'center', width: '15%' }
      ],
      breadcrumbs: [
        { text: 'หน้าหลัก', href: '/Admin', disabled: false },
        { text: 'สถานที่สอบ', href: '/Admins/FacilityList', disabled: false },
        { text: 'เพิ่มสถานที่สอบ', disabled: true }
      ],
      isEditMode: false
    }
  },
  computed: {
    pageTitle () {
      return this.isEditMode ? 'แก้ไขสถานที่สอบ' : 'เพิ่มสถานที่สอบ'
    },
    selectedBuildingFile () {
      return Array.isArray(this.buildingFile) ? this.buildingFile[0] : this.buildingFile
    }
  },
  async mounted () {
    const id = this.$route.query.ID
    if (id) {
      this.isEditMode = true
      this.breadcrumbs[2].text = 'แก้ไขสถานที่สอบ'
      await this.fetchFacilityById(id)
      await this.fetchBuildings(id)
    }
  },
  methods: {
    async fetchFacilityById (id) {
      this.loading = true
      try {
        const res = await this.$axios.$get(this.$apiUrl('/api'))
        const facility = (res.data || []).find(item => String(item.ID) === String(id))

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
          Name: facility.Name || '',
          DisplayName: facility.DisplayName || '',
          Description: facility.Description || '',
          CreatedBy: facility.CreatedBy || 'Admin'
        }
      } catch (error) {
        this.showError('โหลดข้อมูลไม่สำเร็จ', 'ไม่สามารถโหลดข้อมูลสถานที่สอบได้ กรุณาลองใหม่อีกครั้ง')
      } finally {
        this.loading = false
      }
    },
    async fetchBuildings (facilityId = this.facility.ID) {
      if (!facilityId) {
        this.buildings = []
        return
      }

      this.buildingLoading = true
      try {
        const res = await this.$axios.$get(this.$apiUrl(`/api/${facilityId}/buildings`))
        this.buildings = res.data || []
      } catch (error) {
        this.showError('โหลดข้อมูลอาคารไม่สำเร็จ', 'ไม่สามารถโหลดข้อมูลอาคารได้ กรุณาลองใหม่อีกครั้ง')
      } finally {
        this.buildingLoading = false
      }
    },
    testBtn () {
      console.log(this.facility.Name, this.facility.DisplayName)
    },
    backBtn () {
      this.$router.back()
    },
    focusBuildingFile () {
      const input = this.$refs.buildingFileInput?.$el?.querySelector('input[type="file"]')
      if (input) {
        input.click()
      }
    },
    buildFacilityFormData () {
      const formData = new FormData()
      formData.append('Name', this.facility.Name)
      formData.append('DisplayName', this.facility.DisplayName)
      formData.append('Description', this.facility.Description || '')
      formData.append('CreatedBy', this.facility.CreatedBy)

      if (this.selectedBuildingFile) {
        formData.append('buildingFile', this.selectedBuildingFile)
      }

      return formData
    },
    async saveFacility () {
      const valid = this.$refs.form.validate()
      if (!valid) { return }

      this.loading = true
      try {
        let res
        if (this.isEditMode) {
          res = await this.$axios.$patch(this.$apiUrl(`/api/update/${this.facility.ID}`), this.buildFacilityFormData())
        } else {
          console.log('Create Facility Response:', this.buildFacilityFormData())
          res = await this.$axios.$post(this.$apiUrl('/api/create'), this.facility)
          console.log('Create Facility Response:', this.facility)
          this.facility.ID = res.id
          this.isEditMode = true
          this.breadcrumbs[2].text = 'แก้ไขสถานที่สอบ'
          this.$router.replace({
            path: '/Admins/FacilityForm',
            query: { ID: res.id }
          })
        }

        this.buildingFile = null
        await this.fetchBuildings(this.facility.ID)

        this.$swal.fire({
          icon: 'success',
          title: 'บันทึกข้อมูลสำเร็จ',
          text: res.importedBuildings ? `นำเข้าอาคาร ${res.importedBuildings} รายการ` : 'บันทึกข้อมูลสถานที่สอบสำเร็จ',
          confirmButtonText: 'ตกลง'
        })
      } catch (err) {
        this.showError('บันทึกข้อมูลไม่สำเร็จ', err?.response?.data?.message || 'กรุณาลองใหม่อีกครั้ง')
      } finally {
        this.loading = false
      }
    },
    openBuildingDialog (item) {
      this.editingBuilding = {
        ID: item.ID,
        Name: item.Name || '',
        Alias: item.Alias || '',
        Description: item.Description || ''
      }
      this.buildingDialog = true
    },
    async saveBuildingEdit () {
      if (!this.editingBuilding.Name) {
        this.showError('บันทึกข้อมูลไม่สำเร็จ', 'กรุณากรอกชื่ออาคาร')
        return
      }

      this.buildingSaving = true
      try {
        await this.$axios.$patch(this.$apiUrl(`/api/buildings/${this.editingBuilding.ID}`), {
          Name: this.editingBuilding.Name,
          Alias: this.editingBuilding.Alias || '',
          Description: this.editingBuilding.Description || ''
        })

        this.buildingDialog = false
        await this.fetchBuildings()
      } catch (error) {
        this.showError('บันทึกข้อมูลอาคารไม่สำเร็จ', 'กรุณาลองใหม่อีกครั้ง')
      } finally {
        this.buildingSaving = false
      }
    },
    async confirmDeleteBuilding (item) {
      const result = await this.$swal.fire({
        icon: 'warning',
        title: 'ยืนยันการลบอาคาร',
        text: `คุณต้องการลบ "${item.Name}" ใช่หรือไม่?`,
        showCancelButton: true,
        confirmButtonText: 'ยืนยันลบ',
        cancelButtonText: 'ยกเลิก',
        confirmButtonColor: '#D32F2F',
        cancelButtonColor: '#757575'
      })

      if (!result.isConfirmed) { return }

      try {
        await this.$axios.$delete(this.$apiUrl(`/api/buildings/${item.ID}`))
        await this.fetchBuildings()
      } catch (error) {
        this.showError('ลบข้อมูลอาคารไม่สำเร็จ', 'กรุณาลองใหม่อีกครั้ง')
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

.building-table {
  box-shadow: none !important;
}

.building-table :deep(thead tr th) {
  background-color: #EEF2FF !important;
  font-size: 12px !important;
  font-weight: 600 !important;
  color: #1A237E !important;
  border-bottom: 1px solid #C5CAE9 !important;
}

.building-table :deep(tbody tr td) {
  font-size: 13px !important;
  color: #2C2C2A !important;
  height: 40px !important;
  border-bottom: 0.5px solid #ECEFF1 !important;
}

.building-table :deep(tbody tr:last-child td) {
  border-bottom: none !important;
}

.building-table :deep(tbody tr:hover td) {
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
