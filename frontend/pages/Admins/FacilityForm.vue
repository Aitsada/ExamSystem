<template>
  <v-container class="admin-page">
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

    <v-row align="center" class="admin-page-header mb-5" no-gutters>
      <v-col cols="auto" class="mr-3">
        <div class="admin-title-marker" />
      </v-col>
      <v-col>
        <p class="admin-eyebrow mb-0">
          ระบบจัดการสถานที่สอบ
        </p>
        <p class="admin-page-title mb-0">
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
    <v-card elevation="0" rounded="lg" border color="white" class="admin-card mb-4">
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

    <v-row align="center" class="admin-section-header mb-3" no-gutters>
      <v-col>
        <p class="section-title mb-0">
          อาคารสอบ
        </p>
      </v-col>
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

    <v-card
      elevation="0"
      rounded="lg"
      border
      color="white"
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
            <v-btn
              small
              class="admin-template-btn"
              :href="$apiUrl('/api/template/building.xls')"
            >
              ดาวโหลดตัวอย่างไฟล์
            </v-btn>
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
    const id = this.$route.params.ID || this.$route.query.ID
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
        await this.$axios.$delete(this.$apiUrl(`/api/${this.facility.ID}/building/${item.ID}`))
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
