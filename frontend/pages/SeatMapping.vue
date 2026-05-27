<template>
  <v-card>
    <v-row style="text-align: center; justify-content: center;">
      <v-column>
        <p>หน่วยงาน: {{ organization.Name }}</p>
        <p>สถานที่สอบ: {{ facility.Name }}</p>
        <p>สอบ</p>
      </v-column>
    </v-row>
    <v-divider class="my-5" />
    <v-row>
      <v-col>
        <v-simple-table>
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
      drink: ['cola', 'sprite', 'soda']
    }
  },
  mounted () {
    const facilityID = this.$route.query.FacilityID
    this.facility.ID = facilityID
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
      const res = await this.$axios.$get(this.$apiUrl(`/api/organization/${1}`))
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
    }
  }
}
</script>
<style>
::v-deep .bordered-table table {
  border-collapse: collapse;
  width: 100%;
  border: 1px solid #ccc;
}

::v-deep .bordered-table th,
::v-deep .bordered-table td {
  border: 1px solid #ccc;
  padding: 8px;
}
</style>
