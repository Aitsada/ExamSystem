<template>
  <v-container class="admin-page admin-page-wide">
    <v-breadcrumbs :items="breadcrumbs" density="compact" class="admin-breadcrumbs pa-0 mb-4">
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

    <v-card elevation="0" rounded="lg" border color="white" class="admin-card mb-4">
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
            <span class="field-label">อาคารสอบ :</span>
          </v-col>
          <v-col cols="12" md="6">
            <span class="readonly-text">{{ building.Name || '-' }}</span>
          </v-col>
        </v-row>

        <v-row align="center" class="compact-row" no-gutters>
          <v-col cols="12" md="3">
            <span class="field-label">เลขชั้นสอบ :</span>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model.trim="floor.Number" outlined dense hide-details="auto" class="form-field" />
          </v-col>
        </v-row>

        <v-row align="center" class="compact-row" no-gutters>
          <v-col cols="12" md="3">
            <span class="field-label">ชื่อชั้นสอบ :</span>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model.trim="floor.Name" outlined dense hide-details="auto" class="form-field" />
          </v-col>
        </v-row>

        <v-row align="center" class="compact-row" no-gutters>
          <v-col cols="12" md="3">
            <span class="field-label">รายละเอียด :</span>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model.trim="floor.Description" outlined dense hide-details class="form-field" />
          </v-col>
        </v-row>

        <v-btn
          color="primary"
          class="btn-save mt-4"
          :loading="loading"
          prepend-icon="mdi-content-save-outline"
          @click="saveFloor"
        >
          {{ isEditMode ? 'บันทึกการแก้ไขข้อมูลชั้นสอบ' : 'บันทึกข้อมูลชั้นสอบ' }}
        </v-btn>
      </v-card-text>
    </v-card>

    <v-row align="center" class="admin-section-header mb-3" no-gutters>
      <v-col>
        <p class="section-title mb-0">
          ห้องสอบ
        </p>
      </v-col>
      <v-col cols="auto">
        <v-btn
          color="primary"
          class="btn-add mr-2"
          prepend-icon="mdi-plus"
          :disabled="!floor.ID"
          :to="{ path: '/Admins/RoomForm', query: { FacilityID: facility.ID, BuildingID: building.ID, FloorID: floor.ID } }"
        >
          เพิ่มห้องสอบ
        </v-btn>
      </v-col>
    </v-row>

    <v-card elevation="0" rounded="lg" border color="white" class="admin-card mb-5">
      <v-data-table
        :headers="roomHeaders"
        :items="rooms"
        :items-per-page="-1"
        :loading="loading"
        no-data-text="ยังไม่มีข้อมูลห้องสอบ"
        loading-text="กำลังโหลดข้อมูลห้องสอบ..."
        class="admin-table"
        hide-default-footer
      >
        <template #[`item.Name`]="{ item }">
          <span class="text-body-2 font-weight-medium">{{ item.Name }}</span>
        </template>

        <template #[`item.TemplateID`]="{ item }">
          <span class="text-body-2 text-medium-emphasis">{{ item.TemplateID || '-' }}</span>
        </template>

        <template #[`item.edit`]="{ item }">
          <v-btn
            small
            outlined
            class="btn-action"
            prepend-icon="mdi-pencil-outline"
            :to="{ path: '/Admins/RoomForm', query: { FacilityID: facility.ID, BuildingID: building.ID, FloorID: floor.ID, RoomID: item.ID }}"
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
            @click="deleteRoomData(item.ID, item.Name)"
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
            <span class="field-label">ห้องสอบ :</span>
          </v-col>
          <v-col cols="12" md="5">
            <v-file-input
              ref="roomFileInput"
              v-model="roomFile"
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
              Example Excel File: ต้องมีคอลัมน์ No, Name, Rows, Columns และ TemplateID
            </p>
          </v-col>
          <v-col cols="12" md="5" class="text-md-right mt-3 mt-md-0">
            <v-btn
              small
              class="admin-template-btn"
              :href="$apiUrl('/api/template/room.xls')"
            >
              ดาวโหลดตัวอย่างไฟล์
            </v-btn>
            <v-btn
              color="primary"
              class="btn-save mr-2"
              :loading="loading"
              :disabled="!floor.ID || !roomFile"
              prepend-icon="mdi-database-import-outline"
              @click="importRooms"
            >
              บันทึกข้อมูลห้องสอบ »
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
export default {
  name: 'FloorForm',
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
      floor: {
        ID: null,
        Number: '',
        Name: '',
        Description: ''
      },
      roomFile: null,
      rooms: [],
      roomHeaders: [
        { text: 'ห้องสอบ', value: 'Name', align: 'start' },
        { text: 'ห้องสอบที่', value: 'No', align: 'start' },
        { text: 'จำนวนแถว', value: 'Rows', align: 'start' },
        { text: 'จำนวนคนในแถว', value: 'Columns', align: 'start' },
        { text: 'จำนวน', value: 'TemplateID', align: 'start' },
        { text: 'แก้ไขข้อมูล', value: 'edit', sortable: false, align: 'center' },
        { text: 'ลบข้อมูล', value: 'delete', sortable: false, align: 'center' }
      ],
      breadcrumbs: [
        { text: 'หน้าหลัก', href: '/Admin', disabled: false },
        { text: 'สถานที่สอบ', href: '/Admins/FacilityList', disabled: false },
        { text: 'เพิ่มชั้นสอบ', disabled: true }
      ],
      isEditMode: false
    }
  },
  computed: {
    pageTitle () {
      return this.isEditMode ? 'แก้ไขชั้นสอบ' : 'เพิ่มชั้นสอบ'
    },
    selectedRoomFile () {
      return Array.isArray(this.roomFile) ? this.roomFile[0] : this.roomFile
    }
  },
  mounted () {
    const facilityId = this.$route.params.FacilityID || this.$route.query.FacilityID
    this.facility.ID = facilityId || null
    const buildingId = this.$route.params.BuildingID || this.$route.query.BuildingID
    this.building.ID = buildingId || null
    const floorId = this.$route.params.FloorID || this.$route.query.FloorID
    this.floor.ID = floorId || null
    this.fetchFactilityData(facilityId)
    this.fetchBuildingData(buildingId)
    if (floorId) {
      this.isEditMode = true
      this.breadcrumbs[2].text = 'แก้ไขชั้นสอบ'
      this.fetchFloorData(floorId)
      this.fetchRoomsData(floorId)
    }
  },
  methods: {
    async fetchFactilityData (id) {
      try {
        const res = await this.$axios.$get(this.$apiUrl(`/api/facility/${id}`))
        const facilityData = (res.data || [])
        if (!facilityData) {
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
          ID: facilityData.ID,
          Name: facilityData.Name,
          DisplayName: facilityData.DisplayName,
          Description: facilityData.Description,
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
        const BuildingData = (res.data || [])
        this.building = {
          ID: BuildingData.ID,
          Name: BuildingData.Name,
          Alias: BuildingData.Alias,
          Description: BuildingData.Description
        }
      } finally {
        this.loading = false
      }
    },
    backBtn () {
      this.$router.back()
    },
    async fetchFloorData (FloorID) {
      if (!FloorID) {
        this.floor = {
          ID: null,
          Number: '',
          Name: '',
          Description: ''
        }
        return
      }

      this.loading = true
      try {
        const res = await this.$axios.$get(this.$apiUrl(`/api/${this.building.ID}/floor/${FloorID}`))
        const floorData = (res.data || [])
        this.floor = {
          ID: floorData.ID,
          Number: floorData.Number,
          Name: floorData.Name,
          Description: floorData.Description
        }
      } catch (err) {
        this.showError('โหลดข้อมูลไม่สำเร็จ', 'ไม่สามารถโหลดข้อมูลสถานที่สอบได้ กรุณาลองใหม่อีกครั้ง')
      } finally {
        this.loading = false
      }
    },
    async fetchRoomsData (FloorID) {
      if (!FloorID) {
        this.rooms = []
        return
      }

      try {
        const res = await this.$axios.$get(this.$apiUrl(`/api/${FloorID}/rooms`))
        this.rooms = res.data
      } catch {
        this.showError('โหลดข้อมูลไม่สำเร็จ', 'ไม่สามารถโหลดข้อมูลสถานที่สอบได้ กรุณาลองใหม่อีกครั้ง')
      }
    },
    async saveFloor () {
      try {
        let res
        const payload = {
          Number: this.floor.Number,
          Name: this.floor.Name || '',
          Description: this.floor.Description || '',
          CreatedBy: 'Admin'
        }

        if (this.isEditMode) {
          res = await this.$axios.$patch(this.$apiUrl(`/api/${this.building.ID}/floor/${this.floor.ID}`), payload)
        } else {
          res = await this.$axios.$post(this.$apiUrl(`/api/${this.building.ID}/floor`), payload)
          this.floor.ID = res.data
          this.isEditMode = true
          this.breadcrumbs[2].text = 'แก้ไขชั้นสอบ'
          this.$router.replace({
            path: '/Admins/FloorForm',
            query: { FacilityID: this.facility.ID, BuildingID: this.building.ID, FloorID: this.floor.ID }
          })
        }

        this.$swal.fire({
          icon: 'success',
          text: 'บันทึกข้อมูลสำเร็จ'
        })
        await this.fetchFloorData(this.floor.ID)
        await this.fetchRoomsData(this.floor.ID)
      } catch (err) {
        this.$swal.fire({
          icon: 'error',
          text: 'บันทึกข้อมูลผิดพลาด'
        })
      }
    },
    async importRooms () {
      if (!this.floor.ID || !this.selectedRoomFile) {
        this.showError('นำเข้าห้องสอบไม่สำเร็จ', 'กรุณาบันทึกชั้นสอบและเลือกไฟล์ Excel')
        return
      }

      const formData = new FormData()
      formData.append('file', this.selectedRoomFile)

      this.loading = true
      try {
        const res = await this.$axios.$post(this.$apiUrl(`/api/${this.floor.ID}/rooms/import`), formData)
        this.roomFile = null
        await this.fetchRoomsData(this.floor.ID)
        this.$swal.fire({
          icon: 'success',
          title: 'นำเข้าข้อมูลสำเร็จ',
          text: `นำเข้าห้องสอบ ${res.imported || 0} รายการ`,
          confirmButtonText: 'ตกลง'
        })
      } catch (err) {
        this.showError('นำเข้าห้องสอบไม่สำเร็จ', err?.response?.data?.message || 'กรุณาลองใหม่อีกครั้ง')
      } finally {
        this.loading = false
      }
    },
    async deleteRoomData (roomID, roomName) {
      const result = await this.$swal.fire({
        icon: 'warning',
        title: 'ยืนยันการลบห้องสอบ',
        text: `คุณต้องการลบห้องสอบ "${roomName}" ใช่หรือไม่?`,
        showCancelButton: true,
        confirmButtonColor: '#D32F2F',
        cancelButtonColor: '#757575',
        confirmButtonText: 'ยืนยันลบ',
        cancelButtonText: 'ยกเลิก'
      })

      if (!result.isConfirmed) {
        return
      }

      try {
        await this.$axios.$delete(
          this.$apiUrl(`/api/${this.floor.ID}/room/${roomID}`)
        )

        await this.$swal.fire({
          title: 'ลบข้อมูลสำเร็จ',
          text: `ลบห้องสอบ "${roomName}" เรียบร้อยแล้ว`,
          confirmButtonText: 'ตกลง',
          icon: 'success'
        })

        await this.fetchRoomsData(this.floor.ID)
      } catch (err) {
        this.$swal.fire({
          icon: 'error',
          text: 'ลบข้อมูลห้องสอบผิดพลาด'
        })
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
