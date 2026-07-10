<template>
  <v-row style="justify-content: center" no-gutters>
    <v-col cols="8">
      <v-container class="admin-page">
        <v-row>
          <v-col style="text-align: center;">
            <p class="page-title mb-0">
              ประวัติการจัดสอบ
            </p>
          </v-col>
        </v-row>
        <v-divider class="my-3" />
        <v-simple-table class="facility-table">
          <template #default>
            <thead>
              <tr>
                <th class="text-left">
                  หน่วยงาน
                </th>
                <th class="text-left">
                  รอบสอบ
                </th>
                <th class="text-left">
                  สถานที่สอบ
                </th>
                <th class="text-left">
                  สถานะ
                </th>
                <th class="text-left" />
                <th class="text-left" />
                <th class="text-left" />
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="7" class="text-center">
                  กำลังโหลดข้อมูลประวัติการสอบ...
                </td>
              </tr>
              <tr v-else-if="!data.length">
                <td colspan="7" class="text-center">
                  ยังไม่มีข้อมูลประวัติการสอบ
                </td>
              </tr>
              <tr v-for="item in data" v-else :key="`${item.ExamID}-${item.FacilityID}`">
                <td>{{ item.OrganizationName }}</td>
                <td>{{ examText(item) }}</td>
                <td>{{ facilityText(item) }}</td>
                <td>{{ getStatusName(item.StatusID) }}</td>
                <td>
                  <v-btn
                    small
                    outlined
                    class="btn-action"
                    prepend-icon="mdi-chart-box-outline"
                    :to="summaryRoute(item)"
                  >
                    สรุปภาพรวม
                  </v-btn>
                </td>
                <td>
                  <v-btn
                    small
                    outlined
                    class="btn-action"
                    prepend-icon="mdi-pencil-outline"
                    :to="seatCloningRoute(item)"
                  >
                    จัดใหม่
                  </v-btn>
                </td>
                <td>
                  <v-btn
                    small
                    outlined
                    class="btn-action"
                    prepend-icon="mdi-delete-outline"
                    :disabled="!!deletingKey"
                    :loading="deletingKey === historyKey(item)"
                    @click="deleteHistory(item)"
                  >
                    ลบ
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
  name: 'ExamHistory',
  data () {
    return {
      loading: false,
      deletingKey: null,
      data: [],
      statusMap: {
        0: 'None',
        1: 'Opened',
        2: 'Canceled',
        3: 'Completed'
      }
    }
  },
  mounted () {
    this.fetchHistory()
  },
  methods: {
    async fetchHistory () {
      this.loading = true
      try {
        const res = await this.$axios.$get(this.$apiUrl('/api/seatMapping/history'))
        this.data = res.data || []
      } catch (err) {
        this.$swal.fire({
          icon: 'error',
          text: `ดึงข้อมูลประวัติการสอบไม่สำเร็จ ${err.message}`
        })
      } finally {
        this.loading = false
      }
    },
    async deleteHistory (item) {
      const confirm = await this.$swal.fire({
        icon: 'warning',
        title: 'ลบข้อมูลรอบสอบ',
        showCancelButton: true,
        confirmButtonColor: '#D32F2F',
        cancelButtonColor: '#757575',
        confirmButtonText: 'ลบ',
        cancelButtonText: 'ยกเลิก'
      })

      if (!confirm.isConfirmed) {
        return
      }

      this.deletingKey = this.historyKey(item)
      try {
        const res = await this.$axios.$delete(this.$apiUrl('/api/seatMapping/history'), {
          params: {
            ExamID: item.ExamID,
            FacilityID: item.FacilityID
          }
        })
        const deleted = res.data?.deleted || 0
        await this.fetchHistory()
        this.$swal.fire({
          icon: 'success',
          text: `ลบข้อมูลการจัดที่นั่งสอบ ${deleted} รายการเรียบร้อยแล้ว`
        })
      } catch (err) {
        this.$swal.fire({
          icon: 'error',
          text: `ลบข้อมูลรอบสอบไม่สำเร็จ ${err.message}`
        })
      } finally {
        this.deletingKey = null
      }
    },
    historyKey (item) {
      return `${item.ExamID}-${item.FacilityID}`
    },
    getStatusName (statusID) {
      return this.statusMap[Number(statusID)] || '-'
    },
    facilityText (item) {
      return item.FacilityName || '-'
    },
    examText (item) {
      const start = this.parseDateTime(item.StartDateTime)
      const end = this.parseDateTime(item.EndDateTime)
      if (!start.date) {
        return item.ExamName || '-'
      }

      return `สอบ${this.formatThaiDate(start.date)} เวลา ${start.time || '-'} - ${end.time || '-'} น.`
    },
    seatCloningRoute (item) {
      return {
        path: '/SeatCloning',
        query: {
          ExamID: item.ExamID
        }
      }
    },
    summaryRoute (item) {
      return {
        path: '/Summary',
        query: {
          ExamID: item.ExamID,
          FacilityID: item.FacilityID
        }
      }
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

      const sqlDateTime = text.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/)
      if (sqlDateTime) {
        const [, year, month, day, hour, minute] = sqlDateTime
        return {
          date: `${year}-${month}-${day}`,
          time: `${hour}:${minute}`
        }
      }

      const dateTime = new Date(text)
      return this.formatBangkokDateTime(dateTime)
    },
    formatBangkokDateTime (dateTime) {
      if (Number.isNaN(dateTime.getTime())) {
        return { date: '', time: '' }
      }

      const bangkokTime = new Date(dateTime.getTime() + (7 * 60 * 60 * 1000))
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
    }
  }
}
</script>
