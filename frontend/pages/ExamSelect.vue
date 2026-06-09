<template>
  <v-row style="justify-content: center;" no-gutters>
    <v-col cols="8">
      <v-container class="admin-page exam-select-page">
        <v-row align="center" class="admin-page-header mb-5" no-gutters>
          <v-col cols="auto" class="mr-3">
            <div class="admin-title-marker" />
          </v-col>
          <v-col>
            <p class="admin-eyebrow mb-0">
              ระบบจัดห้องสอบ
            </p>
            <p class="admin-page-title mb-0">
              เลือกรอบสอบสำหรับจัดที่นั่ง
            </p>
          </v-col>
        </v-row>

        <v-card elevation="0" rounded="lg" border color="gray" class="admin-card admin-form-card">
          <v-card-text>
            <v-row no-gutters>
              <v-col cols="12">
                <v-row align="center" class="compact-row" no-gutters>
                  <v-col cols="12" sm="2">
                    <span class="field-label">สถานที่สอบ :</span>
                  </v-col>
                  <v-col cols="12" sm="8" md="4" class="field-col">
                    <v-select
                      v-model="selectedFacilities"
                      label="เลือกสถานที่สอบ"
                      :items="selectFacilities"
                      outlined
                      dense
                      hide-details="auto"
                      class="form-field"
                    />
                  </v-col>
                </v-row>

                <v-row align="center" class="compact-row" no-gutters>
                  <v-col cols="12" sm="2">
                    <span class="field-label">หน่วยงาน :</span>
                  </v-col>
                  <v-col cols="12" sm="8" md="4" class="field-col">
                    <v-select
                      v-model="selectedOrganizations"
                      label="เลือกหน่วยงาน"
                      :items="selectOrganizations"
                      outlined
                      dense
                      hide-details="auto"
                      class="form-field"
                    />
                  </v-col>
                </v-row>

                <v-row align="center" class="compact-row" no-gutters>
                  <v-col cols="12" sm="2">
                    <span class="field-label">รอบสอบ :</span>
                  </v-col>
                  <v-col cols="12" sm="8" md="4" class="field-col">
                    <v-select
                      v-model="selectedExams"
                      label="เลือกรอบสอบ"
                      :items="selectExams"
                      outlined
                      dense
                      hide-details="auto"
                      class="form-field"
                    />
                  </v-col>
                </v-row>

                <v-row align="center" class="compact-row" no-gutters>
                  <v-col cols="12" sm="2">
                    <span class="field-label">วันที่สอบ :</span>
                  </v-col>
                  <v-col cols="12" sm="3" class="field-col">
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
                          label="เลือกวันที่สอบ"
                          prepend-inner-icon="mdi-calendar"
                          readonly
                          outlined
                          dense
                          hide-details="auto"
                          class="form-field"
                          v-bind="attrs"
                          v-on="on"
                        />
                      </template>

                      <v-date-picker v-model="date" no-title scrollable>
                        <v-spacer />
                        <v-btn text color="primary" @click="setToday">
                          วันนี้
                        </v-btn>
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
                    <span class="field-label">ตั้งแต่เวลา :</span>
                  </v-col>
                  <v-col cols="12" sm="2" md="1" class="time-col">
                    <v-select
                      v-model="selectTimeStart"
                      :items="timeOptions"
                      outlined
                      dense
                      hide-details="auto"
                      class="form-field"
                    />
                  </v-col>
                  <v-col cols="12" sm="auto" class="time-label">
                    <span class="field-label">ถึงเวลา :</span>
                  </v-col>
                  <v-col cols="12" sm="2" md="1" class="time-col">
                    <v-select
                      v-model="selectTimeEnd"
                      :items="timeOptions"
                      outlined
                      dense
                      hide-details="auto"
                      class="form-field"
                    />
                  </v-col>
                </v-row>

                <v-btn
                  depressed
                  color="primary"
                  class="btn-save mt-8"
                  :disabled="!canStartMapping"
                  :to="seatMappingRoute"
                >
                  จัดที่นั่งสอบ »
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-container>
    </v-col>
  </v-row>
</template>
<script>
const getCurrentDate = () => {
  return (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
}

const timeOptions = ['08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30']

export default {
  data () {
    return {
      facilities: [],
      selectFacilities: [],
      selectedFacilities: null,
      organizations: [],
      selectOrganizations: [],
      selectedOrganizations: null,
      exams: [],
      selectExams: [],
      selectedExams: null,
      timeOptions,
      selectTimeStart: timeOptions[0],
      selectTimeEnd: timeOptions[timeOptions.length - 1],
      date: getCurrentDate(),
      menu: false
    }
  },
  computed: {
    canStartMapping () {
      return !!(
        this.selectedFacilities &&
        this.selectedOrganizations &&
        this.selectedExams &&
        this.date &&
        this.selectTimeStart &&
        this.selectTimeEnd
      )
    },
    dateText () {
      return this.formatDate(this.date)
    },
    seatMappingRoute () {
      return {
        path: '/SeatMapping',
        query: {
          ExamID: this.selectedExams,
          FacilityID: this.selectedFacilities,
          OrganizationID: this.selectedOrganizations,
          ExamDate: this.date,
          StartTime: this.selectTimeStart,
          EndTime: this.selectTimeEnd
        }
      }
    }
  },
  watch: {
    selectedOrganizations (newValue) {
      if (newValue) {
        this.fetchExamData()
      }
    },
    selectedExams (newValue) {
      if (newValue) {
        this.setDateAndTimeFromExam(newValue)
      }
    }
  },
  mounted () {
    this.fetchFacilitiesData()
    this.fectOrganizationData()
  },
  methods: {
    setToday () {
      this.date = getCurrentDate()
    },
    async fetchFacilitiesData () {
      const res = await this.$axios.$get(this.$apiUrl('/api/facilities'))
      this.facilities = res.data || []
      this.selectFacilities = this.facilities.map(b => ({
        text: b.Name,
        value: b.ID
      }))
      this.selectedFacilities = this.selectFacilities[0]?.value || null
    },
    async fectOrganizationData () {
      const res = await this.$axios.$get(this.$apiUrl('/api/organizations'))
      this.organizations = res.data || []
      this.selectOrganizations = this.organizations.map(o => ({
        text: o.Name,
        value: o.ID
      }))
      this.selectedOrganizations = this.selectOrganizations[0]?.value || null
    },
    async fetchExamData () {
      const res = await this.$axios.$get(this.$apiUrl(`/api/${this.selectedOrganizations}/exams`))
      this.exams = res.data || []
      this.selectExams = this.exams.map(e => ({
        text: e.Name,
        value: e.ID
      }))
      this.selectedExams = this.selectExams[0]?.value || null
      if (this.selectedExams) {
        this.setDateAndTimeFromExam(this.selectedExams)
      }
    },
    setDateAndTimeFromExam (examID) {
      const exam = this.exams.find(e => String(e.ID) === String(examID))
      if (!exam) {
        return
      }

      const start = this.parseDateTime(exam.StartDateTime)
      const end = this.parseDateTime(exam.EndDateTime)

      if (start.date) {
        this.date = start.date
      }
      if (start.time) {
        this.selectTimeStart = start.time
      }
      if (end.time) {
        this.selectTimeEnd = end.time
      }
    },
    formatBangkokDateTime (dateTime) {
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
    normalizeDateTimeForSelect (dateTime) {
      const bangkokDateTime = this.formatBangkokDateTime(dateTime)
      if (this.timeOptions.includes(bangkokDateTime.time)) {
        return bangkokDateTime
      }

      return this.formatBangkokDateTime(new Date(dateTime.getTime() + (7 * 60 * 60 * 1000)))
    },
    parseSqlDateTime (text) {
      const sqlDateTime = text.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?$/)
      if (!sqlDateTime) {
        return null
      }

      const [, year, month, day, hour, minute, second = '00'] = sqlDateTime
      const date = `${year}-${month}-${day}`
      const time = `${hour}:${minute}`

      if (this.timeOptions.includes(time)) {
        return { date, time }
      }

      const utcDateTime = new Date(Date.UTC(year, Number(month) - 1, day, hour, minute, second))
      return this.normalizeDateTimeForSelect(utcDateTime)
    },
    parseDateTime (value) {
      if (!value) {
        return { date: '', time: '' }
      }

      const text = String(value)
      const hasTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/.test(text)
      if (hasTimezone) {
        const dateTime = new Date(text)
        if (!Number.isNaN(dateTime.getTime())) {
          return this.normalizeDateTimeForSelect(dateTime)
        }
      }

      const sqlDateTime = this.parseSqlDateTime(text)
      if (sqlDateTime) {
        return sqlDateTime
      }

      const normalizedText = text.replace('T', ' ')
      const date = normalizedText.substr(0, 10)
      const time = normalizedText.substr(11, 5)

      return { date, time }
    },
    formatDate (date) {
      if (!date) {
        return ''
      }
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    }
  }
}
</script>

<style scoped>
.exam-select-page {
  max-width: 1140px;
}

.time-label {
  padding: 0 8px;
}

.time-col {
  max-width: 96px;
}

@media (max-width: 600px) {
  .time-label {
    padding: 6px 0 2px;
  }

  .time-col {
    max-width: none;
  }
}
</style>
