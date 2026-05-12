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
          แก้ไขห้องสอบ
        </p>
      </v-col>
      <v-col cols="auto">
        <v-btn variant="text" class="btn-cancel" @click="backBtn">
          ยกเลิก
        </v-btn>
      </v-col>
    </v-row>

    <v-card elevation="0" rounded="lg" border color="white">
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
            <span class="field-label">อาคารสอบ/ชั้น :</span>
          </v-col>
          <v-col cols="12" md="6">
            <span class="readonly-text">{{ building.Name || '-' }} ชั้น {{ floor.Number || '-' }}</span>
          </v-col>
        </v-row>

        <v-row align="center" class="compact-row" no-gutters>
          <v-col cols="12" md="3">
            <span class="field-label">ชื่อห้องสอบ :</span>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model.trim="room.Name" outlined dense hide-details="auto" class="form-field" />
          </v-col>
        </v-row>

        <v-row align="center" class="compact-row" no-gutters>
          <v-col cols="12" md="3">
            <span class="field-label">รายละเอียด :</span>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model.trim="room.Description" outlined dense hide-details class="form-field" />
          </v-col>
        </v-row>

        <v-row align="center" class="compact-row" no-gutters>
          <v-col cols="12" md="3">
            <span class="field-label">จำนวนแถว :</span>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model.trim="room.Rows" outlined dense hide-details="auto" class="form-field" />
          </v-col>
        </v-row>

        <v-row align="center" class="compact-row" no-gutters>
          <v-col cols="12" md="3">
            <span class="field-label">จำนวนคนในแถว :</span>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model.trim="room.Columns" outlined dense hide-details="auto" class="form-field" />
          </v-col>
        </v-row>

        <v-row align="center" class="compact-row" no-gutters>
          <v-col cols="12" md="3">
            <span class="field-label">ห้องสอบที่ :</span>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model.trim="room.No" outlined dense hide-details="auto" class="form-field" />
          </v-col>
        </v-row>

        <v-btn
          color="primary"
          class="btn-save mt-4"
          :loading="loading"
          prepend-icon="mdi-content-save-outline"
          @click="saveEditData"
        >
          บันทึกการแก้ไขข้อมูลห้องสอบ
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
export default {
  name: 'RoomForm',
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
      room: [],
      breadcrumbs: [
        { text: 'หน้าหลัก', href: '/Admin', disabled: false },
        { text: 'สถานที่สอบ', href: '/Admins/FacilityList', disabled: false },
        { text: 'แก้ไขห้องสอบ', disabled: true }
      ]
    }
  },
  mounted () {
    const facilityId = this.$route.query.FacilityID
    this.facility.ID = facilityId || null
    const buildingId = this.$route.query.BuildingID
    this.building.ID = buildingId || null
    const floorId = this.$route.query.FloorID
    this.floor.ID = floorId || null
    const roomId = this.$route.query.RoomID
    this.room = roomId || null
    this.fetchFactilityData(facilityId)
    this.fetchBuildingData(buildingId)
    this.fetchFloorData(floorId)
    this.fetchRoomData(roomId)
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
        this.building = []
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
          Description: BuildingData.Descriptoin
        }
      } finally {
        this.loading = false
      }
    },
    backBtn () {
      this.$router.back()
    },
    async fetchFloorData (floorId) {
      this.loading = true
      try {
        const res = await this.$axios.$get(this.$apiUrl(`/api/${this.building.ID}/floor/${floorId}`))
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
    async fetchRoomData (id) {
      try {
        const res = await this.$axios.$get(this.$apiUrl(`/api/${this.floor.ID}/room/${id}`))
        const roomData = res.data
        this.room = {
          ID: roomData.ID,
          No: roomData.No,
          Name: roomData.Name,
          Rows: roomData.Rows,
          Columns: roomData.Columns,
          TemplateID: roomData.TemplateID,
          Description: roomData.Description
        }
      } catch {
        this.showError('โหลดข้อมูลไม่สำเร็จ', 'ไม่สามารถโหลดข้อมูลสถานที่สอบได้ กรุณาลองใหม่อีกครั้ง')
      }
    },
    async saveEditData () {
      try {
        await this.$axios.$patch(this.$apiUrl(`/api/${this.floor.ID}/room/update/${this.room.ID}`), {
          No: this.room.No,
          Name: this.room.Name,
          Description: this.room.Description,
          Rows: this.room.Rows,
          Columns: this.room.Columns
        })
        this.$swal.fire({
          icon: 'success',
          text: 'แก้ไขข้อมูลสำเร็จ'
        })
        await this.fetchBuildingData(this.building.ID)
      } catch (err) {
        this.$swal.fire({
          icon: 'error',
          text: 'แก้ไขข้อมูลไม่สำเร็จ'
        })
      }
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

.form-field :deep(.v-input__slot) {
  min-height: 32px !important;
}

.form-field :deep(input) {
  font-size: 13px !important;
}

.form-field :deep(fieldset) {
  border-color: #B0BEC5 !important;
}

.btn-save,
.btn-cancel {
  text-transform: none !important;
  letter-spacing: 0 !important;
}

.btn-save {
  font-size: 13px !important;
  border-radius: 6px !important;
}

.btn-cancel {
  color: #555 !important;
  font-size: 13px !important;
}
</style>
