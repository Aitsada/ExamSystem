<template>
  <main>
    <v-container style="max-width: 480px; margin: 2rem auto;">
      <div style="margin-bottom: 2rem;">
        <p style="font-size: 13px; color: grey; margin: 0;">
          ระบบจัดการสถานที่สอบ
        </p>
        <h2 style="font-size: 22px; font-weight: 500; margin: 4px 0 0;">
          เพิ่มสถานที่สอบ
        </h2>
      </div>

      <v-alert
        v-if="facilityMessage"
        :type="facilityError ? 'error' : 'success'"
        dense
        text
        style="margin-bottom: 20px; border-radius: 8px;"
      >
        {{ facilityMessage }}
      </v-alert>

      <v-form>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <v-text-field
            v-model.trim="facility.Name"
            label="ชื่อสถานที่สอบ"
            placeholder="เช่น อาคารศูนย์สอบกลาง"
            outlined
            dense
          />
          <v-text-field
            v-model.trim="facility.DisplayName"
            label="ชื่อแสดง"
            placeholder="เช่น ศูนย์สอบ A"
            outlined
            dense
          />
          <v-textarea
            v-model.trim="facility.Description"
            label="รายละเอียด"
            placeholder="อธิบายสถานที่สอบเพิ่มเติม..."
            outlined
            dense
            rows="3"
            auto-grow
          />
        </div>

        <v-divider style="margin: 16px 0;" />

        <div style="display: flex; justify-content: flex-end; gap: 10px;">
          <v-btn text @click="backBtn">
            ยกเลิก
          </v-btn>
          <v-btn color="primary" depressed :loading="loading" @click="saveFacility">
            บันทึกข้อมูล
          </v-btn>
        </div>
      </v-form>
    </v-container>
  </main>
</template>

<script>
export default {
  name: 'FacilityCreate',
  data () {
    return {
      loading: false,
      facility: { Name: '', DisplayName: '', Description: '', CreatedBy: 'Admin' },
      facilityError: false,
      facilityMessage: ''
    }
  },
  methods: {
    backBtn () {
      this.$router.back()
    },
    async saveFacility () {
      this.loading = true
      this.facilityMessage = ''
      try {
        await this.$axios.$post('http://localhost:8005/api/create', { ...this.facility })
        this.facilityError = false
        this.facilityMessage = 'บันทึกข้อมูลสถานที่สอบสำเร็จ'
        this.facility = { Name: '', DisplayName: '', Description: '', CreatedBy: 'Admin' }
      } catch (err) {
        this.facilityError = true
        this.facilityMessage = 'บันทึกข้อมูลสถานที่สอบไม่สำเร็จ'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
