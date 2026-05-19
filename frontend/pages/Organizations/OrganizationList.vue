<template>
  <v-container class="admin-page">
    <v-breadcrumbs
      :items="breadcrumbs"
      density="compact"
      class="admin-breadcrumbs pa-0 mb-4"
    >
      <template #divider>
        <v-icon size="14" color="grey">
          mdi-chevron-right
        </v-icon>
      </template>
    </v-breadcrumbs>

    <v-row align="center" class="admin-page-header mb-5" no-gutters>
      <v-col cols="auto" class="mr-3">
        <div class="admin-title-marker" />
      </v-col>
      <v-col>
        <p class="admin-eyebrow mb-0">
          ระบบจัดการหน่วยงาน
        </p>
        <p class="admin-page-title mb-0">
          รายชื่อหน่วยงาน
        </p>
      </v-col>
      <v-col cols="auto">
        <v-btn
          color="primary"
          class="btn-add"
          prepend-icon="mdi-plus"
          :to="{ path: '/Organizations/OrganizationForm' }"
        >
          เพิ่มหน่วยงาน
        </v-btn>
      </v-col>
    </v-row>

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
      </v-data-table>
    </v-card>
  </v-container>
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
        { text: 'แก้ไขข้อมูล', value: 'edit', sortable: false, align: 'center' }
      ],
      breadcrumbs: [
        { text: 'หน้าหลัก', href: '/Admin', disabled: false },
        { text: 'หน่วยงาน', disabled: true }
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
    }
  }
}
</script>
