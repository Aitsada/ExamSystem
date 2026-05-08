<template>
  <v-container>
    <h1>Floor Form</h1>
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
        <p>อาคารสอบ :</p>
      </v-col>
      <v-col cols="4">
        <p>{{ building.Name }}</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <p>เลขชั้นสอบ :</p>
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model.trim="floor.Number"
          label=""
          outlined
          dense
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <p>ชื่อชั้นสอบ :</p>
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model.trim="floor.Name"
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
          v-model.trim="floor.Description"
          label=""
          outlined
          dense
        />
      </v-col>
    </v-row>
    <v-simple-table
      :loading="loading"
      no-results-text="ไม่พบข้อมูลอาคารสอบ"
      no-results-icon="mdi-office-building"
      class="building-table"
      hide-default-footer
      style="margin-top: 20px;"
    >
      <template #default>
        <thead>
          <tr>
            <th class="text-left">
              ห้องสอบ
            </th>
            <th class="text-left">
              ห้องสอบที่
            </th>
            <th class="text-left">
              จำนวนแถว
            </th>
            <th class="text-left">
              จำนวนคนในแถว
            </th>
            <th class="text-left">
              จำนวน
            </th>
            <th class="text-left">
              รายละเอียด
            </th>
            <th class="text-left" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in rooms" :key="item.ID">
            <td>{{ item.Name }}</td>
            <td>{{ item.No }}</td>
            <td>{{ item.Rows }}</td>
            <td>{{ item.Columns }}</td>
            <td>{{ item.TemplateID }}</td>
            <td>
              <v-btn small :to="{ path:'/Admins/RoomForm', query:{ FacilityID: facility.ID, BuildingID: building.ID, FloorID: floor.ID, RoomID: item.ID }}">
                แก้ไข
              </v-btn>
            </td>
            <td>
              <v-btn small color="error" @click="testBtn(item.ID)">
                ลบ
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
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
      rooms: []
    }
  },
  mounted () {
    const facilityId = this.$route.query.FacilityID
    this.facility.ID = facilityId || null
    const buildingId = this.$route.query.BuildingID
    this.building.ID = buildingId || null
    const floorId = this.$route.query.FloorID
    this.floor = floorId || null
    this.fetchFactilityData(facilityId)
    this.fetchBuildingData(buildingId)
    this.fetchFloorData(floorId)
    this.fetchRoomsData(floorId)
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
      console.log('Test button clicked', item)
    },
    async fetchFloorData (FloorID) {
      this.loading = true
      try {
        const res = await this.$axios.$get(this.$apiUrl(`/api/floors/${FloorID}`))
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
      try {
        const res = await this.$axios.$get(this.$apiUrl(`/api/${FloorID}/rooms`))
        this.rooms = res.data
      } catch {
        this.showError('โหลดข้อมูลไม่สำเร็จ', 'ไม่สามารถโหลดข้อมูลสถานที่สอบได้ กรุณาลองใหม่อีกครั้ง')
      }
    }
  }
}
</script>
