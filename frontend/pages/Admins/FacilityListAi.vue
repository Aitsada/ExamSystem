<template>
  <main class="facility-page">
    <section class="facility-form" aria-label="facility form">
      <div class="form-row">
        <label for="facility-name">ชื่อสถานที่สอบ:</label>
        <input
          id="facility-name"
          v-model.trim="facility.Name"
          type="text"
          :disabled="savingFacility"
        >
      </div>

      <div class="form-row">
        <label for="facility-display-name">ชื่อแสดง:</label>
        <input
          id="facility-display-name"
          v-model.trim="facility.DisplayName"
          type="text"
          :disabled="savingFacility"
        >
      </div>

      <div class="form-row">
        <label for="facility-description">รายละเอียด:</label>
        <input
          id="facility-description"
          v-model.trim="facility.Description"
          type="text"
          :disabled="savingFacility"
        >
      </div>

      <div class="form-row">
        <label for="room-plan">ผังห้อง:</label>
        <input
          id="room-plan"
          ref="roomPlanInput"
          type="file"
          :disabled="savingFacility"
          @change="onRoomPlanSelected"
        >
      </div>

      <button
        class="primary-button facility-save"
        type="button"
        :disabled="savingFacility"
        @click="saveFacility"
      >
        {{ savingFacility ? 'กำลังบันทึก...' : 'บันทึกข้อมูลสถานที่สอบ »' }}
      </button>

      <p v-if="facilityMessage" class="status-text" :class="{ error: facilityError }">
        {{ facilityMessage }}
      </p>
    </section>

    <section class="terminal-line" aria-hidden="true">
      |
    </section>

    <section class="building-import" aria-label="building import">
      <label for="building-file">อาคาร :</label>

      <div class="building-file">
        <input
          id="building-file"
          ref="buildingFileInput"
          type="file"
          accept=".xls,.xlsx"
          @change="onBuildingFileSelected"
        >
        <a class="example-link" href="#" @click.prevent>
          Example Excel File
        </a>
      </div>

      <button
        class="primary-button building-save"
        type="button"
        @click="saveBuildings"
      >
        บันทึกข้อมูลอาคาร »
      </button>

      <p v-if="buildingMessage" class="status-text building-status" :class="{ error: buildingError }">
        {{ buildingMessage }}
      </p>
    </section>
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
        CreatedBy: 'admin'
      },
      roomPlanFile: null,
      buildingFile: null,
      facilities: [],
      savingFacility: false,
      facilityMessage: '',
      facilityError: false,
      buildingMessage: '',
      buildingError: false
    }
  },
  async mounted () {
    await this.loadFacilities()
  },
  methods: {
    async loadFacilities () {
      try {
        this.facilities = await this.$axios.$get('http://localhost:8005/api')
      } catch (err) {
        this.facilityError = true
        this.facilityMessage = this.getErrorMessage(err, 'โหลดข้อมูลสถานที่สอบไม่สำเร็จ')
      }
    },
    onRoomPlanSelected (event) {
      this.roomPlanFile = event.target.files?.[0] || null
    },
    onBuildingFileSelected (event) {
      this.buildingFile = event.target.files?.[0] || null
      this.buildingMessage = ''
      this.buildingError = false
    },
    async saveFacility () {
      this.facilityMessage = ''
      this.facilityError = false

      if (!this.facility.Name || !this.facility.DisplayName) {
        this.facilityError = true
        this.facilityMessage = 'กรุณากรอกชื่อสถานที่สอบและชื่อแสดง'
        return
      }

      this.savingFacility = true

      try {
        await this.$axios.$post('http://localhost:8005/api/create', {
          ...this.facility,
          Description: this.facility.Description || null
        })

        this.facility = {
          Name: '',
          DisplayName: '',
          Description: '',
          CreatedBy: 'admin'
        }
        this.roomPlanFile = null

        if (this.$refs.roomPlanInput) {
          this.$refs.roomPlanInput.value = ''
        }

        await this.loadFacilities()
        this.facilityMessage = 'บันทึกข้อมูลสถานที่สอบสำเร็จ'
      } catch (err) {
        this.facilityError = true
        this.facilityMessage = this.getErrorMessage(err, 'บันทึกข้อมูลสถานที่สอบไม่สำเร็จ')
      } finally {
        this.savingFacility = false
      }
    },
    saveBuildings () {
      this.buildingError = false

      if (!this.buildingFile) {
        this.buildingError = true
        this.buildingMessage = 'กรุณาเลือกไฟล์ Excel อาคาร'
        return
      }

      this.buildingError = true
      this.buildingMessage = 'ยังไม่มี endpoint สำหรับนำเข้าไฟล์อาคารใน backend'
    },
    getErrorMessage (err, fallback) {
      return err?.response?.data?.message || fallback
    }
  }
}
</script>

<style scoped>
.facility-page {
  min-height: 100vh;
  padding: 54px 52px;
  background: #eeeeee;
  color: #333;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
}

.facility-form {
  border-top: 1px solid #dddddd;
}

.form-row {
  display: grid;
  grid-template-columns: 232px minmax(260px, 512px) 1fr;
  align-items: center;
  min-height: 78px;
  border-bottom: 1px solid #dddddd;
}

.form-row label,
.building-import label {
  padding-left: 8px;
  font-size: 18px;
  line-height: 1.2;
}

.form-row input[type='text'] {
  width: 100%;
  height: 47px;
  padding: 5px 10px;
  border: 3px solid #2b2b2b;
  border-right-color: #777;
  border-bottom-color: #777;
  background: #fff;
  color: #222;
  font-size: 18px;
  outline: none;
}

.form-row input[type='file'],
.building-import input[type='file'] {
  color: #333;
  font-size: 18px;
}

.primary-button {
  min-height: 84px;
  border: 0;
  border-radius: 8px;
  background: #438dcc;
  color: #fff;
  font-size: 29px;
  font-weight: 700;
  line-height: 1.1;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
  cursor: pointer;
}

.primary-button:disabled {
  opacity: 0.7;
  cursor: wait;
}

.facility-save {
  width: 405px;
  margin-top: 48px;
}

.status-text {
  margin: 16px 0 0;
  color: #257a35;
  font-size: 16px;
}

.status-text.error {
  color: #b00020;
}

.terminal-line {
  margin-top: 56px;
  padding: 16px 0 72px 8px;
  border-top: 1px solid #dddddd;
  color: #333;
  font-size: 24px;
}

.building-import {
  display: grid;
  grid-template-columns: 216px 1fr 336px 1fr;
  align-items: start;
  min-height: 114px;
  padding: 14px 0;
  border-top: 1px solid #dddddd;
  background: #fff;
}

.building-file {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.example-link {
  width: max-content;
  color: #4b90d9;
  font-size: 20px;
  text-decoration: none;
}

.example-link:hover {
  text-decoration: underline;
}

.building-save {
  width: 337px;
}

.building-status {
  grid-column: 2 / 4;
}

@media (max-width: 900px) {
  .facility-page {
    padding: 28px 20px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 12px 0;
  }

  .facility-save,
  .building-save {
    width: 100%;
  }

  .building-import {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .building-status {
    grid-column: auto;
  }
}
</style>
