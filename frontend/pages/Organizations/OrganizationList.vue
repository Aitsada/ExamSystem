<template>
  <v-container>
    <v-row>
      <v-col style="text-align: center;">
        <h1>รายชื่อหน่วยงาน</h1>
      </v-col>
    </v-row>
    <v-divider class="my-5" />

    <v-simple-table :loading="loading">
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
          <tr
            v-for="item in organ"
            :key="item.ID"
          >
            <td>{{ item.Name }}</td>
            <td>
              <v-btn small color="warning" :to="{path: 'OrganizationForm', query: {OrganID: item.ID}}">
                แก้ไข
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <v-divider class="my-5" />
    <v-row>
      <v-col>
        <v-btn color="primary" :to="{path: 'OrganizationForm'}">
          เพิ่มหน่วยงาน
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: 'OrganizationList',
  data () {
    return {
      loading: false,
      organ: []
    }
  },
  async mounted () {
    await this.fetchData()
  },
  methods: {
    async fetchData () {
      const result = await this.$axios.$get(this.$apiUrl('/api/organization'))
      this.organ = result.data
      console.log('this.organ', this.organ)
    },
    testBtn (id) {
      console.log('testBtn : ', id)
      this.$router.push('/A')
    }
  }
}
</script>
