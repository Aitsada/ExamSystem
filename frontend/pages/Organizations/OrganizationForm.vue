<template>
  <v-container>
    <v-row>
      <v-col style="text-align: center;">
        <h1>{{ pageTitle }}</h1>
      </v-col>
    </v-row>
    <v-divider class="my-5" />

    <v-form>
      <v-row>
        <v-col>
          <p>ชื่อหน่วยงาน:</p>
        </v-col>
        <v-col>
          <v-text-field
            v-model="organ.Name"
            outlined
            dense
            :rules="[v => !!v || 'กรุณากรอกชื่อหน่วยงาน']"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <p>รายละเอียด:</p>
        </v-col>
        <v-col>
          <v-text-field
            v-model="organ.Description"
            outlined
            dense
            required
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <p>โลโก้:</p>
        </v-col>
        <v-col>
          <v-file-input
            dense
            outlined
            hide-details
            show-size
            prepend-icon=""
            placeholder="Choose File | No file chosen"
          />
        </v-col>
      </v-row>
      <v-btn color="primary" @click="saveAddData">
        บันทึกข้อมูลหน่วยงาน
      </v-btn>
      <v-divider class="my-5" />

      <v-row>
        <v-col>
          <v-simple-table v-if="isEditMode">
            <template #default>
              <thead>
                <tr>
                  <th class="text-left">
                    ชื่อ
                  </th>
                  <th class="text-left">
                    สถานะ
                  </th>
                  <th class="text-left">
                    รายละเอียด
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in exam"
                  :key="item.ID"
                >
                  <td>{{ item.Name }}</td>
                  <td>{{ getStatusName(item.StatusID) }}</td>
                  <td>
                    <v-btn small color="warning" :to="{path: 'ExamForm', query: {OrganID: organ.ID, ExamID: item.ID}}">
                      แก้ไข
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>
      <v-divider class="my-5" />
      <!-- <v-btn depressed color="warning" @click="testBtn">
        testBtn
      </v-btn> -->
      <v-btn v-if="isEditMode" color="primary" depressed :to="{ path: 'ExamForm', query: {OrganID: organ.ID} }">
        เพิ่มรอบสอบ
      </v-btn>
    </v-form>
  </v-container>
</template>
<script>
export default {
  name: 'OrganizationForm',
  data () {
    return {
      loading: false,
      isEditMode: false,
      statusMap: {
        0: 'None',
        1: 'Opened',
        2: 'Canceled',
        3: 'Completed'
      },
      organ: { ID: '', Name: '', Description: '' },
      exam: []
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
      await this.fetchExamData(organId)
    }
  },
  methods: {
    testBtn () {
      console.log(this.organ.ID)
    },
    getStatusName (statusID) {
      return this.statusMap[Number(statusID)] || '-'
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
    async fetchExamData (organID) {
      try {
        const result = await this.$axios.$get(this.$apiUrl(`/api/${organID}/exam`))
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
      this.loading = true
      if (this.isEditMode === true) {
        try {
          await this.$axios.$patch(this.$apiUrl(`api/organization/${this.organ.ID}`), { Name: this.organ.Name, Description: this.organ.Description })
          this.$swal.fire({
            icon: 'success',
            text: 'แก้ไขข้อมูลหน่วยงานสำเร็จ'
          })
        } catch (error) {
          const message = error.response?.data?.message

          this.$swal.fire({
            icon: 'error',
            text: `ไม่สามารถแก้ไขข้อมูลหน่วยงานได้ ${message}`
          })
        }
      } else {
        try {
          await this.$axios.$post(this.$apiUrl('/api/organization'), { Name: this.organ.Name, Description: this.organ.Description })
          this.$swal.fire({
            icon: 'success',
            text: 'เพิ่มข้อมูลหน่วยงานสำเร็จ'
          })
        } catch (error) {
          const message = error.response?.data?.message
          this.$swal.fire({
            icon: 'error',
            text: `ไม่สามารถเพิ่มข้อมูลหน่วยงานได้ ${message}`
          })
        }
      }
    }
  }
}
</script>
