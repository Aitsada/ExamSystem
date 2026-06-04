<template>
  <v-card>
    <v-row>
      <v-col>
        <p>สถานที่สอบ:</p>
      </v-col>
      <v-col>
        <v-select
          v-model="selectedFacilities"
          label="เลือกสถานที่สอบ"
          :items="selectFacilities"
          outlined
          dense
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <p>หน่วยงาน:</p>
      </v-col>
      <v-col>
        <v-select
          v-model="selectedOrganizations"
          label="เลือกหน่วยงาน"
          :items="selectOrganizations"
          outlined
          dense
        />
      </v-col>2
    </v-row>
    <v-row>
      <v-col>
        <p>รอบสอบ:</p>
      </v-col>
      <v-col>
        <v-select
          v-model="selectedExams"
          label="เลือกสถานที่สอบ"
          :items="selectExams"
          outlined
          dense
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <p>สอบวันที่:</p>
      </v-col>
      <v-col>
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
      <v-col>
        <p>ตั้งแต่เวลา</p>
      </v-col>
      <v-col>
        <v-select
          v-model="selectTimeStart"
          :items="timeOptions"
          outlined
          dense
        />
      </v-col>
      <v-col>
        <p>ถึงเวลา</p>
      </v-col>
      <v-col>
        <v-select
          v-model="selectTimeEnd"
          :items="timeOptions"
          outlined
          dense
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
          dense
          depressed
          color="primary"
          :to="seatMappingRoute"
        >
          จัดที่นั่งสอบ
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn dense depressed color="warning" @click="testBtn">
          testBtn
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
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
      menu: false,
      drinks: [{ text: 'cola', value: 1 }, { text: 'soda', value: 2 }]
    }
  },
  computed: {
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
    }
  },
  mounted () {
    this.fetchFacilitiesData()
    this.fectOrganizationData()
  },
  methods: {
    testBtn () {
      this.$swal.fire({
        text: `testBtn : ${this.selectedOrganizations}`
      })
    },
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
