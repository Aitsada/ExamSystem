<template>
  <v-row style="justify-content: center" no-gutters>
    <v-col cols="10">
      <v-container class="admin-page admin-page-wide summary-page">
        <v-row class="summary-header">
          <v-col>
            <p>ประกาศ ตารางสอบ {{ organizationName }}</p>
            <p>สถานที่สอบ {{ facilityName }}</p>
            <p>{{ examDateText }}</p>
          </v-col>
        </v-row>
        <v-divider class="my-3" />
        <v-simple-table class="bordered-table summary-table">
          <template #default>
            <thead>
              <tr>
                <th class="text-left order-col">
                  ลำดับ
                </th>
                <th class="text-left position-col">
                  ชื่อตำแหน่ง
                </th>
                <th class="text-left applicant-col">
                  เลขประจำตัวสอบ
                </th>
                <th class="text-left building-col">
                  สถานที่สอบ/อาคาร
                </th>
                <th class="text-left room-col">
                  ห้อง
                </th>
                <th class="text-left count-col">
                  จำนวน
                </th>
                <th class="text-left file-col">
                  ไฟล์ประกาศ
                </th>
                <th class="text-left file-col">
                  ใบเซ็นชื่อ
                </th>
                <th class="text-left file-col">
                  ป้ายติดโต๊ะ
                </th>
                <th class="text-left file-col">
                  ผังห้อง
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="10" class="empty-cell">
                  กำลังโหลดข้อมูลสรุปภาพรวม...
                </td>
              </tr>
              <tr v-else-if="!summaryRows.length">
                <td colspan="10" class="empty-cell">
                  ไม่พบข้อมูลจัดที่นั่งสอบ
                </td>
              </tr>
              <tr
                v-for="item in summaryRows"
                v-else
                :key="`${item.PositionID}-${item.RoomID}`"
              >
                <td>{{ item.PositionID }}</td>
                <td>{{ item.PositionName || "-" }}</td>
                <td>{{ applicantNumberText(item) }}</td>
                <td>{{ buildingText(item) }}</td>
                <td>{{ roomText(item) }}</td>
                <td>{{ item.ApplicantCount || 0 }}</td>
                <td style="text-align: center;">
                  <v-btn
                    icon
                    small
                    @click="listOfName(item)"
                  >
                    <img
                      src="@/assets/icons/pdf1.png"
                      width="20"
                      height="20"
                    >
                  </v-btn>
                </td>
                <td style="text-align: center;">
                  <v-btn
                    icon
                    small
                    @click="signedDocument(item)"
                  >
                    <img
                      src="@/assets/icons/pdf1.png"
                      width="20"
                      height="20"
                    >
                  </v-btn>
                </td>
                <td style="text-align: center;">
                  <v-btn
                    icon
                    small
                    @click="stickerID(item)"
                  >
                    <img
                      src="@/assets/icons/pdf1.png"
                      width="20"
                      height="20"
                    >
                  </v-btn>
                </td>
                <td style="text-align: center;">
                  <v-btn
                    icon
                    small
                    @click="roomLayout(item)"
                  >
                    <img
                      src="@/assets/icons/pdf1.png"
                      width="20"
                      height="20"
                    >
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-container>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'Summary',
  data () {
    return {
      loading: false,
      meta: {},
      summaryRows: []
    }
  },
  computed: {
    organizationName () {
      return this.meta.OrganizationName || '-'
    },
    facilityName () {
      return this.meta.FacilityDisplayName || this.meta.FacilityName || '-'
    },
    examDateText () {
      const start = this.parseDateTime(this.meta.StartDateTime)
      const end = this.parseDateTime(this.meta.EndDateTime)
      if (!start.date) {
        return this.meta.ExamName || 'สอบ'
      }
      return `สอบ${this.formatThaiDate(start.date)} เวลา ${
        start.time || '-'
      } - ${end.time || '-'} น.`
    }
  },
  mounted () {
    this.fetchSummary()
  },
  methods: {
    textExamDateTime () {
      const start = this.parseDateTime(this.meta.StartDateTime)
      const end = this.parseDateTime(this.meta.EndDateTime)

      if (!start.date) {
        return this.meta.ExamName || 'สอบ'
      }
      return `สอบ${this.formatThaiDate(start.date)} เวลา ${
        start.time || '-'
      } - ${end.time || '-'} น.`
    },
    // >>>>> List Of Name <<<<<
    async listOfName (item) {
      await this.downloadPdf('/api/seatMapping/listOfName', {
        roomNo: item.RoomNo,
        positionName: item.PositionName,
        appStart: item.ApplicantNumberStart,
        appEnd: item.ApplicantNumberEnd,
        dateTime: this.textExamDateTime(),
        facilityName: this.facilityName,
        buildingName: item.BuildingName,
        floorNumber: item.FloorNumber,
        roomName: item.RoomName,
        applicantNumbers: item.ApplicantNumbers,
        applicants: item.Applicants
      }, `listOfName-${item.RoomNo || item.RoomName || 'room'}.pdf`)
    },
    // >>>>> Signed Document <<<<<
    async signedDocument (item) {
      await this.downloadPdf('/api/seatMapping/signedDocument', {
        positionName: item.PositionName,
        dateTime: this.textExamDateTime(),
        facilityName: this.facilityName,
        buildingName: item.BuildingName,
        floorNumber: item.FloorNumber,
        roomNo: item.RoomNo,
        roomName: item.RoomName,
        applicants: item.Applicants
      }, `signedDocument-${item.RoomNo || item.RoomName || 'room'}.pdf`)
    },
    // >>>>> Sticker ID <<<<<
    async stickerID (item) {
      try {
        await this.downloadPdf('/api/seatMapping/stickerID', {
          roomNo: item.RoomNo,
          roomName: item.RoomName,
          buildingName: item.BuildingName,
          positionName: item.PositionName,
          applicantNumbers: item.ApplicantNumbers,
          applicants: item.Applicants
        }, `stickerID-${item.RoomNo || item.RoomName || 'room'}.pdf`)
        this.$swal.fire({
          icon: 'success',
          text: 'StickerID success'
        })
      } catch (err) {
        this.$swal.fire({
          icon: 'error',
          text: `StickerID failed ${err.message}`
        })
      }
    },
    // >>>>> Room Layout <<<<<
    async roomLayout (item) {
      try {
        await this.downloadPdf('/api/seatMapping/roomLayout', {
          roomID: item.RoomID,
          roomNo: item.RoomNo,
          roomName: item.RoomName,
          floorNumber: item.FloorNumber,
          buildingName: item.BuildingName,
          applicantNumbers: item.ApplicantNumbers,
          facilityName: this.facilityName,
          dateTime: this.textExamDateTime()
        }, `roomLayout-${item.RoomNo || item.RoomName || 'room'}.pdf`)
        this.$swal.fire({
          icon: 'success',
          text: 'Room Layout Success'
        })
      } catch (err) {
        this.$swal.fire({
          icon: 'error',
          text: `Room Layout failed ${err.message}`
        })
      }
    },
    async downloadPdf (url, payload, filename) {
      const blob = await this.$axios.$post(this.$apiUrl(url), payload, {
        responseType: 'blob'
      })
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    },
    async fetchSummary () {
      const ExamID = this.$route.query.ExamID
      const FacilityID = this.$route.query.FacilityID
      if (!ExamID || !FacilityID) {
        return
      }

      this.loading = true
      try {
        const res = await this.$axios.$get(
          this.$apiUrl('/api/seatMapping/summary'),
          {
            params: {
              ExamID,
              FacilityID
            }
          }
        )
        const data = res.data || {}
        this.meta = data.meta || {}
        this.summaryRows = data.rows || []
      } catch (err) {
        this.$swal.fire({
          icon: 'error',
          text: `ดึงข้อมูลสรุปภาพรวมไม่สำเร็จ ${err.message}`
        })
      } finally {
        this.loading = false
      }
    },
    applicantNumberText (item) {
      if (!item.ApplicantNumberStart) {
        return '-'
      }
      if (item.ApplicantNumberStart === item.ApplicantNumberEnd) {
        return item.ApplicantNumberStart
      }
      return `${item.ApplicantNumberStart} - ${item.ApplicantNumberEnd}`
    },
    buildingText (item) {
      const floor = item.FloorNumber || item.FloorName
      if (!floor) {
        return item.BuildingName || '-'
      }
      return `${item.BuildingName || '-'} ชั้น ${floor}`
    },
    roomText (item) {
      return item.RoomName || item.RoomNo || '-'
    },
    parseDateTime (value) {
      if (!value) {
        return { date: '', time: '' }
      }

      const text = String(value)
      const hasTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/.test(text)
      if (hasTimezone) {
        return this.formatBangkokDateTime(new Date(text))
      }

      const sqlDateTime = text.match(
        /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/
      )
      if (sqlDateTime) {
        const [, year, month, day, hour, minute] = sqlDateTime
        return {
          date: `${year}-${month}-${day}`,
          time: `${hour}:${minute}`
        }
      }

      return this.formatBangkokDateTime(new Date(text))
    },
    formatBangkokDateTime (dateTime) {
      if (Number.isNaN(dateTime.getTime())) {
        return { date: '', time: '' }
      }

      const bangkokTime = new Date(dateTime.getTime() + 7 * 60 * 60 * 1000)
      const year = bangkokTime.getUTCFullYear()
      const month = String(bangkokTime.getUTCMonth() + 1).padStart(2, '0')
      const day = String(bangkokTime.getUTCDate()).padStart(2, '0')
      const hour = String(bangkokTime.getUTCHours()).padStart(2, '0')
      const minute = String(bangkokTime.getUTCMinutes()).padStart(2, '0')

      return {
        date: `${year}-${month}-${day}`,
        time: `${hour}:${minute}`
      }
    },
    formatThaiDate (date) {
      const [year, month, day] = date.split('-').map(Number)
      const thaiDate = new Date(year, month - 1, day)
      const weekdays = [
        'อาทิตย์',
        'จันทร์',
        'อังคาร',
        'พุธ',
        'พฤหัสบดี',
        'ศุกร์',
        'เสาร์'
      ]
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

      return `วัน${weekdays[thaiDate.getDay()]}ที่ ${day} ${
        months[month - 1]
      } ${year + 543}`
    }
  }
}
</script>

<style scoped>
.summary-page {
  max-width: 1240px;
}

.summary-header {
  text-align: center;
  justify-content: center;
}

.summary-header p {
  color: #333333;
  font-size: 14px;
  line-height: 1.45;
  margin-bottom: 4px;
}

.summary-table ::v-deep thead tr th,
.summary-table ::v-deep tbody tr td {
  font-size: 13px !important;
  height: 34px !important;
  line-height: 1.2;
  padding: 2px 6px !important;
  vertical-align: middle;
}

.summary-table ::v-deep tbody tr td .v-btn--icon.v-size--small {
  height: 22px;
  width: 22px;
}

.summary-table ::v-deep tbody tr td img {
  display: block;
}

.summary-table ::v-deep th {
  font-weight: 700;
  white-space: normal;
}

.order-col {
  width: 54px;
}

.position-col {
  min-width: 250px;
}

.applicant-col {
  min-width: 150px;
}

.building-col {
  min-width: 160px;
}

.room-col {
  min-width: 80px;
}

.count-col {
  width: 70px;
}

.file-col {
  width: 90px;
}

.empty-cell {
  color: #777777;
  text-align: center;
}
</style>
