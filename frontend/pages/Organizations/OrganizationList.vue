<template>
  <v-row style="justify-content: center;" no-gutters>
    <v-col cols="8">
      <v-container class="admin-page">
        <v-row>
          <v-col style="text-align: center;">
            <p>หน่วยงาน</p>
          </v-col>
        </v-row>
        <v-divider class="mb-2" />
        <v-card elevation="0" rounded="lg" border color="white" class="admin-card">
          <v-data-table
            :headers="headers"
            :items="organ"
            :items-per-page="-1"
            :loading="loading"
            no-data-text="ยังไม่มีข้อมูลหน่วยงาน"
            loading-text="กำลังโหลดข้อมูลหน่วยงาน..."
            class="admin-table"
            hide-default-footer
          >
            <template #[`item.Name`]="{ item }">
              <span class="text-body-2 font-weight-medium">{{ item.Name }}</span>
            </template>

            <template #[`item.Description`]="{ item }">
              <span class="admin-muted-text">{{ item.Description || '-' }}</span>
            </template>

            <template #[`item.edit`]="{ item }">
              <v-btn
                small
                outlined
                class="btn-action"
                prepend-icon="mdi-pencil-outline"
                :to="{ path: '/Organizations/OrganizationForm', query: { OrganID: item.ID } }"
              >
                แก้ไข
              </v-btn>
            </template>

            <template #[`item.delete`]="{ item }">
              <v-btn
                small
                outlined
                color="error"
                class="btn-action"
                prepend-icon="mdi-delete-outline"
                @click="confirmDeleteOrganization(item)"
              >
                ลบ
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
        <v-row class="mt-10">
          <v-col>
            <v-btn color="primary" :to="{ path: '/Organizations/OrganizationForm' }">
              เพิ่มหน่วยงาน
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: 'OrganizationList',
  data () {
    return {
      loading: false,
      organ: [],
      headers: [
        { text: 'ชื่อหน่วยงาน', value: 'Name', align: 'start', styled: {} },
        { text: 'รายละเอียด', value: 'edit', sortable: false, align: 'start' },
        { text: '', value: 'delete', sortable: false, align: 'start' }
      ]
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      this.loading = true
      try {
        const result = await this.$axios.$get(this.$apiUrl('/api/organizations'))
        this.organ = result.data || []
      } catch (err) {
        this.$swal.fire({
          icon: 'error',
          text: `ดึงข้อมูลไม่สำเร็จ ${err.message}`
        })
      } finally {
        this.loading = false
      }
    },
    async confirmDeleteOrganization (item) {
      const result = await this.$swal.fire({
        icon: 'warning',
        title: 'ยืนยันการลบหน่วยงาน',
        text: `คุณต้องการลบหน่วยงาน "${item.Name}" ใช่หรือไม่?`,
        showCancelButton: true,
        confirmButtonText: 'ยืนยันลบ',
        cancelButtonText: 'ยกเลิก',
        confirmButtonColor: '#D32F2F',
        cancelButtonColor: '#757575'
      })

      if (!result.isConfirmed) { return }

      try {
        await this.$axios.$delete(this.$apiUrl(`/api/organization/${item.ID}`))
        this.$swal.fire({
          icon: 'success',
          text: 'ลบข้อมูลหน่วยงานสำเร็จ'
        })
        await this.fetchData()
      } catch (err) {
        const message = err.response?.data?.message || err.message
        this.$swal.fire({
          icon: 'error',
          text: `ไม่สามารถลบข้อมูลหน่วยงานได้ ${message}`
        })
      }
    }
  }
}
</script>
