<template>
  <v-row style="justify-content: center;" no-gutters>
    <v-col cols="8">
      <v-container class="admin-page">
        <v-row>
          <v-col style="text-align: start;">
            <h1 class="mb-0">
              เพิ่มข้อมูลผู้สมัคร
            </h1>
            <v-btn :to="'/Organizations/OrganizationList'" color="primary">
              Go
            </v-btn>
          </v-col>
          <v-col style="text-align: start">
            <h1 class="mb-0">
              เพิ่มข้อมูลสถานที่สอบ
            </h1>
            <v-btn :to="'/Admins/FacilityList'" color="primary">
              Go
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
  </v-row>
</template>
