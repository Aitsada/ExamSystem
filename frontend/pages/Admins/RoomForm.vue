<template>
  <v-container class="admin-page">
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

    <v-card elevation="0" rounded="lg" border color="white" class="admin-card">
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

        <v-row align="center" class="compact-row" no-gutters>
          <v-col cols="12" md="3">
            <span class="field-label">Template ID :</span>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model.trim="room.TemplateID" outlined dense hide-details="auto" class="form-field" />
          </v-col>
        </v-row>

        <v-btn
          color="primary"
          class="btn-save mt-4"
          :loading="loading"
          prepend-icon="mdi-content-save-outline"
          @click="saveRoom"
        >
          {{ isEditMode ? 'บันทึกการแก้ไขข้อมูลห้องสอบ' : 'บันทึกข้อมูลห้องสอบ' }}
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
      room: {
        ID: null,
        No: '',
        Name: '',
        Rows: '',
        Columns: '',
        TemplateID: '',
        Description: ''
      },
      breadcrumbs: [
        { text: 'หน้าหลัก', href: '/Admin', disabled: false },
        { text: 'สถานที่สอบ', href: '/Admins/FacilityList', disabled: false },
        { text: 'เพิ่มห้องสอบ', disabled: true }
      ],
      isEditMode: false
    }
  },
  computed: {
    pageTitle () {
      return this.isEditMode ? 'แก้ไขห้องสอบ' : 'เพิ่มห้องสอบ'
    }
  },
  mounted () {
    const facilityId = this.$route.params.FacilityID || this.$route.query.FacilityID
    this.facility.ID = facilityId || null
    const buildingId = this.$route.params.BuildingID || this.$route.query.BuildingID
    this.building.ID = buildingId || null
    const floorId = this.$route.params.FloorID || this.$route.query.FloorID
    this.floor.ID = floorId || null
    const roomId = this.$route.params.RoomID || this.$route.query.RoomID
    this.fetchFactilityData(facilityId)
    this.fetchBuildingData(buildingId)
    this.fetchFloorData(floorId)
    if (roomId) {
      this.isEditMode = true
      this.breadcrumbs[2].text = 'แก้ไขห้องสอบ'
      this.room.ID = roomId
      this.fetchRoomData(roomId)
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
    async fetchFloorData (floorId) {
      if (!floorId) {
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
      if (!id) {
        return
      }

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
    async saveRoom () {
      try {
        let res
        const payload = {
          No: this.room.No,
          Name: this.room.Name,
          Description: this.room.Description,
          Rows: this.room.Rows,
          Columns: this.room.Columns,
          TemplateID: this.room.TemplateID || 0,
          CreatedBy: 'Admin'
        }

        if (this.isEditMode) {
          res = await this.$axios.$patch(this.$apiUrl(`/api/${this.floor.ID}/room/update/${this.room.ID}`), payload)
        } else {
          res = await this.$axios.$post(this.$apiUrl(`/api/${this.floor.ID}/room`), payload)
          this.room.ID = res.data
          this.isEditMode = true
          this.breadcrumbs[2].text = 'แก้ไขห้องสอบ'
          this.$router.replace({
            path: '/Admins/RoomForm',
            query: { FacilityID: this.facility.ID, BuildingID: this.building.ID, FloorID: this.floor.ID, RoomID: this.room.ID }
          })
        }

        this.$swal.fire({
          icon: 'success',
          text: 'บันทึกข้อมูลสำเร็จ'
        })
        await this.fetchRoomData(this.room.ID)
      } catch (err) {
        this.$swal.fire({
          icon: 'error',
          text: `บันทึกข้อมูลไม่สำเร็จ ${err.message}`
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
