<template>
  <v-card class="seat-mapping-card">
    <v-row class="seat-mapping-header">
      <v-col>
        <p>หน่วยงาน: {{ organization.Name || '-' }}</p>
        <p>สถานที่สอบ: {{ facility.Name || '-' }}</p>
        <p>{{ examDateText }}</p>
      </v-col>
    </v-row>
    <v-divider class="my-5" />
    <v-row>
      <v-col cols="12" md="7">
        <v-simple-table class="bordered-table">
          <template #default>
            <thead>
              <tr>
                <th class="select-col" />
                <th class="text-left">
                  ลำดับ
                </th>
                <th class="text-left">
                  ชื่อตำแหน่ง
                </th>
                <th class="text-left">
                  จำนวนผู้สมัคร
                </th>
                <th class="text-left">
                  มีที่นั่งสอบ
                </th>
                <th class="text-left">
                  ไม่มีที่นั่งสอบ
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in position"
                :key="item.ID"
              >
                <td class="select-col">
                  <v-checkbox
                    dense
                    hide-details
                    :input-value="selectedPositionID === item.ID"
                    @change="togglePosition(item.ID)"
                  />
                </td>
                <td>{{ index + 1 }}</td>
                <td>{{ item.Name }}</td>
                <td>{{ positionApplicantCount(item) }}</td>
                <td>{{ positionApplicantCount(item) }}</td>
                <td>0</td>
              </tr>
              <tr v-if="!position.length">
                <td colspan="6" class="empty-cell">
                  ไม่พบข้อมูลตำแหน่ง
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      <v-col cols="12" md="5">
        <v-simple-table class="bordered-table facility-table">
          <template #default>
            <thead>
              <tr>
                <th class="expand-col" />
                <th class="text-left">
                  สถานที่สอบ/อาคาร
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="floorItem in floorRows"
                :key="floorItem.key"
              >
                <td class="expand-col">
                  <v-btn
                    icon
                    x-small
                    class="expand-button"
                    @click="toggleFloor(floorItem.key)"
                  >
                    <v-icon small>
                      {{ isFloorExpanded(floorItem.key) ? 'mdi-minus-box-outline' : 'mdi-plus-box-outline' }}
                    </v-icon>
                  </v-btn>
                </td>
                <td>
                  <p class="floor-title">
                    {{ floorTitle(floorItem) }}
                  </p>
                  <v-simple-table
                    v-if="isFloorExpanded(floorItem.key)"
                    class="bordered-table room-table"
                  >
                    <template #default>
                      <thead>
                        <tr>
                          <th class="select-col" />
                          <th class="text-left">
                            ห้อง
                          </th>
                          <th class="text-left">
                            จำนวนที่นั่งสอบ
                          </th>
                          <th class="text-left">
                            มีผู้สอบ
                          </th>
                          <th class="text-left">
                            ไม่มีผู้สอบ
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="room in floorItem.rooms"
                          :key="room.ID"
                        >
                          <td class="select-col">
                            <v-checkbox
                              dense
                              hide-details
                              :input-value="isRoomSelected(room.ID)"
                              :disabled="!selectedPositionID || mappingLoading"
                              @change="toggleRoom(room.ID)"
                            />
                          </td>
                          <td>{{ room.Name || room.No || '-' }}</td>
                          <td>{{ roomSeatCount(room) }}</td>
                          <td>{{ roomApplicantCount(room) }}</td>
                          <td>{{ roomAvailableSeatCount(room) }}</td>
                        </tr>
                        <tr v-if="!floorItem.rooms.length">
                          <td colspan="5" class="empty-cell">
                            ไม่พบข้อมูลห้อง
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </td>
              </tr>
              <tr v-if="!floorRows.length">
                <td colspan="2" class="empty-cell">
                  ไม่พบข้อมูลอาคาร/ชั้น
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
    <v-divider class="my-5" />
    <v-btn
      :loading="mappingLoading"
      :disabled="!selectedPositionID || !selectedRoomIDs.length"
      @click="saveSeatMapping"
    >
      จัดที่นั่งสอบ
    </v-btn>
  </v-card>
</template>

<script>
export default {
  name: 'SeatMapping',
  data () {
    return {
      organization: {},
      facility: {},
      exam: {},
      examDate: '',
      startTime: '',
      endTime: '',
      buildings: [],
      floorRows: [],
      position: [],
      expandedFloors: {},
      selectedPositionID: null,
      selectedRoomIDs: [],
      roomMappingCounts: {},
      mappingLoading: false
    }
  },
  computed: {
    examDateText () {
      if (!this.examDate) {
        return 'สอบ'
      }
      return `สอบ${this.formatThaiDate(this.examDate)} เวลา ${this.startTime} - ${this.endTime} น.`
    }
  },
  mounted () {
    const facilityID = this.$route.query.FacilityID
    const organizationID = this.$route.query.OrganizationID
    const examID = this.$route.query.ExamID
    this.facility.ID = facilityID
    this.organization.ID = organizationID
    this.exam.ID = examID
    this.examDate = this.$route.query.ExamDate || ''
    this.startTime = this.$route.query.StartTime || ''
    this.endTime = this.$route.query.EndTime || ''
    this.fetchOrganization()
    this.fetchFacilitByID()
    this.fetchBuildingByFacilityID()
    this.fetchPositionByExamID()
  },
  methods: {
    togglePosition (positionID) {
      if (this.selectedPositionID === positionID) {
        this.selectedPositionID = null
        this.selectedRoomIDs = []
        return
      }

      this.selectedPositionID = positionID
      this.selectedRoomIDs = []
    },
    isRoomSelected (roomID) {
      return this.selectedRoomIDs.includes(roomID)
    },
    toggleRoom (roomID) {
      if (!this.selectedPositionID) {
        this.showError('จัดที่นั่งสอบไม่สำเร็จ', 'กรุณาเลือกตำแหน่งก่อนเลือกห้องสอบ')
        return
      }

      if (this.isRoomSelected(roomID)) {
        this.selectedRoomIDs = this.selectedRoomIDs.filter(id => id !== roomID)
      } else {
        this.selectedRoomIDs = [...this.selectedRoomIDs, roomID]
      }
    },
    async saveSeatMapping () {
      if (!this.selectedPositionID || !this.selectedRoomIDs.length) {
        this.showError('จัดที่นั่งสอบไม่สำเร็จ', 'กรุณาเลือกตำแหน่งและห้องสอบ')
        return
      }

      this.mappingLoading = true
      try {
        const res = await this.$axios.$post(this.$apiUrl('/api/seatMapping/map'), {
          PositionID: this.selectedPositionID,
          RoomIDs: this.selectedRoomIDs
        })
        const data = res.data || {}
        this.$swal.fire({
          icon: 'success',
          title: 'จัดที่นั่งสอบสำเร็จ',
          text: `จัดที่นั่ง ${data.mapped || 0} คน เหลือผู้สมัครไม่มีที่นั่ง ${data.unmappedApplicants || 0} คน`
        })
        await this.fetchRoomMappingCounts()
      } catch (err) {
        this.showError('จัดที่นั่งสอบไม่สำเร็จ', err?.response?.data?.message || 'กรุณาลองใหม่อีกครั้ง')
      } finally {
        this.mappingLoading = false
      }
    },
    toggleFloor (key) {
      this.$set(this.expandedFloors, key, !this.expandedFloors[key])
    },
    isFloorExpanded (key) {
      return !!this.expandedFloors[key]
    },
    async fetchOrganization () {
      if (!this.organization.ID) {
        return
      }
      const res = await this.$axios.$get(this.$apiUrl(`/api/organization/${this.organization.ID}`))
      const data = res.data
      this.organization = {
        Name: data.Name,
        ID: data.ID
      }
    },
    async fetchFacilitByID () {
      if (!this.facility.ID) {
        return
      }
      const res = await this.$axios.$get(this.$apiUrl(`/api/facility/${this.facility.ID}`))
      const data = res.data
      this.facility = {
        Name: data.Name,
        ID: data.ID,
        DisplayName: data.DisplayName
      }
    },
    async fetchBuildingByFacilityID () {
      if (!this.facility.ID) {
        return
      }
      const res = await this.$axios.$get(this.$apiUrl(`/api/${this.facility.ID}/buildings`))
      this.buildings = res.data || []
      await this.fetchFloorsAndRooms()
    },
    async fetchFloorsAndRooms () {
      const floorGroups = await Promise.all(this.buildings.map(async (building) => {
        const floorRes = await this.$axios.$get(this.$apiUrl(`/api/${building.ID}/floors`))
        const floors = floorRes.data || []
        return Promise.all(floors.map(async (floor) => {
          const roomRes = await this.$axios.$get(this.$apiUrl(`/api/${floor.ID}/rooms`))
          return {
            key: `${building.ID}-${floor.ID}`,
            building,
            floor,
            rooms: roomRes.data || []
          }
        }))
      }))
      this.floorRows = floorGroups.flat()
      if (this.floorRows[0]) {
        this.$set(this.expandedFloors, this.floorRows[0].key, true)
      }
      await this.fetchRoomMappingCounts()
    },
    async fetchRoomMappingCounts () {
      const roomIDs = this.floorRows.flatMap(floorItem => floorItem.rooms.map(room => room.ID))
      if (!roomIDs.length) {
        this.roomMappingCounts = {}
        return
      }

      const res = await this.$axios.$get(this.$apiUrl('/api/seatMapping/room-counts'), {
        params: {
          RoomIDs: roomIDs.join(',')
        }
      })
      const counts = {}
      const mappingRows = res.data || []
      mappingRows.forEach((item) => {
        counts[item.RoomID] = Number(item.ApplicantCount) || 0
      })
      this.roomMappingCounts = counts
    },
    async fetchPositionByExamID () {
      if (!this.exam.ID) {
        return
      }
      const res = await this.$axios.$get(this.$apiUrl(`/api/${this.exam.ID}/positions`))
      this.position = res.data || []
    },
    floorTitle (floorItem) {
      const buildingName = floorItem.building.Name || '-'
      const floorNumber = floorItem.floor.Number || floorItem.floor.Name || '-'
      return `${buildingName} ชั้น ${floorNumber}`
    },
    roomSeatCount (room) {
      const rows = Number(room.Rows) || 0
      const columns = Number(room.Columns) || 0
      return rows * columns
    },
    roomApplicantCount (room) {
      return this.roomMappingCounts[room.ID] || 0
    },
    roomAvailableSeatCount (room) {
      return Math.max(this.roomSeatCount(room) - this.roomApplicantCount(room), 0)
    },
    positionApplicantCount (position) {
      return Number(position.Number) || 0
    },
    formatThaiDate (date) {
      const [year, month, day] = date.split('-').map(Number)
      const thaiDate = new Date(year, month - 1, day)
      const weekdays = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์']
      const months = [
        'มกราคม',
        'กุมภาพันธ์',
        'มีนาคม',
        'เมษายน',
        'พฤษภาคม',
        'มิถุนายน',
        'กรกฎาคม',
        'สิงหาคม',
        'กันยายน',
        'ตุลาคม',
        'พฤศจิกายน',
        'ธันวาคม'
      ]

      return `วัน${weekdays[thaiDate.getDay()]}ที่ ${day} ${months[month - 1]} ${year + 543}`
    },
    showError (title, text) {
      this.$swal.fire({
        icon: 'error',
        title,
        text
      })
    }
  }
}
</script>

<style scoped>
.seat-mapping-card {
  padding: 16px;
}

.seat-mapping-header {
  text-align: center;
  justify-content: center;
}

.seat-mapping-header p {
  color: #424242;
  font-size: 20px;
  line-height: 1.5;
  margin-bottom: 10px;
}

.bordered-table {
  border: 1px solid #dcdcdc;
}

.bordered-table ::v-deep table {
  border-collapse: collapse;
}

.bordered-table ::v-deep th,
.bordered-table ::v-deep td {
  border: 1px solid #dcdcdc;
  color: #424242;
  font-size: 18px;
  height: 52px;
  padding: 10px 16px;
  vertical-align: top;
}

.bordered-table ::v-deep th {
  font-weight: 700;
  white-space: nowrap;
}

.facility-table ::v-deep td {
  height: 74px;
}

.room-table {
  margin: 8px 0 16px;
  width: calc(100% - 16px);
}

.room-table ::v-deep th,
.room-table ::v-deep td {
  font-size: 16px;
  height: 48px;
}

.select-col,
.expand-col {
  text-align: center;
  width: 48px;
}

.floor-title {
  font-size: 18px;
  line-height: 1.4;
  margin: 0 0 6px;
}

.expand-button {
  margin-top: 6px;
}

.empty-cell {
  color: #777;
  text-align: center;
}
</style>
