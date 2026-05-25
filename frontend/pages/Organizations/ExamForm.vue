<template>
  <v-container class="admin-page admin-page-wide">
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
          {{ pageTitle }}
        </p>
      </v-col>
      <v-col cols="auto">
        <v-btn variant="text" class="btn-cancel" @click="backBtn">
          ยกเลิก
        </v-btn>
      </v-col>
    </v-row>

    <v-card elevation="0" rounded="lg" border color="white" class="admin-card admin-form-card mb-5">
      <v-card-text>
        <v-form ref="form">
          <v-row align="center" class="compact-row" no-gutters>
            <v-col cols="12" md="3">
              <span class="field-label">หน่วยงาน :</span>
            </v-col>
            <v-col cols="12" md="6" class="field-col">
              <span class="readonly-text">{{ organ.Name || '-' }}</span>
            </v-col>
          </v-row>

          <v-row align="center" class="compact-row" no-gutters>
            <v-col cols="12" md="3">
              <span class="field-label">ชื่อรอบสอบ :</span>
            </v-col>
            <v-col cols="12" md="6" class="field-col">
              <v-text-field
                v-model.trim="exam.Name"
                outlined
                dense
                hide-details="auto"
                :rules="[v => !!v || 'กรุณากรอกชื่อรอบสอบ']"
                class="form-field"
              />
            </v-col>
          </v-row>

          <v-row align="center" class="compact-row" no-gutters>
            <v-col cols="12" md="3">
              <span class="field-label">วันที่สอบ :</span>
            </v-col>
            <v-col cols="12" md="3" class="pr-md-3">
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                :return-value.sync="date"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    :value="dateText"
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    dense
                    outlined
                    hide-details
                    class="form-field"
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>

                <v-date-picker v-model="date" no-title scrollable>
                  <v-spacer />
                  <v-btn text color="primary" @click="menu = false">
                    ยกเลิก
                  </v-btn>
                  <v-btn text color="primary" @click="$refs.menu.save(date)">
                    ตกลง
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="6" md="2" class="pr-2">
              <v-select
                v-model="selectedStartTime"
                :items="timeOptions"
                dense
                outlined
                hide-details
                prepend-inner-icon="mdi-clock-start"
                class="form-field"
              />
            </v-col>
            <v-col cols="6" md="2">
              <v-select
                v-model="selectedEndTime"
                :items="timeOptions"
                dense
                outlined
                hide-details
                prepend-inner-icon="mdi-clock-end"
                class="form-field"
              />
            </v-col>
          </v-row>

          <v-row align="center" class="compact-row" no-gutters>
            <v-col cols="12" md="3">
              <span class="field-label">สถานะ :</span>
            </v-col>
            <v-col cols="12" md="4" class="field-col">
              <v-select
                v-model="exam.StatusID"
                :items="status"
                dense
                outlined
                hide-details
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
            {{ isEditMode ? 'บันทึกการแก้ไขรอบสอบ' : 'บันทึกรอบสอบ' }}
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <template v-if="isEditMode">
      <v-row align="center" class="admin-section-header mb-3" no-gutters>
        <v-col>
          <p class="section-title mb-0">
            ผู้สมัครและตำแหน่ง
          </p>
        </v-col>
        <v-col cols="auto">
          <v-btn color="primary" class="btn-add" prepend-icon="mdi-seat-outline">
            จัดที่นั่งสอบ
          </v-btn>
        </v-col>
      </v-row>

      <v-card elevation="0" rounded="lg" border color="white" class="admin-card admin-form-card mb-5">
        <v-card-text>
          <v-row align="center" class="compact-row" no-gutters>
            <v-col cols="12" md="3">
              <span class="field-label">ตำแหน่ง :</span>
            </v-col>
            <v-col cols="12" md="5" class="field-col">
              <v-select
                v-model="selectedPosition"
                :items="selectPosition"
                dense
                outlined
                hide-details
                placeholder="เลือกตำแหน่ง"
                class="form-field"
              />
            </v-col>
          </v-row>

          <v-row v-if="isNewPosition" align="start" class="compact-row" no-gutters>
            <v-col cols="12" md="3">
              <span class="field-label">ตำแหน่งใหม่ :</span>
            </v-col>
            <v-col cols="12" md="5" class="field-col">
              <v-textarea
                v-model.trim="newPositionName"
                dense
                outlined
                auto-grow
                rows="1"
                hide-details
                placeholder="กรอกตำแหน่งใหม่"
                class="form-field"
              />
            </v-col>
          </v-row>

          <v-row align="center" class="compact-row" no-gutters>
            <v-col cols="12" md="3">
              <span class="field-label">ผู้สมัคร :</span>
            </v-col>
            <v-col cols="12" md="5" class="field-col">
              <v-file-input
                v-model="applicantFile"
                dense
                outlined
                hide-details
                show-size
                accept=".xls,.xlsx"
                prepend-icon=""
                prepend-inner-icon="mdi-upload-outline"
                placeholder="เลือกไฟล์ผู้สมัคร"
                class="form-field"
              />
            </v-col>
          </v-row>

          <v-row align="center" class="compact-row" no-gutters>
            <v-col cols="12" md="3">
              <span class="field-label">ช่วง AppId :</span>
            </v-col>
            <v-col cols="6" md="2" class="pr-2">
              <v-text-field
                v-model.trim="startAppId"
                dense
                outlined
                hide-details
                placeholder="เริ่มต้น"
                class="form-field"
              />
            </v-col>
            <v-col cols="6" md="2">
              <v-text-field
                v-model.trim="endAppId"
                dense
                outlined
                hide-details
                placeholder="สิ้นสุด"
                class="form-field"
              />
            </v-col>
          </v-row>

          <div class="admin-actions-row">
            <v-btn
              color="primary"
              class="btn-save"
              :loading="applicantLoading"
              :disabled="!canImportApplicants"
              prepend-icon="mdi-account-plus-outline"
              @click="importApplicants"
            >
              เพิ่มข้อมูลผู้สมัคร
            </v-btn>
          </div>
        </v-card-text>
      </v-card>

      <v-card elevation="0" rounded="lg" border color="white" class="admin-card">
        <v-data-table
          :headers="positionHeaders"
          :items="positions"
          :items-per-page="-1"
          no-data-text="ยังไม่มีข้อมูลตำแหน่ง"
          class="admin-table"
          hide-default-footer
        >
          <template #[`item.Name`]="{ item }">
            <span class="text-body-2 font-weight-medium">{{ item.Name }}</span>
          </template>

          <template #[`item.delete`]="{ item }">
            <v-btn
              small
              outlined
              color="error"
              class="btn-action"
              prepend-icon="mdi-delete-outline"
              @click="confirmDeletePosition(item)"
            >
              ลบ
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </template>
  </v-container>
</template>
<script>
export default {
  name: 'ExamForm',
  data () {
    return {
      loading: false,
      applicantLoading: false,
      isEditMode: false,
      status: [
        { text: 'None', value: 0 },
        { text: 'Opened', value: 1 },
        { text: 'Canceled', value: 2 },
        { text: 'Completed', value: 3 }
      ],
      timeOptions: ['8:00',
        '8:30',
        '9:00',
        '9:30',
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
      selectedStartTime: '8:00',
      selectedEndTime: '17:00',
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      menu: false,
      modal: false,
      menu2: false,
      newPositionValue: '__new_position__',
      selectedPosition: '',
      newPositionName: '',
      applicantFile: null,
      AppRange: 0,
      startAppId: '',
      endAppId: '',
      organ: { ID: '', Name: '', Description: '' },
      exam: { ID: '', StatusID: 0, StartDateTime: '', EndDateTime: '' },
      positions: [],
      selectPosition: [],
      positionHeaders: [
        { text: 'รหัส', value: 'ID', align: 'start', width: '20%' },
        { text: 'ตำแหน่ง', value: 'Name', align: 'start', width: '50%' },
        { text: 'จำนวน', value: 'Number', align: 'start', width: '15%' },
        { text: 'ลบข้อมูล', value: 'delete', sortable: false, align: 'center', width: '15%' }
      ],
      breadcrumbs: [
        { text: 'หน้าหลัก', href: '/Admin', disabled: false },
        { text: 'หน่วยงาน', href: '/Organizations/OrganizationList', disabled: false },
        { text: 'รอบสอบ', disabled: true }
      ]
    }
  },
  computed: {
    pageTitle () {
      return this.isEditMode ? 'แก้ไขรอบสอบ' : 'เพิ่มรอบสอบ'
    },
    dateText () {
      return this.formatDate(this.date)
    },
    selectedApplicantFile () {
      return Array.isArray(this.applicantFile) ? this.applicantFile[0] : this.applicantFile
    },
    isNewPosition () {
      return this.selectedPosition === this.newPositionValue
    },
    canImportApplicants () {
      if (!this.selectedPosition || !this.selectedApplicantFile) {
        return false
      }

      return !this.isNewPosition || !!this.newPositionName
    }
  },
  async mounted () {
    const organId = this.$route.query.OrganID
    const examId = this.$route.query.ExamID
    this.exam.ID = examId || ''
    this.organ.ID = organId || ''
    await this.fetchOrganDataByID(organId)
    if (examId) {
      this.isEditMode = true
      this.breadcrumbs[2].text = 'แก้ไขรอบสอบ'
      await this.fetchExamDataByID(examId)
      await this.fetchPositionByExamID(examId)
    }
  },
  methods: {
    backBtn () {
      this.$router.back()
    },
    async fetchOrganDataByID (organID) {
      const result = await this.$axios.$get(this.$apiUrl(`/api/organization/${organID}`))
      const data = result.data
      this.organ = {
        ID: data.ID,
        Name: data.Name,
        Description: data.Description || '',
        StartDateTime: data.StartDateTime || '',
        EndDateTime: data.EndDateTime || ''
      }
    },
    async fetchExamDataByID (examID) {
      try {
        const result = await this.$axios.$get(this.$apiUrl(`/api/exam/${examID}`))
        const data = result.data
        this.exam = {
          ID: data.ID,
          Name: data.Name,
          StatusID: Number(data.StatusID || 0),
          StartDateTime: data.StartDateTime,
          EndDateTime: data.EndDateTime
        }
        this.setDateAndTimeFromExam(data)
      } catch (error) {
        const message = error.response?.data?.message
        this.$swal.fire({
          icon: 'error',
          text: `ดึงข้อมูลไม่สำเร็จ ${message}`
        })
      }
    },
    async fetchPositionByExamID (examID) {
      try {
        const result = await this.$axios.$get(this.$apiUrl(`/api/${examID}/positions`))
        this.positions = result.data || []
        this.selectPosition = this.positions.map(position => ({
          text: position.Name,
          value: position.ID
        }))
        this.selectPosition.push({
          text: 'อื่นๆ',
          value: this.newPositionValue
        })
      } catch (err) {
        this.$swal.fire({
          icon: 'error',
          text: `fail ${err.message}`
        })
      }
    },
    formatDate (date) {
      if (!date) {
        return ''
      }
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    normalizeTime (time) {
      const [hour, minute] = time.split(':')
      return `${hour.padStart(2, '0')}:${minute || '00'}:00`
    },
    combineDateTime (time) {
      return `${this.date} ${this.normalizeTime(time)}`
    },
    setDateAndTimeFromExam (data) {
      const start = this.parseDateTime(data.StartDateTime)
      const end = this.parseDateTime(data.EndDateTime)

      if (start.date) {
        this.date = start.date
      }
      if (start.time) {
        this.selectedStartTime = start.time
      }
      if (end.time) {
        this.selectedEndTime = end.time
      }
    },
    parseDateTime (value) {
      if (!value) {
        return { date: '', time: '' }
      }

      const text = String(value).replace('T', ' ')
      const date = text.substr(0, 10)
      const time = text.substr(11, 5).replace(/^0/, '')

      return { date, time }
    },
    buildPayload () {
      return {
        Name: this.exam.Name,
        StatusID: Number(this.exam.StatusID),
        StartDateTime: this.combineDateTime(this.selectedStartTime),
        EndDateTime: this.combineDateTime(this.selectedEndTime)
      }
    },
    async importApplicants () {
      if (!this.selectedPosition || !this.selectedApplicantFile) {
        this.showError('นำเข้าผู้สมัครไม่สำเร็จ', 'กรุณาเลือกตำแหน่งและไฟล์ Excel')
        return
      }
      if (!this.isValidAppIdRange()) {
        return
      }

      this.applicantLoading = true
      try {
        const positionID = await this.getApplicantPositionID()
        const formData = new FormData()
        formData.append('file', this.selectedApplicantFile)
        formData.append('startAppId', this.startAppId)
        formData.append('endAppId', this.endAppId)
        const result = await this.$axios.$post(
          this.$apiUrl(`/api/${positionID}/applicants/import`),
          formData
        )

        this.applicantFile = null
        this.startAppId = ''
        this.endAppId = ''
        this.newPositionName = ''
        this.selectedPosition = positionID
        this.$swal.fire({
          icon: 'success',
          text: `นำเข้าผู้สมัคร ${result.imported || 0} รายการ`
        })
        await this.fetchPositionByExamID(this.exam.ID)
      } catch (error) {
        this.showError(
          'นำเข้าผู้สมัครไม่สำเร็จ',
          error.response?.data?.message || error.message || 'กรุณาลองใหม่อีกครั้ง'
        )
      } finally {
        this.applicantLoading = false
      }
    },
    isValidAppIdRange () {
      const startAppId = this.startAppId.trim()
      const endAppId = this.endAppId.trim()
      const appIdPattern = /^\d+$/

      if (startAppId && !appIdPattern.test(startAppId)) {
        this.showError('นำเข้าผู้สมัครไม่สำเร็จ', 'AppId เริ่มต้นต้องเป็นตัวเลข')
        return false
      }
      if (endAppId && !appIdPattern.test(endAppId)) {
        this.showError('นำเข้าผู้สมัครไม่สำเร็จ', 'AppId สิ้นสุดต้องเป็นตัวเลข')
        return false
      }
      if ((startAppId && !endAppId) || (!startAppId && endAppId)) {
        this.showError('นำเข้าผู้สมัครไม่สำเร็จ', 'กรุณากรอก AppId เริ่มต้นและสิ้นสุด')
        return false
      }
      if (startAppId && endAppId && Number(startAppId) > Number(endAppId)) {
        this.showError('นำเข้าผู้สมัครไม่สำเร็จ', 'AppId เริ่มต้นต้องไม่มากกว่าสิ้นสุด')
        return false
      }

      return true
    },
    async getApplicantPositionID () {
      if (!this.isNewPosition) {
        return this.selectedPosition
      }

      if (!this.newPositionName) {
        throw new Error('กรุณากรอกตำแหน่งใหม่')
      }

      const payload = {
        Name: this.newPositionName,
        Description: ''
      }
      const result = await this.$axios.$post(
        this.$apiUrl(`/api/${this.exam.ID}/position`),
        payload
      )
      const positionID = result.data?.insertId

      if (!positionID) {
        throw new Error('ไม่พบรหัสตำแหน่งที่สร้างใหม่')
      }

      await this.fetchPositionByExamID(this.exam.ID)
      return positionID
    },
    async saveAddData () {
      const valid = this.$refs.form.validate()
      if (!valid) { return }

      this.loading = true
      try {
        const payload = this.buildPayload()
        if (this.isEditMode) {
          await this.$axios.$patch(this.$apiUrl(`/api/${this.organ.ID}/exam/${this.exam.ID}`), payload)
        } else {
          const result = await this.$axios.$post(this.$apiUrl(`/api/${this.organ.ID}/exam`), payload)
          const newId = result?.data || result?.id
          if (newId) {
            this.exam.ID = newId
            this.isEditMode = true
            this.breadcrumbs[2].text = 'แก้ไขรอบสอบ'
            this.$router.replace({
              path: '/Organizations/ExamForm',
              query: { OrganID: this.organ.ID, ExamID: newId }
            })
          }
        }
        this.$swal.fire({
          icon: 'success',
          text: this.isEditMode ? 'แก้ไขรอบสอบสำเร็จ' : 'เพิ่มรอบสอบสำเร็จ'
        })
      } catch (error) {
        const message = error.response?.data?.message
        this.$swal.fire({
          icon: 'error',
          text: `ไม่สามารถบันทึกรอบสอบได้ ${message}`
        })
      } finally {
        this.loading = false
      }
    },
    showError (title, text) {
      this.$swal.fire({
        icon: 'error',
        title,
        text
      })
    },
    async confirmDeletePosition (item) {
      const result = await this.$swal.fire({
        icon: 'warning',
        title: 'ยืนยันการลบตำแหน่ง',
        text: `คุณต้องการลบตำแหน่ง "${item.Name}" ใช่หรือไม่?`,
        showCancelButton: true,
        confirmButtonText: 'ยืนยันลบ',
        cancelButtonText: 'ยกเลิก',
        confirmButtonColor: '#D32F2F',
        cancelButtonColor: '#757575'
      })

      if (!result.isConfirmed) { return }

      try {
        await this.$axios.$delete(this.$apiUrl(`/api/position/${item.ID}`))
        this.$swal.fire({
          icon: 'success',
          text: 'ลบข้อมูลตำแหน่งสำเร็จ'
        })
        await this.fetchPositionByExamID(this.exam.ID)
      } catch (err) {
        this.$swal.fire({
          icon: 'error',
          text: `ไม่สามารถลบตำแหน่งได้ ${err}`
        })
      }
    }
  }
}
</script>
