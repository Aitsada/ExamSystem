<template>
  <v-container fluid class="pa-6 bg-surface">
    <!-- Header Row -->
    <v-row align="end" class="mb-5">
      <v-col>
        <p class="text-h6 font-weight-medium mb-0" style="color:#2C2C2A;">
          สถานที่สอบ
        </p>
        <p class="text-caption text-medium-emphasis mb-0">
          จัดการข้อมูลสถานที่สอบทั้งหมด
        </p>
      </v-col>
      <v-col cols="auto">
        <v-btn
          elevation="0"
          class="add-btn"
          prepend-icon="mdi-plus"
          @click="$router.push('/Admins/FacilityForm2')"
        >
          เพิ่มสถานที่สอบ
        </v-btn>
      </v-col>
    </v-row>

    <!-- Main Card -->
    <v-card elevation="0" rounded="xl" border class="facility-card">
      <!-- Toolbar: Search + Count -->
      <v-card-text class="pa-3">
        <v-row align="center" no-gutters>
          <v-col>
            <v-text-field
              v-model="search"
              placeholder="ค้นหาสถานที่สอบ..."
              prepend-inner-icon="mdi-magnify"
              hide-details
              density="compact"
              variant="outlined"
              class="search-field"
            />
          </v-col>
          <v-col cols="auto" class="ml-3">
            <v-chip size="small" variant="tonal" color="grey">
              {{ filteredFacility.length }} รายการ
            </v-chip>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <!-- Data Table -->
      <v-data-table
        :headers="headers"
        :items="filteredFacility"
        :items-per-page="perPage"
        :loading="loading"
        no-data-text="ไม่พบสถานที่สอบ"
        loading-text="กำลังโหลด..."
        class="facility-table"
        hide-default-footer
        :page.sync="currentPage"
      >
        <!-- Name column with avatar -->
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #[`item.Name`]="{ item }">
          <v-row align="center" no-gutters>
            <v-col cols="auto" class="mr-3">
              <v-avatar size="32" rounded="lg" color="blue-lighten-5">
                <span class="text-caption font-weight-medium text-blue-darken-2">
                  {{ getInitials(item.Name) }}
                </span>
              </v-avatar>
            </v-col>
            <v-col>
              <span class="text-body-2">{{ item.Name }}</span>
            </v-col>
          </v-row>
        </template>

        <!-- Edit button -->
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #[`item.edit`]="{ item }">
          <v-btn
            size="small"
            elevation="0"
            variant="outlined"
            class="btn-edit"
            :to="`/Admins/FacilityForm2/${item.id}`"
          >
            แก้ไข
          </v-btn>
        </template>

        <!-- Delete button -->
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #[`item.delete`]="{ item }">
          <v-btn
            size="small"
            elevation="0"
            variant="outlined"
            class="btn-delete"
            @click="confirmDelete(item)"
          >
            ลบ
          </v-btn>
        </template>
      </v-data-table>

      <v-divider />

      <!-- Pagination Row -->
      <v-card-text class="pa-2">
        <v-row align="center" no-gutters>
          <v-col>
            <span class="text-caption text-medium-emphasis">
              แสดง {{ paginationStart }}–{{ paginationEnd }} จาก {{ filteredFacility.length }} รายการ
            </span>
          </v-col>
          <v-col cols="auto">
            <v-pagination
              v-model="currentPage"
              :length="pageCount"
              :total-visible="5"
              density="compact"
              class="custom-pagination"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="360">
      <v-card elevation="0" rounded="xl" border>
        <v-card-text class="pa-5">
          <v-row align="center" no-gutters class="mb-3">
            <v-col cols="auto" class="mr-2">
              <v-icon color="error" size="22">
                mdi-alert-circle-outline
              </v-icon>
            </v-col>
            <v-col>
              <span class="text-body-1 font-weight-medium">ยืนยันการลบ</span>
            </v-col>
          </v-row>
          <p class="text-body-2 text-medium-emphasis mb-0">
            คุณต้องการลบ
            <strong style="color:#2C2C2A;">{{ deleteTarget && deleteTarget.Name }}</strong>
            ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้
          </p>
        </v-card-text>
        <v-card-actions class="px-5 pb-4 pt-0">
          <v-spacer />
          <v-btn
            elevation="0"
            variant="outlined"
            class="btn-cancel"
            @click="deleteDialog = false"
          >
            ยกเลิก
          </v-btn>
          <v-btn
            elevation="0"
            variant="tonal"
            color="error"
            class="btn-confirm-delete"
            @click="doDelete"
          >
            ลบ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar"
      :timeout="2500"
      location="bottom"
      color="white"
      elevation="2"
      rounded="lg"
    >
      <span class="text-caption" style="color:#2C2C2A;">{{ snackbarMsg }}</span>
      <template #actions>
        <v-btn icon size="x-small" variant="text" @click="snackbar = false">
          <v-icon size="16" color="grey">
            mdi-close
          </v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  name: 'FacilityList',
  data () {
    return {
      loading: false,
      search: '',
      currentPage: 1,
      perPage: 5,
      facility: [],
      headers: [
        { title: 'ชื่อสถานที่สอบ', key: 'Name', align: 'start', width: '60%' },
        { title: 'แก้ไข', key: 'edit', sortable: false, align: 'center', width: '20%' },
        { title: 'ลบ', key: 'delete', sortable: false, align: 'center', width: '20%' }
      ],
      deleteDialog: false,
      deleteTarget: null,
      snackbar: false,
      snackbarMsg: ''
    }
  },
  computed: {
    filteredFacility () {
      if (!this.search) { return this.facility }
      const q = this.search.toLowerCase()
      return this.facility.filter(f => f.Name.toLowerCase().includes(q))
    },
    pageCount () {
      return Math.ceil(this.filteredFacility.length / this.perPage)
    },
    paginationStart () {
      if (this.filteredFacility.length === 0) { return 0 }
      return (this.currentPage - 1) * this.perPage + 1
    },
    paginationEnd () {
      return Math.min(this.currentPage * this.perPage, this.filteredFacility.length)
    }
  },
  mounted () {
    this.loadFacilities()
  },
  methods: {
    async loadFacilities () {
      this.loading = true
      try {
        const response = await this.$axios.$get('http://localhost:8005/api')
        this.facility = response
      } catch (error) {
        console.error('Error loading facilities:', error)
      } finally {
        this.loading = false
      }
    },
    getInitials (name) {
      const words = name.split(' ')
      if (words.length >= 2) { return (words[0][0] + words[1][0]).toUpperCase() }
      return name.slice(0, 2).toUpperCase()
    },
    confirmDelete (item) {
      this.deleteTarget = item
      this.deleteDialog = true
    },
    async doDelete () {
      try {
        await this.$axios.$delete(`http://localhost:8005/api/${this.deleteTarget.id}`)
        this.facility = this.facility.filter(f => f.id !== this.deleteTarget.id)
        this.snackbarMsg = `ลบ "${this.deleteTarget.Name}" เรียบร้อยแล้ว`
        this.snackbar = true
      } catch (error) {
        console.error('Error deleting facility:', error)
        this.snackbarMsg = 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
        this.snackbar = true
      } finally {
        this.deleteDialog = false
        this.deleteTarget = null
      }
    }
  }
}
</script>

<style scoped>
.bg-surface {
  background-color: #F1EFE8;
  min-height: 100vh;
}

.add-btn {
  background-color: #ffffff !important;
  border: 1px solid #B4B2A9 !important;
  border-radius: 8px !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  color: #2C2C2A !important;
  text-transform: none !important;
  letter-spacing: 0 !important;
}

.add-btn:hover {
  background-color: #F1EFE8 !important;
}

.facility-card {
  border-color: #D3D1C7 !important;
}

.search-field :deep(.v-field__outline) {
  border-color: #D3D1C7 !important;
}

.search-field :deep(.v-field__input) {
  font-size: 13px !important;
}

.facility-table {
  box-shadow: none !important;
}

.facility-table :deep(thead tr th) {
  background-color: #F1EFE8 !important;
  font-size: 12px !important;
  font-weight: 500 !important;
  color: #5F5E5A !important;
}

.facility-table :deep(tbody tr td) {
  font-size: 13px !important;
  color: #2C2C2A !important;
  height: 52px !important;
}

.facility-table :deep(tbody tr:hover td) {
  background-color: #F9F8F4 !important;
}

.btn-edit {
  border-color: #B4B2A9 !important;
  color: #2C2C2A !important;
  font-size: 12px !important;
  text-transform: none !important;
  letter-spacing: 0 !important;
}

.btn-edit:hover {
  background-color: #F1EFE8 !important;
}

.btn-delete {
  border-color: #F09595 !important;
  color: #A32D2D !important;
  font-size: 12px !important;
  text-transform: none !important;
  letter-spacing: 0 !important;
}

.btn-delete:hover {
  background-color: #FCEBEB !important;
}

.custom-pagination :deep(.v-pagination__item),
.custom-pagination :deep(.v-pagination__prev),
.custom-pagination :deep(.v-pagination__next) {
  box-shadow: none !important;
  font-size: 12px !important;
}

.btn-cancel {
  border-color: #B4B2A9 !important;
  color: #2C2C2A !important;
  text-transform: none !important;
  letter-spacing: 0 !important;
}

.btn-confirm-delete {
  text-transform: none !important;
  letter-spacing: 0 !important;
}
</style>
