<template>
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

    <v-card elevation="0" rounded="lg" border color="white" class="admin-card admin-form-card">
      <v-card-text>
        <v-row class="exam-form-grid" no-gutters>
          <v-col cols="12" md="7" class="exam-form-fields pr-md-5">
            <v-row align="center" class="compact-row" no-gutters>
              <v-col cols="12" sm="4">
                <span class="field-label">สถานที่สอบ :</span>
              </v-col>
              <v-col cols="12" sm="8" class="field-col">
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
              <v-col cols="12" sm="4">
                <span class="field-label">หน่วยงาน :</span>
              </v-col>
              <v-col cols="12" sm="8" class="field-col">
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
              <v-col cols="12" sm="4">
                <span class="field-label">รอบสอบ :</span>
              </v-col>
              <v-col cols="12" sm="8" class="field-col">
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
              <v-col cols="12" sm="4">
                <span class="field-label">วันที่สอบ :</span>
              </v-col>
              <v-col cols="12" sm="8" class="field-col">
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
            </v-row>

            <v-row align="center" class="compact-row" no-gutters>
              <v-col cols="12" sm="4">
                <span class="field-label">เวลา :</span>
              </v-col>
              <v-col cols="12" sm="8" class="field-col">
                <div class="time-range">
                  <v-select
                    v-model="selectTimeStart"
                    label="เริ่ม"
                    :items="timeOptions"
                    outlined
                    dense
                    hide-details="auto"
                    class="form-field"
                  />
                  <span class="time-range-separator">ถึง</span>
                  <v-select
                    v-model="selectTimeEnd"
                    label="สิ้นสุด"
                    :items="timeOptions"
                    outlined
                    dense
                    hide-details="auto"
                    class="form-field"
                  />
                </div>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12" md="5" class="exam-summary-col mt-4 mt-md-0">
            <div class="exam-summary">
              <v-avatar color="#EAF4FF" size="48" class="mb-3">
                <v-icon color="#1976D2">
                  mdi-seat-outline
                </v-icon>
              </v-avatar>
              <p class="exam-summary-title mb-2">
                พร้อมจัดที่นั่งสอบ
              </p>
              <p class="exam-summary-text mb-4">
                ตรวจสอบสถานที่ หน่วยงาน รอบสอบ และช่วงเวลาก่อนเข้าสู่หน้าจัดที่นั่ง
              </p>
              <v-divider class="mb-4" />
              <div class="summary-list">
                <div class="summary-item">
                  <span>วันที่</span>
                  <strong>{{ dateText || '-' }}</strong>
                </div>
                <div class="summary-item">
                  <span>เวลา</span>
                  <strong>{{ selectTimeStart }} - {{ selectTimeEnd }}</strong>
                </div>
              </div>
              <v-btn
                block
                depressed
                color="primary"
                class="btn-save mt-5"
                :disabled="!canStartMapping"
                :to="seatMappingRoute"
              >
                <v-icon left small>
                  mdi-arrow-right
                </v-icon>
                จัดที่นั่งสอบ
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
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
  max-width: 1040px;
}

.exam-form-fields {
  flex: 1 1 auto;
}

.exam-summary-col {
  max-width: 340px;
}

.exam-summary {
  height: 100%;
  padding: 20px;
  border: 1px solid #D7E3F2;
  border-radius: 8px;
  background: #F8FBFF;
}

.exam-summary-title {
  color: #0F3D78;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.35;
}

.exam-summary-text {
  color: #64748B;
  font-size: 13px;
  line-height: 1.5;
}

.summary-list {
  display: grid;
  gap: 10px;
}

.summary-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: #64748B;
  font-size: 13px;
}

.summary-item strong {
  color: #0F172A;
  font-weight: 700;
  text-align: right;
}

.time-range {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 10px;
}

.time-range-separator {
  color: #64748B;
  font-size: 13px;
  font-weight: 600;
}

@media (max-width: 960px) {
  .exam-summary-col {
    max-width: none;
  }
}

@media (max-width: 600px) {
  .time-range {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .time-range-separator {
    text-align: center;
  }
}
</style>
