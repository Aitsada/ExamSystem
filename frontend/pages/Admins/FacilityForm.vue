<template>
  <main>
    <v-form>
      <v-container>
        <v-row style=" justify-content: center">
          <v-col cols="4">
            <v-text-field
              v-model.trim="facility.Name"
              label="ชื่อสถานที่สอบ"
              placeholder="กรอกชื่อสถานที่สอบ"
              outlined
            />
          </v-col>
        </v-row>
        <v-row style=" justify-content: center">
          <v-col cols="4">
            <v-text-field
              v-model.trim="facility.DisplayName"
              label="ชื่อแสดง"
              placeholder="กรอกชื่อแสดง"
              outlined
            />
          </v-col>
        </v-row>
        <v-row style=" justify-content: center">
          <v-col cols="4">
            <v-text-field
              v-model.trim="facility.Description"
              label="รายละเอียด"
              placeholder="กรอกรายละเอียด"
              outlined
            />
          </v-col>
        </v-row>
        <v-row style=" justify-content: space-around">
          <v-col
            cols="4"
            style="
              display: flex;
              justify-content: space-between;
            "
          >
            <v-btn @click="saveFacility" color="primary">
              บันทึกข้อมูลสถานที่สอบ
            </v-btn>
            <v-btn @click="backBtn" color="error">
              ยกเลิก
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </main>
</template>
<script>
export default {
  name: 'FacilityList',
  data () {
    return {
      facility: {
        Name: '',
        DisplayName: '',
        Description: '',
        CreatedBy: 'Admin'
      },
      facilityError: false,
      facilityMessage: ''
    }
  },
  async mounted () {
    // await this.loadFacility()
  },
  methods: {
    async loadFacility () {
      this.Facility = await this.$axios.$get('http://localhost:8005/api/')
    },
    backBtn () {
      this.$router.back()
    },
    async saveFacility () {
      try {
        await this.$axios.$post('http://localhost:8005/api/create', { ...this.facility })
        this.facilityMessage = 'บันทึกข้อมูลสถานที่สอบสำเร็จ'
        this.facilityError = false
        console.log('saved :', this.facility)
        this.facility = {
          Name: '',
          DisplayName: '',
          Description: '',
          CreatedBy: 'Admin'
        }
        // await this.loadFacility()
      } catch (err) {
        this.facilityError = true
        this.facilityMessage = this.getErrorMessage(err, 'บันทึกข้อมูลสถานที่สอบไม่สำเร็จ')
      }
    }
  }
}
</script>
