<template>
  <v-card>
    <v-row style="text-align: center; justify-content: center;">
      <v-column>
        <p>หน่วยงาน: {{ organization.Name }}</p>
        <p>สถานที่สอบ: {{ facility.Name }}</p>
        <p>{{ examDateText }}</p>
      </v-column>
    </v-row>
    <v-divider class="my-5" />
    <v-row>
      <v-col>
        <v-simple-table class="bordered-table">
          <template #default>
            <thead>
              <tr>
                <th class="text-left" />
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
                v-for="item in drink"
                :key="item.name"
              >
                <td>{{ item }}</td>
                <td>{{ item }}</td>
                <td>{{ item }}</td>
                <td>{{ item }}</td>
                <td>{{ item }}</td>
                <td>{{ item }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      <v-col cols="4">
        <v-simple-table class="bordered-table">
          <template #default>
            <thead>
              <tr>
                <th class="text-left" />
                <th class="text-left">
                  ลำดับ
                </th>
                <th class="text-left">
                  ชื่อตำแหน่ง
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in drink"
                :key="item.name"
              >
                <td>{{ item }}</td>
                <td>{{ item }}</td>
                <td>{{ item }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
    <v-divider class="my-5" />
    <v-btn @click="testBtn">
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
      drink: ['cola', 'sprite', 'soda']
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
  },
  methods: {
    testBtn () {
      this.$swal.fire({
        icon: 'success',
        text: `text : ${this.facility.DisplayName}`
      })
    },
    async fetchOrganization () {
      const res = await this.$axios.$get(this.$apiUrl(`/api/organization/${this.organization.ID}`))
      const data = res.data
      this.organization = {
        Name: data.Name,
        ID: data.ID
      }
    },
    async fetchFacilitByID () {
      const res = await this.$axios.$get(this.$apiUrl(`/api/facility/${this.facility.ID}`))
      const data = res.data
      this.facility = {
        Name: data.Name,
        ID: data.ID,
        DisplayName: data.DisplayName
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
