<template>
  <v-row style="justify-content: center;" no-gutters>
    <v-col cols="10">
      <v-container class="admin-page seat-cloning-page">
        <v-row align="center" class="seat-cloning-row" no-gutters>
          <v-col cols="12" sm="2">
            <span class="field-label">รอบสอบเก่า:</span>
          </v-col>
          <v-col cols="12" sm="10">
            <span class="readonly-text">{{ oldExamText }}</span>
          </v-col>
        </v-row>

        <v-row align="center" class="seat-cloning-row" no-gutters>
          <v-col cols="12" sm="2">
            <span class="field-label">รอบสอบ ใหม่:</span>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="newExamName"
              outlined
              dense
              hide-details="auto"
              class="form-field seat-cloning-input"
            />
          </v-col>
        </v-row>

        <v-row align="center" class="seat-cloning-row" no-gutters>
          <v-col cols="12" sm="2">
            <span class="field-label">สอบวันที่:</span>
          </v-col>
          <v-col cols="12" sm="3">
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              :return-value.sync="date"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  :value="dateText"
                  outlined
                  dense
                  readonly
                  hide-details="auto"
                  class="form-field seat-cloning-input"
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-date-picker v-model="date" no-title scrollable>
                <v-spacer />
                <v-btn text color="primary" @click="menu = false">
                  ยกเลิก
                </v-btn>
                <v-btn text color="primary" @click="$refs.menu.save(date)">
                  ตกลง
                </v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" sm="auto" class="time-label">
            <span class="field-label">ตั้งแต่เวลา:</span>
          </v-col>
          <v-col cols="12" sm="1" class="time-col">
            <v-select
              v-model="startTime"
              :items="timeOptions"
              outlined
              dense
              hide-details="auto"
              class="form-field seat-cloning-time"
            />
          </v-col>
          <v-col cols="12" sm="auto" class="time-label">
            <span class="field-label">ถึงเวลา:</span>
          </v-col>
          <v-col cols="12" sm="1" class="time-col">
            <v-select
              v-model="endTime"
              :items="timeOptions"
              outlined
              dense
              hide-details="auto"
              class="form-field seat-cloning-time"
            />
          </v-col>
        </v-row>

        <v-btn
          depressed
          color="primary"
          class="seat-cloning-button"
          :disabled="!exam.ID"
          :to="examSelectRoute"
        >
          จัดที่นั่งสอบ »
        </v-btn>
      </v-container>
    </v-col>
  </v-row>
</template>

<script>
const getCurrentDate = () => {
  return (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
}

const timeOptions = [
  '08:00',
  '08:15',
  '08:30',
  '08:45',
  '09:00',
  '09:15',
  '09:30',
  '09:45',
  '10:00',
  '10:15',
  '10:30',
  '10:45',
  '11:00',
  '11:15',
  '11:30',
  '11:45',
  '12:00',
  '12:15',
  '12:30',
  '12:45',
  '13:00',
  '13:15',
  '13:30',
  '13:45',
  '14:00',
  '14:15',
  '14:30',
  '14:45',
  '15:00',
  '15:15',
  '15:30',
  '15:45',
  '16:00',
  '16:15',
  '16:30',
  '16:45',
  '17:00',
  '17:15',
  '17:30'
]

export default {
  name: 'SeatCloning',
  data () {
    return {
      exam: {},
      newExamName: '',
      date: getCurrentDate(),
      startTime: '09:00',
      endTime: '12:00',
      timeOptions,
      menu: false
    }
  },
  computed: {
    oldExamText () {
      if (!this.exam.ID) {
        return 'กำลังโหลดข้อมูลรอบสอบ...'
      }
      return `${this.exam.Name || '-'} - ${this.examDateText}`
    },
    examDateText () {
      const start = this.parseDateTime(this.exam.StartDateTime)
      const end = this.parseDateTime(this.exam.EndDateTime)
      if (!start.date) {
        return 'สอบ'
      }
      return `สอบ${this.formatThaiDate(start.date)} เวลา ${start.time || '-'} - ${end.time || '-'} น.`
    },
    dateText () {
      return this.formatDate(this.date)
    },
    examSelectRoute () {
      return {
        path: '/ExamSelect',
        query: {
          OrganID: this.exam.OrganizationID,
          ExamID: this.exam.ID
        }
      }
    }
  },
  mounted () {
    this.fetchExamData()
  },
  methods: {
    async fetchExamData () {
      const examID = this.$route.query.ExamID
      if (!examID) {
        return
      }

      try {
        const res = await this.$axios.$get(this.$apiUrl(`/api/exam/${examID}`))
        const data = res.data || {}
        this.exam = data
        this.newExamName = data.Name || ''
        this.setDateAndTimeFromExam(data)
      } catch (err) {
        this.$swal.fire({
          icon: 'error',
          text: `ดึงข้อมูลรอบสอบไม่สำเร็จ ${err.message}`
        })
      }
    },
    setDateAndTimeFromExam (exam) {
      const start = this.parseDateTime(exam.StartDateTime)
      const end = this.parseDateTime(exam.EndDateTime)
      if (start.date) {
        this.date = start.date
      }
      if (start.time) {
        this.startTime = start.time
      }
      if (end.time) {
        this.endTime = end.time
      }
    },
    formatDate (date) {
      if (!date) {
        return ''
      }
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
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

      return this.formatBangkokDateTime(new Date(text))
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

<style scoped>
.seat-cloning-page {
  max-width: 1240px;
  padding-top: 44px !important;
}

.seat-cloning-row {
  min-height: 48px;
  border-top: 1px solid #DDDDDD;
}

.seat-cloning-row:last-of-type {
  border-bottom: 1px solid #DDDDDD;
}

.seat-cloning-input {
  max-width: 280px;
}

.seat-cloning-time {
  min-width: 96px;
}

.time-label {
  margin-left: 8px;
  margin-right: 8px;
}

.time-col {
  min-width: 96px;
}

.seat-cloning-button {
  margin-top: 44px;
  min-height: 56px;
  padding: 0 28px !important;
  font-size: 22px !important;
  font-weight: 600;
}
</style>
