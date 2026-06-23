<template>
  <v-row style="justify-content: center;" no-gutters>
    <v-col cols="8">
      <v-container class="admin-page">
        <v-card elevation="0" rounded="lg" border color="gray" class="admin-card admin-form-card mb-5">
          <v-card-text>
            <v-form ref="form">
              <v-row align="center" class="compact-row" no-gutters>
                <v-col cols="12" md="3">
                  <span class="field-label">ชื่อหน่วยงาน :</span>
                </v-col>
                <v-col cols="12" md="6" class="field-col">
                  <v-text-field
                    v-model.trim="organ.Name"
                    outlined
                    dense
                    hide-details="auto"
                    :rules="[v => !!v || 'กรุณากรอกชื่อหน่วยงาน']"
                    class="form-field"
                  />
                </v-col>
              </v-row>

              <v-row align="center" class="compact-row" no-gutters>
                <v-col cols="12" md="3">
                  <span class="field-label">รายละเอียด :</span>
                </v-col>
                <v-col cols="12" md="6" class="field-col">
                  <v-text-field
                    v-model.trim="organ.Description"
                    outlined
                    dense
                    hide-details
                    class="form-field"
                  />
                </v-col>
              </v-row>

              <v-row align="center" class="compact-row" no-gutters>
                <v-col cols="12" md="3">
                  <span class="field-label">โลโก้ :</span>
                </v-col>
                <v-col cols="12" md="6" class="field-col">
                  <v-file-input
                    v-model="logoFile"
                    dense
                    outlined
                    hide-details="auto"
                    show-size
                    prepend-icon=""
                    prepend-inner-icon="mdi-image-plus-outline"
                    placeholder="เลือกไฟล์โลโก้"
                    accept="image/png,image/jpeg,image/webp"
                    class="form-field"
                  />
                </v-col>
              </v-row>
            </v-form>

            <div class="admin-actions-row">
              <v-btn
                color="primary"
                class="btn-save"
                :loading="loading"
                prepend-icon="mdi-content-save-outline"
                @click="saveAddData"
              >
                {{ isEditMode ? 'บันทึกการแก้ไขข้อมูลหน่วยงาน' : 'บันทึกข้อมูลหน่วยงาน' }}
              </v-btn>
            </div>
          </v-card-text>
        </v-card>

        <template v-if="isEditMode">
          <v-row align="center" class="admin-section-header mb-3" no-gutters>
            <v-col>
              <p class="section-title mb-0">
                รอบสอบ
              </p>
            </v-col>
          </v-row>

          <v-card elevation="0" rounded="lg" border color="white" class="admin-card">
            <v-data-table
              :headers="examHeaders"
              :items="exam"
              :items-per-page="-1"
              no-data-text="ยังไม่มีข้อมูลรอบสอบ"
              class="admin-table"
              hide-default-footer
            >
              <template #[`item.Name`]="{ item }">
                <span class="text-body-2 font-weight-medium">{{ item.Name }}</span>
              </template>

              <template #[`item.StatusID`]="{ item }">
                <span class="admin-muted-text">{{ getStatusName(item.StatusID) }}</span>
              </template>

              <template #[`item.edit`]="{ item }">
                <v-btn
                  small
                  outlined
                  class="btn-action"
                  prepend-icon="mdi-pencil-outline"
                  :to="{ path: '/Organizations/ExamForm', query: { OrganID: organ.ID, ExamID: item.ID } }"
                >
                  แก้ไข
                </v-btn>
              </template>
              <template #[`item.delete`]="{ item }">
                <v-btn
                  small
                  outlined
                  class="btn-action"
                  prepend-icon="mdi-delete-outline"
                  @click="confirmDeleteExam(item)"
                >
                  ลบ
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
          <v-row class="mt-10">
            <v-col cols="auto">
              <v-btn
                color="primary"
                class="btn-add"
                prepend-icon="mdi-plus"
                :to="{ path: '/Organizations/ExamForm', query: { OrganID: organ.ID } }"
              >
                เพิ่มรอบสอบ
              </v-btn>
            </v-col>
          </v-row>
        </template>
      </v-container>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: 'OrganizationForm',
  data () {
    return {
      loading: false,
      logoFile: null,
      isEditMode: false,
      statusMap: {
        0: 'None',
        1: 'Opened',
        2: 'Canceled',
        3: 'Completed'
      },
      organ: { ID: '', Name: '', Description: '' },
      exam: [],
      examHeaders: [
        { text: 'ชื่อรอบสอบ', value: 'Name', align: 'start', width: '60%' },
        { text: 'สถานะ', value: 'StatusID', align: 'start', width: '10%' },
        { text: 'แก้ไขข้อมูล', value: 'edit', sortable: false, align: 'start', width: '15%' },
        { text: '', value: 'delete', sortable: false, align: 'start', width: '15%' }
      ]
    }
  },
  computed: {
    pageTitle () {
      return this.isEditMode ? 'แก้ไขหน่วยงาน' : 'เพิ่มหน่วยงาน'
    }
  },
  async mounted () {
    const organId = this.$route.query.OrganID
    this.organ.ID = organId || ''
    if (organId) {
      this.isEditMode = true
      await this.fetchDataByID(organId)
      await this.fetchExamByOrganID(organId)
    }
  },
  methods: {
    getStatusName (statusID) {
      return this.statusMap[Number(statusID)] || '-'
    },
    backBtn () {
      this.$router.back()
    },
    async fetchDataByID (organID) {
      const result = await this.$axios.$get(this.$apiUrl(`/api/organization/${organID}`))
      const data = result.data
      this.organ = {
        ID: data.ID,
        Name: data.Name,
        Description: data.Description || ''
      }
    },
    async fetchExamByOrganID (organID) {
      try {
        const result = await this.$axios.$get(this.$apiUrl(`/api/${organID}/exams`))
        this.exam = result.data
      } catch (error) {
        const message = error.response?.data?.message
        this.$swal.fire({
          icon: 'error',
          text: `ดึงข้อมูลไม่สำเร็จ ${message}`
        })
      }
    },
    async saveAddData () {
      const valid = this.$refs.form.validate()
      if (!valid) { return }

      const formData = new FormData()

      formData.append('Name', this.organ.Name)
      formData.append('Description', this.organ.Description)

      if (this.logoFile) {
        formData.append('logo', this.logoFile)
      }
      this.loading = true
      try {
        if (this.isEditMode === true) {
          await this.$axios.$patch(this.$apiUrl(`/api/organization/${this.organ.ID}`), { Name: this.organ.Name, Description: this.organ.Description })

          if (this.logoFile) {
            await this.$axios.$patch(this.$apiUrl(`/api/organization/${this.organ.ID}/logo`), formData)
          }

          this.$swal.fire({
            icon: 'success',
            text: 'แก้ไขข้อมูลหน่วยงานสำเร็จ'
          })
        } else {
          const result = await this.$axios.$post(this.$apiUrl('/api/organization'), formData)
          const newId = result?.data?.ID
          if (newId) {
            this.organ.ID = newId
            this.isEditMode = true
            this.$router.replace({
              path: '/Organizations/OrganizationForm',
              query: { OrganID: newId }
            })
          }
          this.$swal.fire({
            icon: 'success',
            text: 'เพิ่มข้อมูลหน่วยงานสำเร็จ'
          })
        }
      } catch (error) {
        const message = error.response?.data?.message || 'กรุณาลองใหม่อีกครั้ง'
        this.$swal.fire({
          icon: 'error',
          text: `ไม่สามารถบันทึกข้อมูลหน่วยงานได้ ${message}`
        })
      } finally {
        this.loading = false
      }
    },
    async confirmDeleteExam (item) {
      const result = await this.$swal.fire({
        icon: 'warning',
        title: 'ยืนยันการลบรอบสอบ',
        text: `คุณต้องการลบรอบสอบ "${item.Name}" ใช่หรือไม่?`,
        showCancelButton: true,
        confirmButtonText: 'ยืนยันลบ',
        cancelButtonText: 'ยกเลิก',
        confirmButtonColor: '#D32F2F',
        cancelButtonColor: '#757575'
      })

      if (!result.isConfirmed) { return }

      try {
        await this.$axios.$delete(this.$apiUrl(`/api/exam/${item.ID}`))
        this.$swal.fire({
          icon: 'success',
          text: 'ลบข้อมูลรอบสอบสำเร็จ'
        })
        await this.fetchExamByOrganID(this.organ.ID)
      } catch (err) {
        this.$swal.fire({
          icon: 'error',
          text: `ไม่สามารถลบข้อมูลรอบสอบได้ ${err}`
        })
      }
    }
  }
}
</script>
