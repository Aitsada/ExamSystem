<template>
  <main>
    <v-container class="px-10 py-5 rounded-xl" style="max-width: 1000px; padding-top: 20px;">
      <v-row style="text-align: center;">
        <v-col>
          <h1 style="font-size: 16px;">
            สถานที่สอบ
          </h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-data-table
            :headers="headers"
            :items="facility"
            :items-per-page="5"
            class="elevation-1 rounded-xl"
          >
            // eslint-disable-next-line vue/valid-v-slot
            <template #[`item.edit`]="{ item }">
              <v-btn color="warning">
                <NuxtLink :to="`/Admins/FacilityForm2/${item.id}`" style="text-decoration: none; color: white;">
                  แก้ไข
                </NuxtLink>
              </v-btn>
            </template>
            <template #[`item.delete`]="{ item }">
              <v-btn color="error" @click="deleteBtn(item.id)">
                ลบ
              </v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn color="primary" depress>
            <NuxtLink to="/Admins/FacilityForm2" style="color: white; text-decoration: none;">
              เพิ่มสถานที่สอบ
            </NuxtLink>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </main>
</template>
<script>
export default {
  name: 'FacilityList',
  data () {
    return {
      loading: false,
      headers: [
        { text: 'ชื่อสถานที่สอบ', value: 'Name', align: 'start', width: '60%' },
        { text: 'รายละเอียด', value: 'edit', sortable: false, width: '20%' },
        { text: 'ลบ', value: 'delete', sortable: false, width: '20%' }
      ],
      desserts: [{ Name: 'มหาวิทยาลัยรังสิต' }],
      facility: []
    }
  },
  mounted () {
    this.loadFacilities()
  },
  methods: {
    async loadFacilities () {
      // Implementation for loading facilities
      await this.$axios
        .$get('http://localhost:8005/api')
        .then((response) => {
          this.facility = response
        })
        .catch((error) => {
          console.error('Error loading facilities:', error)
        })
    },
    deleteBtn (id) {
      console.log('Delete facility with ID:', id)
    },
    editBtn (id) {
      console.log('Edit facility with ID:', id)
    }
  }
}
</script>
