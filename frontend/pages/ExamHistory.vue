<template>
  <v-row style="justify-content: center" no-gutters>
    <v-col cols="8">
      <v-container class="admin-page">
        <v-row>
          <v-col style="text-align: center;">
            <p class="page-title mb-0">
              ประวัติการจัดสอบ
            </p>
          </v-col>
        </v-row>
        <v-divider class="my-3" />
        <v-simple-table>
          <template #default>
            <thead>
              <tr>
                <th class="text-left">
                  หน่วยงาน
                </th>
                <th class="text-left">
                  รอบสอบ
                </th>
                <th class="text-left">
                  สถานที่สอบ
                </th>
                <th class="text-left">
                  สถานะ
                </th>
                <th class="text-left" />
                <th class="text-left" />
                <th class="text-left" />
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item) in data" :key="item.name">
                <td>{{ item.name }}</td>
                <td>{{ item.exam }}</td>
                <td>{{ item.facility }}</td>
                <td>{{ item.status }}</td>
                <td>
                  <v-btn
                    small
                    outlined
                    class="btn-action"
                    prepend-icon="mdi-chart-box-outline"
                  >
                    {{ item.summary }}
                  </v-btn>
                </td>
                <td>
                  <v-btn
                    small
                    outlined
                    class="btn-action"
                    prepend-icon="mdi-pencil-outline"
                  >
                    {{ item.edit }}
                  </v-btn>
                </td>
                <td>
                  <v-btn
                    small
                    outlined
                    class="btn-action"
                    prepend-icon="mdi-delete-outline"
                  >
                    {{ item.delete }}
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-container>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: 'ExamHistory',
  data () {
    return {
      data: [
        { name: 'สำนักงาน ป.ป.ช.', exam: 'สอบวันอาทิตย์ที่ 22 มีนาคม 2569 เวลา 09:00 - 12:00 น.', facility: 'มหาวิทยาลัยสวนดุสิต_nacc', status: 'Opened', summary: 'สรุปภาพรวม', edit: 'จัดใหม่', delete: 'ลบ' },
        { name: 'กรมท่าอากาศยาน', exam: 'สอบวันเสาร์ที่ 14 มีนาคม 2569 เวลา 09:00 - 12:00 น.', facility: 'มหาวิทยาลัยราชภัฏสวนสุนันทา_airport', status: 'Opened', summary: 'สรุปภาพรวม', edit: 'จัดใหม่', delete: 'ลบ' },
        { name: 'กรมท่าอากาศยาน', exam: 'สอบวันเสาร์ที่ 14 มีนาคม 2569 เวลา 09:00 - 12:00 น.', facility: 'มหาวิทยาลัยราชภัฏสวนสุนันทา_airport', status: 'Opened', summary: 'สรุปภาพรวม', edit: 'จัดใหม่', delete: 'ลบ' },
        { name: 'องค์การเภสัชกรรม', exam: 'สอบวันอาทิตย์ที่ 1 มีนาคม 2569 เวลา 09:00 - 11:00 น.', facility: 'มหาวิทยาลัยสวนดุสิต_GPO', status: 'Opened', summary: 'สรุปภาพรวม', edit: 'จัดใหม่', delete: 'ลบ' },
        { name: 'สำนักงานปลัดกระทรวงคมนาคม', exam: 'สอบวันอังคารที่ 3 มีนาคม 2569 เวลา 08:00 - 08:30 น.', facility: 'มหาวิทยาลัยราชภัฏสวนสุนันทา_MOI', status: 'Opened', summary: 'สรุปภาพรวม', edit: 'จัดใหม่', delete: 'ลบ' }
      ]
    }
  }
}
</script>
