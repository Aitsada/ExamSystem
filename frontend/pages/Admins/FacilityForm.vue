<template>
  <v-container style="max-width: 900px; padding: 0;">
    <!-- Breadcrumb -->
    <v-breadcrumbs
      :items="breadcrumbs"
      density="compact"
      class="pa-0 mb-4"
    >
      <template #divider>
        <v-icon size="14" color="grey">
          mdi-chevron-right
        </v-icon>
      </template>
    </v-breadcrumbs>

    <!-- Page Header -->
    <v-sheet color="transparent" class="mb-5">
      <v-row align="center" no-gutters>
        <v-col cols="auto" class="mr-3">
          <v-sheet
            color="primary"
            rounded="lg"
            width="6"
            height="36"
          />
        </v-col>
        <v-col>
          <p class="text-caption text-medium-emphasis mb-0">
            ระบบจัดการสถานที่สอบ
          </p>
          <p class="text-h6 font-weight-bold mb-0" style="color: #1A237E; letter-spacing: 0.02em;">
            เพิ่มสถานที่สอบ
          </p>
        </v-col>
      </v-row>
    </v-sheet>

    <!-- Form Card -->
    <v-card elevation="0" rounded="lg" border color="white">
      <v-card-text class="px-5 py-4">
        <v-form ref="form">
          <!-- ชื่อสถานที่สอบ -->
          <v-row align="center" class="mb-3" no-gutters>
            <v-col cols="4">
              <v-row align="center" no-gutters>
                <v-col cols="auto">
                  <span class="text-body-2 font-weight-medium" style="color:#333;">
                    ชื่อสถานที่สอบ
                  </span>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="8">
              <v-text-field
                v-model.trim="facility.Name"
                placeholder="เช่น อาคารศูนย์สอบกลาง"
                variant="outlined"
                density="compact"
                hide-details="auto"
                :rules="[v => !!v || 'กรุณากรอกชื่อสถานที่สอบ']"
                class="form-field"
                outlined
              />
            </v-col>
          </v-row>

          <!-- ชื่อแสดง -->
          <v-row align="center" class="mb-3" no-gutters>
            <v-col cols="4">
              <v-row align="center" no-gutters>
                <v-col>
                  <span class="text-body-2 font-weight-medium" style="color:#333;">
                    ชื่อแสดง
                  </span>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="8">
              <v-text-field
                v-model.trim="facility.DisplayName"
                placeholder="เช่น ศูนย์สอบ A"
                variant="outlined"
                density="compact"
                hide-details="auto"
                :rules="[v => !!v || 'กรุณากรอกชื่อแสดง']"
                class="form-field"
                outlined
              />
            </v-col>
          </v-row>

          <!-- รายละเอียด -->
          <v-row align="start" class="mb-1" no-gutters>
            <v-col cols="4" class="pt-2">
              <span class="text-body-2 font-weight-medium" style="color:#333;">
                รายละเอียด
              </span>
              <p class="text-caption text-medium-emphasis mb-0">
                (ไม่บังคับ)
              </p>
            </v-col>
            <v-col cols="8">
              <v-textarea
                v-model.trim="facility.Description"
                placeholder="อธิบายสถานที่สอบเพิ่มเติม..."
                variant="outlined"
                density="compact"
                hide-details
                rows="3"
                auto-grow
                class="form-field"
                outlined
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-text class="px-5 py-4">
        <v-row align="start" no-gutters>
          <v-col cols="4" class="pt-2">
            <span class="text-body-2 font-weight-medium" style="color:#333;">
              ไฟล์แนบ
            </span>
            <p class="text-caption text-medium-emphasis mb-0">
              (ไม่บังคับ)
            </p>
          </v-col>
          <v-col cols="8">
            <v-file-input
              v-model="attachedFiles"
              show-size
              counter
              multiple
              variant="outlined"
              density="compact"
              hide-details
              placeholder="เลือกไฟล์..."
              prepend-icon=""
              prepend-inner-icon="mdi-upload-outline"
              class="form-field"
              outlined
            />
            <p class="text-caption text-medium-emphasis mt-1 mb-0">
              รองรับไฟล์ .pdf, .jpg, .png ขนาดไม่เกิน 10MB
            </p>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <!-- Actions -->
      <v-card-actions class="px-5 py-4">
        <v-row align="center" no-gutters>
          <v-col>
            <span class="text-caption text-medium-emphasis">
              <v-icon size="13" color="error" class="mr-1">mdi-asterisk</v-icon>
              ข้อมูลที่มีเครื่องหมาย "จำเป็น" ต้องกรอก
            </span>
          </v-col>
          <v-col cols="auto">
            <v-btn
              variant="text"
              class="mr-2 btn-cancel"
              @click="backBtn"
            >
              ยกเลิก
            </v-btn>
            <v-btn
              color="primary"
              variant="flat"
              :loading="loading"
              class="btn-save"
              prepend-icon="mdi-content-save-outline"
              @click="saveFacility"
            >
              บันทึกข้อมูล
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'FacilityCreate',
  data () {
    return {
      loading: false,
      attachedFiles: [],
      facility: {
        Name: '',
        DisplayName: '',
        Description: '',
        CreatedBy: 'Admin'
      },
      breadcrumbs: [
        { text: 'หน้าหลัก', href: '/Admin', disabled: false },
        { text: 'สถานที่สอบ', href: '/Admins/FacilityList', disabled: false },
        { text: 'เพิ่มสถานที่สอบ', disabled: true }
      ]
    }
  },
  methods: {
    backBtn () {
      this.$router.back()
    },
    async saveFacility () {
      const valid = this.$refs.form.validate()
      if (!valid) { return }

      this.loading = true
      try {
        await this.$axios.$post(this.$apiUrl('/api/create'), { ...this.facility })
        this.$swal.fire({
          icon: 'success',
          title: 'บันทึกข้อมูลสำเร็จ',
          text: 'บันทึกข้อมูลสถานที่สอบสำเร็จ',
          confirmButtonText: 'ตกลง'
        })
        this.facility = { Name: '', DisplayName: '', Description: '', CreatedBy: 'Admin' }
        this.attachedFiles = []
        this.$refs.form.resetValidation()
      } catch (err) {
        this.$swal.fire({
          icon: 'error',
          title: 'บันทึกข้อมูลไม่สำเร็จ',
          text: 'กรุณาลองใหม่อีกครั้ง',
          confirmButtonText: 'ตกลง'
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.form-field :deep(.v-field__outline) {
  border-color: #B0BEC5 !important;
}

.form-field :deep(.v-field__input) {
  font-size: 13px !important;
}

.form-field :deep(.v-field:hover .v-field__outline) {
  border-color: #1A237E !important;
}

.btn-cancel {
  color: #555 !important;
  font-size: 13px !important;
  text-transform: none !important;
  letter-spacing: 0 !important;
}

.btn-save {
  font-size: 13px !important;
  text-transform: none !important;
  letter-spacing: 0 !important;
  border-radius: 6px !important;
}
</style>
