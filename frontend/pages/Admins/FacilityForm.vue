<template>
  <v-row style="justify-content: center;" no-gutters>
    <v-col cols="8">
      <v-container class="admin-page">
        <v-card elevation="0" rounded="lg" border color="gray" class="admin-card mb-4">
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
              {{ isEditMode ? 'บันทึกการแก้ไขข้อมูลสถานที่สอบ' : 'บันทึกข้อมูลสถานที่สอบ' }} »
            </v-btn>
          </v-card-text>
        </v-card>
        <v-card
          v-if="isEditMode"
          elevation="0"
          rounded="lg"
          border
          color="gray"
          class="admin-card mb-5"
        >
          <v-data-table
            :headers="buildingHeaders"
            :items="buildings"
            :items-per-page="-1"
            :loading="buildingLoading"
            no-data-text="ยังไม่มีข้อมูลอาคาร"
            loading-text="กำลังโหลดข้อมูลอาคาร..."
            class="admin-table"
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
                :to="{ path: '/Admins/BuildingForm', query: { FacilityID: facility.ID, BuildingID: item.ID }}"
              >
                แก้ไข
              </v-btn>
            </template>

            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template #[`item.delete`]="{ item }">
              <v-btn
                small
                outlined
                class="btn-action"
                prepend-icon="mdi-delete-outline"
                @click="confirmDeleteBuilding(item)"
              >
                ลบ
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
        <v-row class="mt-10 mb-4">
          <v-col cols="auto">
            <v-btn
              color="primary"
              class="btn-add mr-2"
              prepend-icon="mdi-plus"
              :disabled="!facility.ID"
              :to="{ path: '/Admins/BuildingForm', query: { FacilityID: facility.ID } }"
            >
              เพิ่มอาคารสอบ
            </v-btn>
          </v-col>
        </v-row>
        <v-card elevation="0" rounded="lg" border color="white" class="admin-card admin-import-card">
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
                <p class="admin-helper-text mt-1 mb-0">
                  Example Excel File: ต้องมีคอลัมน์ Name และ Alias
                </p>
              </v-col>
              <v-col cols="12" md="5" class="text-md-right mt-3 mt-md-0">
                <a
                  class="admin-template-link"
                  :href="$apiUrl('/api/template/building.xls')"
                >
                  ดาวน์โหลดตัวอย่างไฟล์
                </a>
                <v-btn
                  color="primary"
                  class="btn-save"
                  :loading="buildingLoading"
                  :disabled="!facility.ID || !buildingFile"
                  prepend-icon="mdi-database-import-outline"
                  @click="importBuildings"
                >
                  บันทึกข้อมูลอาคาร »
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-container>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'FacilityCreate',
  data () {
    return {
      loading: false,
      buildingLoading: false,
      buildingFile: null,
      buildings: [],
      facility: {
        ID: null,
        Name: '',
        DisplayName: '',
        Description: '',
        CreatedBy: 'Admin'
      },
      buildingHeaders: [
        { text: 'อาคารสอบ', value: 'Name', align: 'start', width: '40%' },
        { text: 'รายละเอียด', value: 'edit', sortable: false, align: 'start', width: '40%' },
        { text: '', value: 'delete', sortable: false, align: 'start', width: '20%' }
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
    const id = this.$route.params.ID || this.$route.query.ID
    if (id) {
      this.isEditMode = true
      await this.fetchFacilityById(id)
      await this.fetchBuildings(id)
    }
  },
  methods: {
    async fetchFacilityById (id) {
      this.loading = true
      try {
        const res = await this.$axios.$get(this.$apiUrl('/api/facilities'))
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
    async fetchBuildings (FacilityID = this.facility.ID) {
      if (!FacilityID) {
        this.buildings = []
        return
      }

      this.buildingLoading = true
      try {
        const res = await this.$axios.$get(this.$apiUrl(`/api/${FacilityID}/buildings`))
        this.buildings = res.data || []
      } catch (error) {
        this.showError('โหลดข้อมูลอาคารไม่สำเร็จ', 'ไม่สามารถโหลดข้อมูลอาคารได้ กรุณาลองใหม่อีกครั้ง')
      } finally {
        this.buildingLoading = false
      }
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
    async saveFacility () {
      const valid = this.$refs.form.validate()
      if (!valid) { return }

      this.loading = true
      try {
        let res
        if (this.isEditMode) {
          res = await this.$axios.$patch(this.$apiUrl(`/api/facility/update/${this.facility.ID}`), this.facility)
        } else {
          res = await this.$axios.$post(this.$apiUrl('/api/facility/create'), this.facility)
          this.facility.ID = res.id
          this.isEditMode = true
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
    async importBuildings () {
      if (!this.facility.ID || !this.selectedBuildingFile) {
        this.showError('นำเข้าอาคารไม่สำเร็จ', 'กรุณาบันทึกสถานที่สอบและเลือกไฟล์ Excel')
        return
      }

      const formData = new FormData()
      formData.append('file', this.selectedBuildingFile)

      this.buildingLoading = true
      try {
        const res = await this.$axios.$post(this.$apiUrl(`/api/${this.facility.ID}/buildings/import`), formData)

        this.buildingFile = null
        await this.fetchBuildings()
        this.$swal.fire({
          icon: 'success',
          title: 'นำเข้าข้อมูลสำเร็จ',
          text: `นำเข้าอาคาร ${res.imported || 0} รายการ`,
          confirmButtonText: 'ตกลง'
        })
      } catch (error) {
        this.showError('นำเข้าอาคารไม่สำเร็จ', error?.response?.data?.err || 'กรุณาลองใหม่อีกครั้ง')
      } finally {
        this.buildingLoading = false
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
        await this.$axios.$delete(this.$apiUrl(`/api/${this.facility.ID}/buildings/${item.ID}`))
        this.$swal.fire({
          icon: 'success',
          text: 'ลบสำเร็จ'
        })
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
