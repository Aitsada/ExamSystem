<template>
  <v-container>
    <v-row>
      <v-col style="text-align: center;">
        <h1>{{ pageTitle }}</h1>
      </v-col>
    </v-row>
    <v-divider class="my-10" />

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
                v-model="date"
                label="Picker in menu"
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
            :items="startTime"
            dense
            solo
            hide-detailsl
          />
        </v-col>

        <v-col cols="auto" class="text-end">
          <p class="mb-0">
            ถึงเวลา:
          </p>
        </v-col>

        <v-col>
          <v-select
            :items="endTime"
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
            :items="statusId"
            label=""
            dense
            solo
          />
        </v-col>
      </v-row>
      <!-- <v-row>
        <v-col>
          <v-simple-table v-if="isEditMode">
            <template #default>
              <thead>
                <tr>
                  <th class="text-left">
                    ชื่อ
                  </th>
                  <th class="text-left">
                    รายละเอียด
                  </th>
                </tr>
              </thead>
              <tbody>
                <trx
                  v-for="item in exam"
                  :key="item.ID"
                >
                  <td>{{ item.Name }}</td>
                  <td>
                    <v-btn small color="warning">
                      แก้ไข
                    </v-btn>
                  </td>
                </trx>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row> -->
      <v-divider class="my-10" />

      <v-btn color="warning" @click="testBtn">
        testBtn
      </v-btn>
    </v-form>
  </v-container>
</template>
<script>
export default {
  name: 'OrganizationForm',
  data () {
    return {
      loading: false,
      isEditMode: false,
      statusId: ['None', 'Opened', 'Canceled', 'Completed'],
      startTime: [
        '8:00',
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
        '17:30'
      ],
      endTime: ['8:00',
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
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      menu: false,
      modal: false,
      menu2: false,
      organ: { ID: '', Name: '', Description: '' },
      exam: { ID: '', StatusID: '', StartDateTime: '', EndDateTime: '' }
    }
  },
  computed: {
    pageTitle () {
      return this.isEditMode ? 'แก้ไขรอบสอบ' : 'เพิ่มรอบสอบ'
    }
  },
  async mounted () {
    const organId = this.$route.query.OrganID
    const examId = this.$route.query.ExamID
    this.exam.ID = examId || ''
    this.organ.ID = organId || ''
    console.log(organId, examId)
    await this.fetchOrganDataByID(organId)
    if (examId) {
      this.isEditMode = true
      await this.fetchExamDataByID(examId)
    }
  },
  methods: {
    testBtn () {
      console.log(this.startTime, this.endTime)
    },
    async fetchOrganDataByID (organID) {
      const result = await this.$axios.$get(this.$apiUrl(`/api/organization/${organID}`))
      const data = result.data
      this.organ = {
        ID: data.ID,
        Name: data.Name,
        Description: data.Description || ''
      }
    },
    async fetchExamDataByID (examID) {
      try {
        const result = await this.$axios.$get(this.$apiUrl(`/api/exam/${examID}`))
        const data = result.data
        this.exam = {
          ID: data.ID,
          Name: data.Name,
          StatusID: data.StatusID,
          StartDateTime: data.StartDateTime,
          EndDateTime: data.EndDateTime
        }
        console.log('this.exam', this.exam)
      } catch (error) {
        const message = error.response?.data?.message
        this.$swal.fire({
          icon: 'error',
          text: `ดึงข้อมูลไม่สำเร็จ ${message}`
        })
      }
    },
    async saveAddData () {
      try {
        await this.$axios.$post(this.$apiUrl('/api/organization'), { Name: this.organ.Name, Description: this.organ.Description })
        this.$swal.fire({
          icon: 'success',
          text: 'เพิ่มข้อมูลหน่วยงานสำเร็จ'
        })
      } catch (error) {
        const message = error.response?.data?.message
        this.$swal.fire({
          icon: 'error',
          text: `ไม่สามารถเพิ่มข้อมูลหน่วยงานได้ ${message}`
        })
      }
    }
  }
}
</script>
