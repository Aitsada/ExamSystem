<template>
  <v-container>
    <h1>Building Form</h1>
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
        <p>ชื่ออาคารสอบ :</p>
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model.trim="building.Name"
          label=""
          outlined
          dense
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <p>ชื่อย่อ :</p>
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model.trim="building.Alias"
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
          v-model.trim="building.Description"
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
              ชั้นสอบ
            </th>
            <th class="text-left">
              รายละเอียด
            </th>
            <th class="text-left" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in floors" :key="item.ID">
            <td>{{ item.Number }}</td>
            <td>
              <v-btn small :to=" {path: '/Admins/FloorForm', query: { FacilityID: facility.ID, BuildingID: building.ID, FloorID: item.ID }}">
                แก้ไข
              </v-btn>
            </td>
            <td>
              <v-btn small color="error" @click="deleteFloor(item.ID)">
                ลบ
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <v-row>
      <v-col style="text-align: end;">
        <v-btn color="success" @click="saveEditData()">
          บันทึกการแก้ไข
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col style="text-align: start;">
        <v-btn color="success" @click="testBtn">
          บันทึกการแก้ไข
        </v-btn>
      </v-col>
    </v-row>
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
      floors: []
    }
  },
  mounted () {
    const facilityId = this.$route.query.FacilityID
    this.facility.ID = facilityId || null
    const buildingId = this.$route.query.BuildingID
    this.building.ID = buildingId || null
    this.fetchFactilityData(facilityId)
    this.fetchBuildingData(buildingId)
    this.fetchFloorsData(buildingId)
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
        this.building = []
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
    testBtn () {
      console.log('testBtn : ', this.buildingId)
    },
    async fetchFloorsData (BuildingID) {
      try {
        const res = await this.$axios.$get(this.$apiUrl(`/api/${BuildingID}/floors`))
        this.floors = (res.data || [])
      } catch (err) {
        this.showError('โหลดข้อมูลไม่สำเร็จ', 'ไม่สามารถโหลดข้อมูลสถานที่สอบได้ กรุณาลองใหม่อีกครั้ง')
      } finally {
        this.loading = false
      }
    },
    async deleteFloor (id) {
      console.log(id)
      try {
        await this.$axios.$delete(this.$apiUrl(`/api/${this.building.ID}/floor/${id}`))

        await this.fetchFloorsData()
      } catch (err) {
        this.showError('โหลดข้อมูลไม่สำเร็จ', 'ไม่สามารถโหลดข้อมูลสถานที่สอบได้ กรุณาลองใหม่อีกครั้ง')
      }
    },
    async saveEditData () {
      try {
        await this.$axios.$patch(this.$apiUrl(`/api/${this.facility.ID}/building/update/${this.building.ID}`), {
          Name: this.building.Name,
          Alias: this.building.Alias || '',
          Description: this.building.Description || ''
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
