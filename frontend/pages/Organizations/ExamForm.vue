<template>
  <v-container>
    <v-row>
      <v-col style="text-align: center;">
        <h1>{{ pageTitle }}</h1>
      </v-col>
    </v-row>
    <v-divider class="my-5" />

    <v-form>
      <v-row dense>
        <v-col>
          <p>หน่วยงาน:</p>
        </v-col>
        <v-col>
          <p>{{ organ.Name }}</p>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <p>ชื่อรอบสอบ:</p>
        </v-col>
        <v-col>
          <v-text-field
            v-model="exam.Name"
            outlined
            dense
            required
          />
        </v-col>
      </v-row>
      <v-row dense align="center">
        <v-col cols="auto">
          <p class="mb-0">
            สอบวันที่:
          </p>
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
                label="วัน/เดือน/ปี"
                prepend-icon="mdi-calendar"
                readonly
                dense
                solo
                hide-details
                v-bind="attrs"
                v-on="on"
              />
            </template>

            <v-date-picker
              v-model="date"
              no-title
              scrollable
            >
              <v-spacer />
              <v-btn text color="primary" @click="menu = false">
                Cancel
              </v-btn>
              <v-btn text color="primary" @click="$refs.menu.save(date)">
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>

        <v-col cols="auto" class="text-end">
          <p class="mb-0">
            ตั้งแต่เวลา:
          </p>
        </v-col>

        <v-col>
          <v-select
            v-model="selectedStartTime"
            :items="timeOptions"
            dense
            solo
            hide-details
          />
        </v-col>

        <v-col cols="auto" class="text-end">
          <p class="mb-0">
            ถึงเวลา:
          </p>
        </v-col>

        <v-col>
          <v-select
            v-model="selectedEndTime"
            :items="timeOptions"
            dense
            solo
            hide-details
          />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <p>สถานะ:</p>
        </v-col>
        <v-col style="">
          <v-select
            v-model="exam.StatusID"
            :items="status"
            label=""
            dense
            solo
          />
        </v-col>
      </v-row>
      <v-btn color="primary" depressed :loading="loading" @click="saveAddData">
        {{ isEditMode ? 'บันทึกการแก้ไขรอบสอบ' : 'บันทึกรอบสอบ' }}
      </v-btn>
    </v-form>
    <v-divider class="my-5" />
    <v-form v-if="isEditMode">
      <v-row>
        <v-col>
          <p>ตำแหน่ง:</p>
        </v-col>
        <v-col>
          <v-select
            :items="selectPosition"
            dense
            solo
            hide-details
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <p>ผู้สมัคร:</p>
        </v-col>
        <v-col>
          <v-file-input
            dense
            outlined
            hide-details
            show-size
            prepend-icon=""
            placeholder="Choose File | No file chosen"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <p>Start AppId:</p>
        </v-col>
        <v-col>
          <v-text-field small dense outlined />
        </v-col>
        <v-col>
          <p>End AppId:</p>
        </v-col>
        <v-col>
          <v-text-field small dense outlined />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn color="primary" depressed>
            เพิ่มข้อมูลผู้สมัคร
          </v-btn>
        </v-col>
      </v-row>
      <v-divider class="my-5" />
    </v-form>
    <v-simple-table v-if="isEditMode">
      <template #default>
        <thead>
          <tr>
            <th class="text-left">
              ชื่อ
            </th>
            <th class="text-left">
              สถานะ
            </th>
            <th class="text-left">
              รายละเอียด
            </th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in positions"
            :key="item.ID"
          >
            <td>{{ item.ID }}</td>
            <td>{{ item.Name }}</td>
            <td>{{ item.Number }}</td>
            <td>
              <v-btn small depressed color="error">
                ลบ
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <v-btn color="primary">
      จัดที่นั่งสอบ
    </v-btn>
  </v-container>
</template>
<script>
export default {
  name: 'OrganizationForm',
  data () {
    return {
      loading: false,
      isEditMode: false,
      status: [
        { text: 'None', value: 0 },
        { text: 'Opened', value: 1 },
        { text: 'Canceled', value: 2 },
        { text: 'Completed', value: 3 }
      ],
      timeOptions: ['8:00',
        '8:30',
        '9:00',
        '9:30',
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
        '17:30'],
      selectedStartTime: '8:00',
      selectedEndTime: '17:00',
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      menu: false,
      modal: false,
      menu2: false,
      organ: { ID: '', Name: '', Description: '' },
      exam: { ID: '', StatusID: 0, StartDateTime: '', EndDateTime: '' },
      positions: [],
      selectPosition: ['นักวิชาการขนส่งปฏิบัติการ', 'อื่นๆ (ระบุ)']
    }
  },
  computed: {
    pageTitle () {
      return this.isEditMode ? 'แก้ไขรอบสอบ' : 'เพิ่มรอบสอบ'
    },
    dateText () {
      return this.formatDate(this.date)
    }
  },
  async mounted () {
    const organId = this.$route.query.OrganID
    const examId = this.$route.query.ExamID
    this.exam.ID = examId || ''
    this.organ.ID = organId || ''
    await this.fetchOrganDataByID(organId)
    if (examId) {
      this.isEditMode = true
      await this.fetchExamDataByID(examId)
      await this.fetchPositionByExamID(examId)
    }
  },
  methods: {
    testBtn () {
      console.log('testBtn : ', this.fetchExamDataByID(4))
    },
    async fetchOrganDataByID (organID) {
      const result = await this.$axios.$get(this.$apiUrl(`/api/organization/${organID}`))
      const data = result.data
      this.organ = {
        ID: data.ID,
        Name: data.Name,
        Description: data.Description || '',
        StartDateTime: data.StartDateTime || '',
        EndDateTime: data.EndDateTime || ''
      }
    },
    async fetchExamDataByID (examID) {
      try {
        const result = await this.$axios.$get(this.$apiUrl(`/api/exam/${examID}`))
        const data = result.data
        this.exam = {
          ID: data.ID,
          Name: data.Name,
          StatusID: Number(data.StatusID || 0),
          StartDateTime: data.StartDateTime,
          EndDateTime: data.EndDateTime
        }
        this.setDateAndTimeFromExam(data)
      } catch (error) {
        const message = error.response?.data?.message
        this.$swal.fire({
          icon: 'error',
          text: `ดึงข้อมูลไม่สำเร็จ ${message}`
        })
      }
    },
    async fetchPositionByExamID (examID) {
      try {
        const result = await this.$axios.$get(this.$apiUrl(`/api/${examID}/positions`))
        this.positions = result.data
        console.log('data : ', this.positions)
      } catch (err) {
        this.$swal({
          icon: 'error',
          text: `fail ${err.message}`
        })
      }
    },
    formatDate (date) {
      if (!date) {
        return ''
      }
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    normalizeTime (time) {
      const [hour, minute] = time.split(':')
      return `${hour.padStart(2, '0')}:${minute || '00'}:00`
    },
    combineDateTime (time) {
      return `${this.date} ${this.normalizeTime(time)}`
    },
    setDateAndTimeFromExam (data) {
      const start = this.parseDateTime(data.StartDateTime)
      const end = this.parseDateTime(data.EndDateTime)

      if (start.date) {
        this.date = start.date
      }
      if (start.time) {
        this.selectedStartTime = start.time
      }
      if (end.time) {
        this.selectedEndTime = end.time
      }
    },
    parseDateTime (value) {
      if (!value) {
        return { date: '', time: '' }
      }

      const text = String(value).replace('T', ' ')
      const date = text.substr(0, 10)
      const time = text.substr(11, 5).replace(/^0/, '')

      return { date, time }
    },
    buildPayload () {
      return {
        Name: this.exam.Name,
        StatusID: Number(this.exam.StatusID),
        StartDateTime: this.combineDateTime(this.selectedStartTime),
        EndDateTime: this.combineDateTime(this.selectedEndTime)
      }
    },
    async saveAddData () {
      this.loading = true
      try {
        const payload = this.buildPayload()
        if (this.isEditMode) {
          await this.$axios.$patch(this.$apiUrl(`/api/${this.organ.ID}/exam/${this.exam.ID}`), payload)
        } else {
          await this.$axios.$post(this.$apiUrl(`/api/${this.organ.ID}/exam`), payload)
        }
        this.$swal.fire({
          icon: 'success',
          text: this.isEditMode ? 'แก้ไขรอบสอบสำเร็จ' : 'เพิ่มรอบสอบสำเร็จ'
        })
      } catch (error) {
        const message = error.response?.data?.message
        this.$swal.fire({
          icon: 'error',
          text: `ไม่สามารถบันทึกรอบสอบได้ ${message}`
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
