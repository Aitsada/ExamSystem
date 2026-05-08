<template>
  <v-container>
    <h1>Room Form</h1>
    <v-row>
      <v-col cols="6">
        <p>สถานที่สอบ :</p>
      </v-col>
      <v-col cols="6">
        <p>{{ facility.Name }}</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <p>อาคารสอบ/ชั้น :</p>
      </v-col>
      <v-col cols="4">
        <p>{{ building.Name }} ชั้น {{ floor.Number }}</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <p>ชื่อห้องสอบ :</p>
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model.trim="room.Name"
          label=""
          outlined
          dense
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <p>รายละเอียด :</p>
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model.trim="room.Description"
          label=""
          outlined
          dense
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <p>จำนวนแถว :</p>
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model.trim="room.Rows"
          label=""
          outlined
          dense
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <p>จำนวนคนในแถว :</p>
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model.trim="room.Columns"
          label=""
          outlined
          dense
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <p>ห้องสอบที่ :</p>
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model.trim="room.No"
          label=""
          outlined
          dense
        />
      </v-col>
    </v-row>
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
      room: []
    }
  },
  mounted () {
    const facilityId = this.$route.query.FacilityID
    this.facility.ID = facilityId || null
    const buildingId = this.$route.query.BuildingID
    this.building.ID = buildingId || null
    const floorId = this.$route.query.FloorID
    this.floor = floorId || null
    const roomId = this.$route.query.RoomID
    this.room = roomId || null
    console.log('roomId : ', roomId)
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
        const res = await this.$axios.$get(this.$apiUrl(`/api/buildings/${buildingId}`))
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
    testBtn (item) {
    },
    async fetchFloorData (floorId) {
      this.loading = true
      try {
        const res = await this.$axios.$get(this.$apiUrl(`/api/floors/${floorId}`))
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
        const res = await this.$axios.$get(this.$apiUrl(`/api/rooms/${id}`))
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
        console.log('fetchRoomData : ', this.room)
      } catch {
        this.showError('โหลดข้อมูลไม่สำเร็จ', 'ไม่สามารถโหลดข้อมูลสถานที่สอบได้ กรุณาลองใหม่อีกครั้ง')
      }
    }
  }
}
</script>
