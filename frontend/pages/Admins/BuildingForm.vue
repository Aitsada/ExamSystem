<template>
  <v-container>
    <h1>Building Form</h1>

    <v-simple-table
      :loading="loading"
      no-results-text="ไม่พบข้อมูลอาคารสอบ"
      no-results-icon="mdi-office-building"
      class="building-table"
      hide-default-footer
    >
      <template #default>
        <thead>
          <tr>
            <th class="text-left">
              อาคารสอบ
            </th>
            <th class="text-left">
              รายละเอียด
            </th>
            <th class="text-left" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in buildings" :key="item.ID">
            <td>{{ item.Name }}</td>
            <td>{{ item.Description || '-' }}</td>
            <td>
              <v-btn small @click="testBtn(item.ID)">
                แก้ไข
              </v-btn>
            </td>
            <td>
              <v-btn small color="error" @click="testBtn(item.ID)">
                ลบ
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-container>
</template>
<script>
export default {
  name: 'BuildingForm',
  data () {
    return {
      loading: false,
      buildings: [],
      facility: {
        ID: null,
        Name: '',
        DisplayName: '',
        Description: '',
        CreatedBy: 'Admin'
      },
      desserts: [
        { name: 'Frozen Yogurt', calories: 159 },
        { name: 'Ice cream sandwich', calories: 237 },
        { name: 'Eclair', calories: 262 },
        { name: 'Cupcake', calories: 305 },
        { name: 'Gingerbread', calories: 356 },
        { name: 'Jelly bean', calories: 375 },
        { name: 'Lollipop', calories: 392 },
        { name: 'Honeycomb', calories: 408 },
        { name: 'Donut', calories: 452 },
        { name: 'KitKat', calories: 518 }
      ]
    }
  },
  mounted () {
    const facilityId = this.$route.query.FacilityID
    this.facility.ID = facilityId || null
    this.fetchData(facilityId)
  },
  methods: {
    async fetchData (FacilityID = this.facility.ID) {
      if (!FacilityID) {
        this.buildings = []
        return
      }
      this.loading = true
      try {
        const res = await this.$axios.$get(this.$apiUrl(`/api/${FacilityID}/buildings`))
        this.buildings = res.data || []
      } finally {
        this.loading = false
      }
    },
    testBtn (item) {
      console.log('Test button clicked', item)
    }
  }
}
</script>
