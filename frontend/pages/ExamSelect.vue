<template>
  <v-card>
    <v-row>
      <v-col>
        <p>สถานที่สอบ:</p>
      </v-col>
      <v-col>
        <v-select
          v-model="selectedBuildings"
          label="เลือกสถานที่สอบ"
          :items="selectBuildings"
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
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <p>รอบสอบ:</p>
      </v-col>
      <v-col>
        <v-select
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
        <v-select
          label="เลือกสถานที่สอบ"
          outlined
          dense
        />
      </v-col>
      <v-col>
        <p>ตั้งแต่เวลา</p>
      </v-col>
      <v-col>
        <v-select
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
          :items="timeOptions"
          outlined
          dense
        />
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
export default {
  data () {
    return {
      buildings: [],
      selectBuildings: [],
      selectedBuildings: [],
      organizations: [],
      selectOrganizations: [],
      selectedOrganizations: [],
      exams: [],
      selectExams: [],
      timeOptions: ['08:00',
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
        '17:30'],
      selectTimeStart: '08:00',
      selectTimeEnd: '017:00'
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
    this.fetchBuildingsData()
    this.fectOrganizationData()
  },
  methods: {
    testBtn () {
      this.$swal.fire({
        text: `testBtn : ${this.selectedOrganizations}`
      })
    },
    async fetchBuildingsData () {
      const res = await this.$axios.$get(this.$apiUrl('/api/buildings'))
      this.buildings = res.data || []
      this.selectBuildings = this.buildings.map(b => ({
        text: b.Name,
        value: b.ID
      }))
    },
    async fectOrganizationData () {
      const res = await this.$axios.$get(this.$apiUrl('/api/organizations'))
      this.organizations = res.data || []
      this.selectOrganizations = this.organizations.map(o => ({
        text: o.Name,
        value: o.ID
      }))
    },
    async fetchExamData () {
      const res = await this.$axios.$get(this.$apiUrl(`/api/${this.selectedOrganizations}/exams`))
      this.exams = res.data || []
      this.selectExams = this.exams.map(e => ({
        text: e.Name,
        value: e.ID
      }))
    }
  }
}
</script>
