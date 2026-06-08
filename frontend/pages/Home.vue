<template>
  <v-container class="admin-page">
    <v-row>
      <v-col style="text-align: start">
        <h1 class="mb-0">จัดที่นั่งสอบ</h1>
        <v-btn :to="'/ExamSelect'" > Go </v-btn>
      </v-col>
      <v-col style="text-align: start">
        <h1 class="mb-0">ประวัติการจัดห้องสอบ</h1>
        <v-btn :to="'/Organization'" > Go </v-btn>
      </v-col>
      <v-col style="text-align: start">
        <h1 class="mb-0">นำเข้าข้อมูลหลังบ้าน</h1>
        <ul>
          <li>ปฏิทิน</li>
          <li>เพิ่มข้อมูลผู้สมัคร</li>
          <li>เพิ่มข้อมูลสถานที่สอบ</li>
        </ul>
        <v-btn :to="'/Admin'" > Go </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
