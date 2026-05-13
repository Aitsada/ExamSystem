<template>
  <v-simple-table>
    <template #default>
      <thead>
        <tr>
          <th class="text-left">
            Name
          </th>
          <th class="text-left">
            Description
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in organ"
          :key="item.ID"
        >
          <td>{{ item.Name }}</td>
          <td>{{ item.Description }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>
<script>
export default {
  name: 'OrganizationList',
  data () {
    return {
      ait: [{ name: 'ait', cal: 500 }],
      organ: []
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      const result = await this.$axios.$get(this.$apiUrl('/api/organization'))
      this.organ = result.data
      console.log('this.organ', this.organ)
    }
  }
}
</script>
